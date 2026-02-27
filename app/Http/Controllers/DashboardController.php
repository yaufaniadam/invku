<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $invoices = $user->invoices()->with('client:id,name')->latest()->get();

        $totalRevenue = $invoices->where('status', 'paid')->sum('total_amount');
        $outstandingAmount = $invoices->whereIn('status', ['pending', 'sent', 'overdue'])->sum('total_amount');
        $totalInvoices = $invoices->count();
        $activeClients = $user->clients()->count();

        $recentInvoices = $invoices->take(5)->map(fn (Invoice $invoice) => [
            'id' => $invoice->id,
            'number' => $invoice->invoice_number,
            'client' => $invoice->client?->name ?? 'Unknown',
            'amount' => $invoice->total_amount,
            'status' => $invoice->status,
            'date' => $invoice->issue_date->format('d M Y'),
        ]);

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalRevenue' => (float) $totalRevenue,
                'outstandingAmount' => (float) $outstandingAmount,
                'totalInvoices' => $totalInvoices,
                'activeClients' => $activeClients,
            ],
            'recentInvoices' => $recentInvoices,
            'currency' => $user->profile?->currency ?? 'IDR',
        ]);
    }
}
