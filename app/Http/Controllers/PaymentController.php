<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        
        $payments = $request->user()
            ->payments()
            ->with([
                'invoice:id,invoice_number',
                'invoice.client:id,name',
                'client:id,name',
            ])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('amount', 'like', "%{$search}%")
                      ->orWhere('payment_method', 'like', "%{$search}%")
                      ->orWhereHas('client', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      })
                      ->orWhereHas('invoice', function ($q) use ($search) {
                          $q->where('invoice_number', 'like', "%{$search}%");
                      });
                });
            })
            ->when($request->input('sort'), function ($query, $sort) {
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
            ->map(fn ($payment) => [
                'id' => $payment->id,
                'invoice_id' => $payment->invoice_id,
                'invoice_number' => $payment->invoice?->invoice_number,
                'client_name' => $payment->invoice?->client?->name ?? $payment->client?->name ?? '-',
                'amount' => (float) $payment->amount,
                'payment_date' => $payment->payment_date->format('Y-m-d'),
                'payment_method' => $payment->payment_method,
                'payment_type' => $payment->payment_type,
                'reference_number' => $payment->reference_number,
                'notes' => $payment->notes,
            ]);

        return Inertia::render('Payments/Index', [
            'payments' => $payments,
            'filters' => $request->only('search', 'sort'),
            'currency' => $request->user()->profile?->currency ?? 'IDR',
        ]);
    }
}
