<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DepositController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $search = $request->input('search');
        $sort = $request->input('sort');

        $deposits = $user->payments()
            ->where('payment_type', 'deposit')
            ->with('client:id,name,company')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('amount', 'like', "%{$search}%")
                      ->orWhere('payment_method', 'like', "%{$search}%")
                      ->orWhereHas('client', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->when($sort, function ($query, $sort) {
                match ($sort) {
                    'oldest' => $query->oldest('payment_date'),
                    'highest' => $query->orderBy('amount', 'desc'),
                    'lowest' => $query->orderBy('amount', 'asc'),
                    default => $query->latest('payment_date'),
                };
            }, function ($query) {
                $query->latest('payment_date');
            })
            ->get()
            ->map(fn ($deposit) => [
                'id' => $deposit->id,
                'client_name' => $deposit->client?->name ?? '-',
                'client_company' => $deposit->client?->company ?? '-',
                'amount' => (float) $deposit->amount,
                'payment_date' => $deposit->payment_date->format('Y-m-d'),
                'payment_method' => $deposit->payment_method,
                'reference_number' => $deposit->reference_number,
                'notes' => $deposit->notes,
            ]);

        // Client deposit balances
        $clientBalances = DB::table('clients')
            ->where('clients.user_id', $user->id)
            ->join('payments', 'clients.id', '=', 'payments.client_id')
            ->select([
                'clients.id as client_id',
                'clients.name as client_name',
                DB::raw("SUM(CASE WHEN payments.payment_type = 'deposit' THEN payments.amount ELSE 0 END) as total_deposit"),
                DB::raw("SUM(CASE WHEN payments.payment_type = 'payment' AND payments.payment_method = 'deposit' THEN payments.amount ELSE 0 END) as used_deposit"),
                DB::raw("SUM(CASE WHEN payments.payment_type = 'deposit' THEN payments.amount ELSE 0 END) - SUM(CASE WHEN payments.payment_type = 'payment' AND payments.payment_method = 'deposit' THEN payments.amount ELSE 0 END) as outstanding_balance"),
            ])
            ->groupBy('clients.id', 'clients.name')
            ->havingRaw("SUM(CASE WHEN payments.payment_type = 'deposit' THEN payments.amount ELSE 0 END) > 0")
            ->get();

        return Inertia::render('Deposits/Index', [
            'deposits' => $deposits,
            'clientBalances' => $clientBalances,
            'clients' => $user->clients()->orderBy('name')->get(['id', 'name']),
            'filters' => $request->only('search', 'sort'),
            'currency' => $user->profile?->currency ?? 'IDR',
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'client_id' => 'required|uuid|exists:clients,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'payment_method' => 'nullable|string|max:50',
            'reference_number' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:500',
        ]);

        $request->user()->payments()->create([
            ...$validated,
            'payment_type' => 'deposit',
            'recorded_by' => $request->user()->id,
        ]);

        return back()->with('success', 'Deposit berhasil dicatat.');
    }
}
