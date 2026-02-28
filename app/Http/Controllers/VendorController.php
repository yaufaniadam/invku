<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VendorController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $vendors = $request->user()
            ->vendors()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('type', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when($request->input('sort'), function ($query, $sort) {
                match ($sort) {
                    'oldest' => $query->oldest(),
                    'name_asc' => $query->orderBy('name', 'asc'),
                    'name_desc' => $query->orderBy('name', 'desc'),
                    default => $query->latest(),
                };
            }, function ($query) {
                $query->latest();
            })
            ->get();

        return Inertia::render('Vendors/Index', [
            'vendors' => $vendors,
            'filters' => $request->only('search', 'sort'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:vendor,person,partner',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
        ]);

        $request->user()->vendors()->create($validated);

        return back()->with('success', 'Vendor berhasil ditambahkan.');
    }

    public function update(Request $request, Vendor $vendor): RedirectResponse
    {
        if ($vendor->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:vendor,person,partner',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
        ]);

        $vendor->update($validated);

        return back()->with('success', 'Vendor berhasil diperbarui.');
    }

    public function destroy(Request $request, Vendor $vendor): RedirectResponse
    {
        if ($vendor->user_id !== $request->user()->id) {
            abort(403);
        }

        $vendor->delete();

        return back()->with('success', 'Vendor berhasil dihapus.');
    }
}
