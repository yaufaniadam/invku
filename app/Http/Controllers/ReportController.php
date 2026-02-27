<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $invoices = $user->invoices()->with('client:id,name,company')->get();

        $totalRevenue = $invoices->where('status', 'paid')->sum('total_amount');
        $totalOutstanding = $invoices->whereIn('status', ['sent', 'overdue'])->sum('total_amount');
        $totalInvoices = $invoices->count();
        $paidInvoices = $invoices->where('status', 'paid')->count();

        // Revenue by month
        $monthlyData = $invoices
            ->groupBy(fn ($inv) => $inv->issue_date->format('Y-m'))
            ->map(fn ($group, $month) => [
                'month' => $month,
                'revenue' => (float) $group->where('status', 'paid')->sum('total_amount'),
                'outstanding' => (float) $group->whereIn('status', ['sent', 'overdue'])->sum('total_amount'),
                'invoices' => $group->count(),
            ])
            ->sortKeys()
            ->values();

        // Client reports
        $search = $request->input('search');
        $sort = $request->input('sort');

        $clientReports = $invoices
            ->groupBy('client_id')
            ->map(fn ($group) => [
                'id' => $group->first()->client_id,
                'name' => $group->first()->client?->name ?? 'Unknown',
                'company' => $group->first()->client?->company ?? '',
                'total_invoiced' => (float) $group->sum('total_amount'),
                'total_paid' => (float) $group->where('status', 'paid')->sum('total_amount'),
                'outstanding' => (float) $group->whereIn('status', ['sent', 'overdue'])->sum('total_amount'),
                'invoice_count' => $group->count(),
            ])
            ->when($search, function ($collection, $search) {
                return $collection->filter(function ($client) use ($search) {
                    return stripos($client['name'], $search) !== false || 
                           stripos($client['company'], $search) !== false;
                });
            })
            ->when($sort, function ($collection, $sort) {
                return match ($sort) {
                    'highest_outstanding' => $collection->sortByDesc('outstanding'),
                    'highest_revenue' => $collection->sortByDesc('total_paid'),
                    'most_invoices' => $collection->sortByDesc('invoice_count'),
                    'name_asc' => $collection->sortBy('name', SORT_NATURAL | SORT_FLAG_CASE),
                    default => $collection->sortByDesc('total_invoiced'),
                };
            }, function ($collection) {
                return $collection->sortByDesc('total_invoiced');
            })
            ->values();

        return Inertia::render('Reports/Index', [
            'stats' => [
                'totalRevenue' => (float) $totalRevenue,
                'totalOutstanding' => (float) $totalOutstanding,
                'totalInvoices' => $totalInvoices,
                'paidInvoices' => $paidInvoices,
            ],
            'monthlyData' => $monthlyData,
            'clientReports' => $clientReports,
            'filters' => $request->only('search', 'sort'),
            'currency' => $user->profile?->currency ?? 'IDR',
        ]);
    }
}
