<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class SubscriptionController extends Controller
{
    public function index()
    {
        $subscriptions = Auth::user()->subscriptions()->latest()->get();
        // Calculate total monthly recurring cost
        $totalMonthlyCost = $subscriptions->where('status', 'active')->sum(function ($subscription) {
            if ($subscription->billing_cycle === 'yearly') {
                return $subscription->amount / 12;
            } elseif ($subscription->billing_cycle === 'weekly') {
                return $subscription->amount * 4.33; // Approx weeks in a month
            } elseif ($subscription->billing_cycle === 'daily') {
                return $subscription->amount * 30;
            }
            return $subscription->amount; // Monthly
        });

        return Inertia::render('Subscriptions/Index', [
            'subscriptions' => $subscriptions,
            'totalMonthlyCost' => $totalMonthlyCost,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'billing_cycle' => 'required|in:monthly,yearly,weekly,daily',
            'next_billing_date' => 'nullable|date',
            'status' => 'required|in:active,inactive',
            'notes' => 'nullable|string',
        ]);

        Auth::user()->subscriptions()->create($validated);

        return back()->with('success', 'Langganan berhasil ditambahkan.');
    }

    public function update(Request $request, Subscription $subscription)
    {
        if ($subscription->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'billing_cycle' => 'required|in:monthly,yearly,weekly,daily',
            'next_billing_date' => 'nullable|date',
            'status' => 'required|in:active,inactive',
            'notes' => 'nullable|string',
        ]);

        $subscription->update($validated);

        return back()->with('success', 'Langganan berhasil diperbarui.');
    }

    public function destroy(Subscription $subscription)
    {
        if ($subscription->user_id !== Auth::id()) {
            abort(403);
        }

        $subscription->delete();

        return back()->with('success', 'Langganan berhasil dihapus.');
    }
}
