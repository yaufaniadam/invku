<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class SettingsController extends Controller
{
    /**
     * Display the settings page.
     */
    public function edit(Request $request): Response
    {
        $profile = $request->user()->profile;

        return Inertia::render('settings/Index', [
            'profile' => $profile
        ]);
    }

    /**
     * Update the user's company profile settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $profile = $request->user()->profile;

        $validated = $request->validate([
            'company_name' => 'nullable|string|max:255',
            'company_address' => 'nullable|string|max:1000',
            'company_phone' => 'nullable|string|max:50',
            'company_email' => 'nullable|email|max:255',
            'company_website' => 'nullable|string|max:255',
            'tax_id' => 'nullable|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // 2MB Max
            'bank_name' => 'nullable|string|max:100',
            'bank_account_number' => 'nullable|string|max:100',
            'bank_account_name' => 'nullable|string|max:255',
            'default_invoice_notes' => 'nullable|string|max:2000',
        ]);

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($profile->logo_url) {
                // Determine if it's a local storage path vs external URL
                $oldPath = str_replace('/storage/', '', parse_url($profile->logo_url, PHP_URL_PATH));
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $path = $request->file('logo')->store('logos', 'public');
            $validated['logo_url'] = '/storage/' . $path;
        }
        
        // Unset the 'logo' file input from validated array before updating model
        unset($validated['logo']);

        $profile->update($validated);

        return back()->with('success', 'Pengaturan perusahaan berhasil diperbarui.');
    }
}
