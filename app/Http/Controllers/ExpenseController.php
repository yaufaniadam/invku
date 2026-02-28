<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Subscription;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $search = $request->input('search');
        $sort = $request->input('sort');
        $category = $request->input('category');

        $expenses = $user->expenses()
            ->with('order:id,order_number,client_id,title', 'order.client:id,name')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('description', 'like', "%{$search}%")
                      ->orWhere('vendor_name', 'like', "%{$search}%")
                      ->orWhere('reference_number', 'like', "%{$search}%")
                      ->orWhereHas('order', function ($q) use ($search) {
                          $q->where('order_number', 'like', "%{$search}%")
                            ->orWhere('title', 'like', "%{$search}%");
                      });
                });
            })
            ->when($category && $category !== 'all', function ($query) use ($category) {
                $query->where('category', $category);
            })
            ->when($sort, function ($query, $sort) {
                match ($sort) {
                    'oldest' => $query->oldest('expense_date'),
                    'highest' => $query->orderBy('amount', 'desc'),
                    'lowest' => $query->orderBy('amount', 'asc'),
                    default => $query->latest('expense_date'),
                };
            }, function ($query) {
                $query->latest('expense_date');
            })
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Expense $expense) => [
                'id' => $expense->id,
                'category' => $expense->category,
                'category_label' => $expense->category_label,
                'description' => $expense->description,
                'amount' => (float) $expense->amount,
                'expense_date' => $expense->expense_date->format('Y-m-d'),
                'payment_method' => $expense->payment_method,
                'reference_number' => $expense->reference_number,
                'vendor_name' => $expense->vendor_name,
                'notes' => $expense->notes,
                'order_id' => $expense->order_id,
                'order_number' => $expense->order?->order_number,
                'order_title' => $expense->order?->title,
                'order_client' => $expense->order?->client?->name,
                'is_recurring' => $expense->is_recurring,
            ]);

        // Summary stats
        $totalThisMonth = $user->expenses()
            ->whereMonth('expense_date', now()->month)
            ->whereYear('expense_date', now()->year)
            ->sum('amount');
            
        $totalLastMonth = $user->expenses()
            ->whereMonth('expense_date', now()->subMonth()->month)
            ->whereYear('expense_date', now()->subMonth()->year)
            ->sum('amount');

        $totalAllTime = $user->expenses()->sum('amount');

        $categoryTotals = $user->expenses()
            ->whereMonth('expense_date', now()->month)
            ->whereYear('expense_date', now()->year)
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->pluck('total', 'category')
            ->toArray();

        // Orders for the selector
        $orders = $user->orders()
            ->with('client:id,name')
            ->latest('created_at')
            ->get(['id', 'order_number', 'title', 'client_id'])
            ->map(fn ($ord) => [
                'id' => $ord->id,
                'label' => $ord->order_number . ' — ' . $ord->title . ' (' . ($ord->client?->name ?? '-') . ')',
            ]);

        // Fetch custom categories that the user has added
        $customCategories = $user->expenses()
            ->select('category')
            ->distinct()
            ->pluck('category')
            ->filter(fn($cat) => !array_key_exists($cat, Expense::CATEGORIES))
            ->mapWithKeys(fn($cat) => [$cat => ucfirst($cat)])
            ->toArray();

        $allCategories = array_merge(Expense::CATEGORIES, $customCategories);

        // Fetch vendors for the combobox
        $vendors = $user->vendors()
            ->orderBy('name')
            ->get(['id', 'name', 'type'])
            ->map(fn($v) => [
                'value' => $v->name,
                'label' => $v->name . ($v->type !== 'vendor' ? ' (' . ucfirst($v->type) . ')' : '')
            ]);

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,
            'totalThisMonth' => (float) $totalThisMonth,
            'totalLastMonth' => (float) $totalLastMonth,
            'totalLastMonth' => (float) $totalLastMonth,
            'totalAllTime' => (float) $totalAllTime,
            'categoryTotals' => $categoryTotals,
            'categories' => $allCategories,
            'paymentMethods' => Expense::PAYMENT_METHODS,
            'orders' => $orders,
            'vendors' => $vendors,
            'filters' => $request->only('search', 'sort', 'category'),
            'currency' => $user->profile?->currency ?? 'IDR',
            'defaultOrderId' => $request->query('order_id'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category' => 'required|string|max:50',
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'expense_date' => 'required|date',
            'payment_method' => 'nullable|string|max:50',
            'reference_number' => 'nullable|string|max:100',
            'vendor_name' => 'nullable|string|max:255',
            'order_id' => 'nullable|uuid|exists:orders,id',
            'notes' => 'nullable|string|max:1000',
            'is_recurring' => 'boolean',
        ]);

        if (!empty($validated['vendor_name'])) {
            $request->user()->vendors()->firstOrCreate(
                ['name' => $validated['vendor_name']],
                ['type' => 'vendor']
            );
        }

        $expense = $request->user()->expenses()->create($validated);

        if ($validated['is_recurring'] ?? false) {
            $request->user()->subscriptions()->create([
                'name' => $validated['vendor_name'] ?: $validated['description'],
                'amount' => $validated['amount'],
                'billing_cycle' => 'monthly', // default
                'next_billing_date' => Carbon::parse($validated['expense_date'])->addMonth(),
                'status' => 'active',
                'notes' => $validated['notes'],
            ]);
        }

        return back()->with('success', 'Pengeluaran berhasil dicatat' . (!empty($validated['is_recurring']) ? ' dan ditambahkan ke daftar langganan.' : '.'));
    }

    public function update(Request $request, Expense $expense): RedirectResponse
    {
        $this->authorizeOwnership($expense);

        $validated = $request->validate([
            'category' => 'required|string|max:50',
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'expense_date' => 'required|date',
            'payment_method' => 'nullable|string|max:50',
            'reference_number' => 'nullable|string|max:100',
            'vendor_name' => 'nullable|string|max:255',
            'order_id' => 'nullable|uuid|exists:orders,id',
            'notes' => 'nullable|string|max:1000',
            'is_recurring' => 'boolean',
        ]);

        if (!empty($validated['vendor_name'])) {
            $request->user()->vendors()->firstOrCreate(
                ['name' => $validated['vendor_name']],
                ['type' => 'vendor']
            );
        }

        $expense->update($validated);

        return back()->with('success', 'Pengeluaran berhasil diperbarui.');
    }

    public function destroy(Expense $expense): RedirectResponse
    {
        $this->authorizeOwnership($expense);

        $expense->delete();

        return back()->with('success', 'Pengeluaran berhasil dihapus.');
    }

    private function authorizeOwnership(Expense $expense): void
    {
        if ($expense->user_id !== auth()->id()) {
            abort(403);
        }
    }
}
