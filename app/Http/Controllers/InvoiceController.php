<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status']);

        $invoices = $request->user()
            ->invoices()
            ->with('client:id,name,email')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('invoice_number', 'like', "%{$search}%")
                        ->orWhereHas('client', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                              ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->get()
            ->map(fn (Invoice $invoice) => [
                'id' => $invoice->id,
                'invoice_number' => $invoice->invoice_number,
                'client' => $invoice->client,
                'issue_date' => $invoice->issue_date->format('Y-m-d'),
                'due_date' => $invoice->due_date->format('Y-m-d'),
                'status' => $invoice->status,
                'total_amount' => (float) $invoice->total_amount,
            ]);

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
            'filters' => $filters,
            'currency' => $request->user()->profile?->currency ?? 'IDR',
        ]);
    }

    public function create(Request $request): Response
    {
        $clients = $request->user()->clients()->orderBy('name')->get(['id', 'name', 'email']);
        $profile = $request->user()->profile;

        // Generate next invoice number
        $lastInvoice = $request->user()->invoices()->orderByDesc('invoice_number')->first();
        $prefix = $profile?->invoice_number_prefix ?? 'INV';
        $nextNumber = 1;
        if ($lastInvoice) {
            $lastNum = (int) str_replace($prefix . '-', '', $lastInvoice->invoice_number);
            $nextNumber = $lastNum + 1;
        }
        $invoiceNumber = $prefix . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

        return Inertia::render('Invoices/Form', [
            'clients' => $clients,
            'invoiceNumber' => $invoiceNumber,
            'defaultTaxRate' => (float) ($profile?->default_tax_rate ?? 0),
            'defaultNotes' => $profile?->default_invoice_notes ?? '',
            'currency' => $profile?->currency ?? 'IDR',
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'client_id' => 'required|uuid|exists:clients,id',
            'invoice_number' => 'required|string|max:50',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'status' => 'required|in:draft,sent,paid,overdue,cancelled',
            'tax_rate' => 'required|numeric|min:0|max:100',
            'notes' => 'nullable|string',
            'is_rounded' => 'required|boolean',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string|max:500',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $subtotal = collect($validated['items'])->sum(fn ($item) => $item['quantity'] * $item['unit_price']);
        $taxAmount = $subtotal * ($validated['tax_rate'] / 100);
        $totalAmount = $subtotal + $taxAmount;

        if ($validated['is_rounded']) {
            $totalAmount = ceil($totalAmount / 1000) * 1000;
        }

        $invoice = $request->user()->invoices()->create([
            'client_id' => $validated['client_id'],
            'invoice_number' => $validated['invoice_number'],
            'issue_date' => $validated['issue_date'],
            'due_date' => $validated['due_date'],
            'status' => $validated['status'],
            'subtotal' => $subtotal,
            'tax_rate' => $validated['tax_rate'],
            'tax_amount' => $taxAmount,
            'total_amount' => $totalAmount,
            'notes' => $validated['notes'] ?? null,
            'is_rounded' => $validated['is_rounded'],
        ]);

        foreach ($validated['items'] as $item) {
            $invoice->items()->create([
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total' => $item['quantity'] * $item['unit_price'],
            ]);
        }

        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Invoice berhasil dibuat.');
    }

    public function show(Invoice $invoice): Response
    {
        $this->authorize('view', $invoice);

        $invoice->load(['client', 'items', 'payments']);
        $profile = $invoice->user->profile;

        $clientDepositBalance = DB::table('payments')
            ->where('client_id', $invoice->client_id)
            ->selectRaw("SUM(CASE WHEN payment_type = 'deposit' THEN amount ELSE 0 END) - SUM(CASE WHEN payment_type = 'payment' AND payment_method = 'deposit' THEN amount ELSE 0 END) as balance")
            ->value('balance') ?? 0;

        return Inertia::render('Invoices/Show', [
            'invoice' => array_merge($invoice->toArray(), [
                'payments' => $invoice->payments,
                'balance_due' => (float) $invoice->balance_due,
            ]),
            'client_deposit_balance' => (float) $clientDepositBalance,
            'profile' => $profile,
            'currency' => $profile?->currency ?? 'IDR',
        ]);
    }

    public function edit(Request $request, Invoice $invoice): Response
    {
        $this->authorize('update', $invoice);

        $invoice->load('items');
        $clients = $request->user()->clients()->orderBy('name')->get(['id', 'name', 'email']);
        $profile = $request->user()->profile;

        return Inertia::render('Invoices/Form', [
            'invoice' => $invoice,
            'clients' => $clients,
            'invoiceNumber' => $invoice->invoice_number,
            'defaultTaxRate' => (float) $invoice->tax_rate,
            'defaultNotes' => $invoice->notes ?? '',
            'currency' => $profile?->currency ?? 'IDR',
        ]);
    }

    public function update(Request $request, Invoice $invoice): RedirectResponse
    {
        $this->authorize('update', $invoice);

        $validated = $request->validate([
            'client_id' => 'required|uuid|exists:clients,id',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'status' => 'required|in:draft,sent,paid,overdue,cancelled',
            'tax_rate' => 'required|numeric|min:0|max:100',
            'notes' => 'nullable|string',
            'is_rounded' => 'required|boolean',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string|max:500',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $subtotal = collect($validated['items'])->sum(fn ($item) => $item['quantity'] * $item['unit_price']);
        $taxAmount = $subtotal * ($validated['tax_rate'] / 100);
        $totalAmount = $subtotal + $taxAmount;

        if ($validated['is_rounded']) {
            $totalAmount = ceil($totalAmount / 1000) * 1000;
        }

        $invoice->update([
            'client_id' => $validated['client_id'],
            'issue_date' => $validated['issue_date'],
            'due_date' => $validated['due_date'],
            'status' => $validated['status'],
            'subtotal' => $subtotal,
            'tax_rate' => $validated['tax_rate'],
            'tax_amount' => $taxAmount,
            'total_amount' => $totalAmount,
            'notes' => $validated['notes'] ?? null,
            'is_rounded' => $validated['is_rounded'],
        ]);

        // Replace all items
        $invoice->items()->delete();
        foreach ($validated['items'] as $item) {
            $invoice->items()->create([
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total' => $item['quantity'] * $item['unit_price'],
            ]);
        }

        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Invoice berhasil diperbarui.');
    }

    public function updateStatus(Request $request, Invoice $invoice): RedirectResponse
    {
        $this->authorize('update', $invoice);

        $validated = $request->validate([
            'status' => 'required|in:draft,sent,paid,overdue,cancelled',
        ]);

        $invoice->update(['status' => $validated['status']]);

        return back()->with('success', 'Status invoice berhasil diperbarui.');
    }

    public function destroy(Invoice $invoice): RedirectResponse
    {
        $this->authorize('delete', $invoice);

        $invoice->delete();

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice berhasil dihapus.');
    }

    public function preview(Invoice $invoice): Response
    {
        $this->authorize('view', $invoice);

        $invoice->load(['client', 'items']);
        $profile = $invoice->user->profile;

        return Inertia::render('Invoices/Preview', [
            'invoice' => array_merge($invoice->toArray(), [
                'balance_due' => (float) $invoice->balance_due,
            ]),
            'profile' => $profile,
            'currency' => $profile?->currency ?? 'IDR',
        ]);
    }

    public function recordPayment(Request $request, Invoice $invoice): RedirectResponse
    {
        $this->authorize('update', $invoice);

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'guna_membayar' => 'nullable|string|max:500',
            'payment_method' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
            'proof' => 'nullable|image|max:2048',
        ]);

        if (($validated['payment_method'] ?? 'transfer') === 'deposit') {
            $clientDepositBalance = DB::table('payments')
                ->where('client_id', $invoice->client_id)
                ->selectRaw("SUM(CASE WHEN payment_type = 'deposit' THEN amount ELSE 0 END) - SUM(CASE WHEN payment_type = 'payment' AND payment_method = 'deposit' THEN amount ELSE 0 END) as balance")
                ->value('balance') ?? 0;

            if ($validated['amount'] > $clientDepositBalance) {
                return back()->withErrors(['amount' => 'Saldo deposit tidak mencukupi (Sisa: ' . number_format($clientDepositBalance, 0, ',', '.') . ')']);
            }
        }

        $proofPath = null;
        if ($request->hasFile('proof')) {
            $proofPath = $request->file('proof')->store('payments/proofs', 'public');
        }

        $invoice->payments()->create([
            'user_id' => $request->user()->id,
            'client_id' => $invoice->client_id,
            'amount' => $validated['amount'],
            'payment_date' => $validated['payment_date'],
            'payment_method' => $validated['payment_method'] ?? 'transfer',
            'guna_membayar' => $validated['guna_membayar'],
            'notes' => $validated['notes'] ?? null,
            'recorded_by' => $request->user()->id,
            'proof_path' => $proofPath,
        ]);

        // Update invoice status if fully paid
        if ($invoice->balance_due <= 0) {
            $invoice->update(['status' => 'paid']);
        }

        return back()->with('success', 'Pembayaran berhasil dicatat.');
    }

    public function receipt(Request $request, Invoice $invoice): Response
    {
        $this->authorize('view', $invoice);

        $invoice->load(['client', 'payments']);
        $profile = $invoice->user->profile;

        $paymentId = $request->query('payment_id');
        $activePayment = $paymentId 
            ? $invoice->payments()->find($paymentId)
            : $invoice->payments()->latest('payment_date')->first();

        // Custom terbilang for specific payment amount
        $invoice->custom_terbilang = $activePayment 
            ? $this->terbilang($activePayment->amount)
            : $invoice->terbilang;

        return Inertia::render('Invoices/Receipt', [
            'invoice' => $invoice,
            'profile' => $profile,
            'activePayment' => $activePayment,
            'currency' => $profile?->currency ?? 'IDR',
        ]);
    }

    private function terbilang(float $amount): string
    {
        $val = (int) round($amount);
        return ucwords(\Riskihajar\Terbilang\Facades\Terbilang::make($val)) . ' Rupiah';
    }

    public function receiptPdf(Request $request, Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        $invoice->load(['client', 'payments']);
        $profile = $invoice->user->profile;

        $paymentId = $request->query('payment_id');
        $activePayment = $paymentId 
            ? $invoice->payments()->find($paymentId)
            : $invoice->payments()->latest('payment_date')->first();

        $invoice->custom_terbilang = $activePayment 
            ? $this->terbilang($activePayment->amount)
            : $invoice->terbilang;

        $formatCurrency = function ($amount) use ($profile) {
            $currency = $profile->currency ?? 'IDR';
            $fmt = new \NumberFormatter($currency === 'IDR' ? 'id_ID' : 'en_US', \NumberFormatter::CURRENCY);
            $fmt->setAttribute(\NumberFormatter::FRACTION_DIGITS, $currency === 'IDR' ? 0 : 2);
            return $fmt->formatCurrency($amount, $currency);
        };

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('invoices.receipt', [
            'invoice' => $invoice,
            'profile' => $profile,
            'activePayment' => $activePayment,
            'formatCurrency' => $formatCurrency,
        ]);

        return $pdf->download("Receipt-{$invoice->invoice_number}.pdf");
    }

    public function pdf(Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        $invoice->load(['client', 'items']);
        $profile = $invoice->user->profile;
        $formatCurrency = $this->currencyFormatter($profile?->currency ?? 'IDR');

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('invoices.pdf', [
            'invoice' => $invoice,
            'profile' => $profile,
            'formatCurrency' => $formatCurrency,
            'isPdf' => true,
        ]);

        $pdf->setPaper('a4', 'portrait');

        return $pdf->download("Invoice-{$invoice->invoice_number}.pdf");
    }

    private function currencyFormatter(string $currency): \Closure
    {
        return function (float $amount) use ($currency): string {
            if ($currency === 'IDR') {
                return 'Rp ' . number_format($amount, 0, ',', '.');
            }
            return $currency . ' ' . number_format($amount, 2, '.', ',');
        };
    }
}
