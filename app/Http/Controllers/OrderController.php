<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $search = $request->input('search');
        $status = $request->input('status');

        $orders = $user->orders()
            ->with('client:id,name')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('order_number', 'like', "%{$search}%")
                      ->orWhereHas('client', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->when($status && $status !== 'all', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderBy('start_date', 'desc')
            ->latest()
            ->get()
            ->map(fn (Order $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'title' => $order->title,
                'client_id' => $order->client_id,
                'client_name' => $order->client?->name,
                'status' => $order->status,
                'status_label' => $order->label_status,
                'start_date' => $order->start_date?->format('Y-m-d'),
                'end_date' => $order->end_date?->format('Y-m-d'),
            ]);

        $clients = $user->clients()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'clients' => $clients,
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'client_id' => 'required|uuid|exists:clients,id',
            'title' => 'required|string|max:255',
            'status' => 'required|in:pending,in_progress,completed,cancelled',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'notes' => 'nullable|string',
        ]);

        $prefix = 'ORD-' . date('Y') . '-';
        $lastOrder = $request->user()->orders()
            ->where('order_number', 'like', "{$prefix}%")
            ->orderBy('order_number', 'desc')
            ->first();

        if ($lastOrder) {
            $lastNumber = (int) str_replace($prefix, '', $lastOrder->order_number);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = $request->user()->orders()->count() + 1;
        }

        $validated['order_number'] = $prefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        while (Order::where('order_number', $validated['order_number'])->exists()) {
            $nextNumber++;
            $validated['order_number'] = $prefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
        }

        $request->user()->orders()->create($validated);

        return back()->with('success', 'Pesanan berhasil dibuat.');
    }

    public function show(Order $order): Response
    {
        $this->authorizeOwnership($order);

        $order->load(['client', 'invoices' => function ($q) {
            $q->latest('issue_date');
        }, 'expenses' => function ($q) {
            $q->latest('expense_date');
        }]);

        $totalInvoiced = $order->invoices->where('status', 'paid')->sum('total_amount');
        $totalUnpaid = $order->invoices->whereIn('status', ['draft', 'sent', 'overdue'])->sum('total_amount');
        $totalExpenses = $order->expenses->sum('amount');
        $profit = $totalInvoiced - $totalExpenses;

        return Inertia::render('Orders/Show', [
            'order' => array_merge($order->toArray(), [
                'status_label' => $order->label_status,
            ]),
            'invoices' => $order->invoices->map(fn($inv) => array_merge($inv->toArray(), [
                'label_status' => $inv->label_status,
            ])),
            'expenses' => $order->expenses->map(fn($exp) => array_merge($exp->toArray(), [
                'category_label' => $exp->category_label,
            ])),
            'stats' => [
                'total_invoiced' => (float) $totalInvoiced,
                'total_unpaid' => (float) $totalUnpaid,
                'total_expenses' => (float) $totalExpenses,
                'profit' => (float) $profit,
            ],
            'currency' => $order->user->profile?->currency ?? 'IDR',
        ]);
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        $this->authorizeOwnership($order);

        $validated = $request->validate([
            'client_id' => 'required|uuid|exists:clients,id',
            'order_number' => 'required|string|unique:orders,order_number,' . $order->id,
            'title' => 'required|string|max:255',
            'status' => 'required|in:pending,in_progress,completed,cancelled',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'notes' => 'nullable|string',
        ]);

        $order->update($validated);

        return back()->with('success', 'Pesanan berhasil diperbarui.');
    }

    public function destroy(Order $order): RedirectResponse
    {
        $this->authorizeOwnership($order);
        
        $order->delete();

        return redirect()->route('orders.index')->with('success', 'Pesanan berhasil dihapus.');
    }

    private function authorizeOwnership(Order $order): void
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }
    }
}
