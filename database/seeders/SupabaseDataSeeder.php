<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\Profile;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SupabaseDataSeeder extends Seeder
{
    /**
     * Map Supabase user_id (UUID) → Laravel user_id (integer).
     */
    private array $userMap = [];

    public function run(): void
    {
        $this->seedUsers();
        $this->seedProfiles();
        $this->seedClients();
        $this->seedInvoices();
        $this->seedInvoiceItems();
        $this->seedPayments();
        $this->seedUserRoles();
    }

    private function readCsv(string $filename): array
    {
        $path = database_path("data/{$filename}");
        if (! file_exists($path)) {
            $this->command?->warn("File not found: {$path}");
            return [];
        }

        $rows = [];
        $handle = fopen($path, 'r');
        $headers = fgetcsv($handle);

        // Clean BOM from first header
        if ($headers) {
            $headers[0] = preg_replace('/^\xEF\xBB\xBF/', '', $headers[0]);
            $headers = array_map('trim', $headers);
        }

        while (($data = fgetcsv($handle)) !== false) {
            if (count($data) === count($headers)) {
                $rows[] = array_combine($headers, $data);
            }
        }

        fclose($handle);
        return $rows;
    }

    private function seedUsers(): void
    {
        $profiles = $this->readCsv('profiles_rows.csv');

        // Get unique user_ids from profiles
        $supabaseUserIds = array_unique(array_column($profiles, 'user_id'));

        foreach ($supabaseUserIds as $supabaseUserId) {
            $profileRow = collect($profiles)->firstWhere('user_id', $supabaseUserId);

            $user = User::create([
                'name' => $profileRow['full_name'] ?: 'User',
                'email' => $profileRow['company_email'] ?: $supabaseUserId . '@imported.local',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]);

            $this->userMap[$supabaseUserId] = $user->id;
        }

        $this->command?->info('Seeded ' . count($this->userMap) . ' users.');
    }

    private function seedProfiles(): void
    {
        $rows = $this->readCsv('profiles_rows.csv');

        foreach ($rows as $row) {
            $userId = $this->userMap[$row['user_id']] ?? null;
            if (! $userId) continue;

            Profile::create([
                'id' => $row['id'],
                'user_id' => $userId,
                'full_name' => $row['full_name'] ?: null,
                'avatar_url' => $row['avatar_url'] ?: null,
                'company_name' => $row['company_name'] ?: null,
                'company_address' => $row['company_address'] ?: null,
                'company_phone' => $row['company_phone'] ?: null,
                'company_email' => $row['company_email'] ?: null,
                'company_website' => $row['company_website'] ?: null,
                'tax_id' => $row['tax_id'] ?: null,
                'logo_url' => $row['logo_url'] ?: null,
                'default_tax_rate' => (float) ($row['default_tax_rate'] ?? 0),
                'default_payment_terms' => $row['default_payment_terms'] ?: 'Net 30',
                'default_invoice_notes' => $row['default_invoice_notes'] ?: null,
                'invoice_number_prefix' => $row['invoice_number_prefix'] ?: 'INV',
                'currency' => $row['currency'] ?: 'IDR',
                'timezone' => $row['timezone'] ?: 'Asia/Jakarta',
                'date_format' => $row['date_format'] ?: 'dd/MM/yyyy',
                'language' => $row['language'] ?: 'id',
            ]);
        }

        $this->command?->info('Seeded ' . count($rows) . ' profiles.');
    }

    private function seedClients(): void
    {
        $rows = $this->readCsv('clients_rows.csv');

        foreach ($rows as $row) {
            $userId = $this->userMap[$row['user_id']] ?? null;
            if (! $userId) continue;

            Client::create([
                'id' => $row['id'],
                'user_id' => $userId,
                'name' => $row['name'],
                'email' => $row['email'] ?: null,
                'phone' => $row['phone'] ?: null,
                'address' => $row['address'] ?: null,
                'company' => $row['company'] ?: null,
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at'],
            ]);
        }

        $this->command?->info('Seeded ' . count($rows) . ' clients.');
    }

    private function seedInvoices(): void
    {
        $rows = $this->readCsv('invoices_rows.csv');

        foreach ($rows as $row) {
            $userId = $this->userMap[$row['user_id']] ?? null;
            if (! $userId) continue;

            Invoice::create([
                'id' => $row['id'],
                'user_id' => $userId,
                'client_id' => $row['client_id'],
                'invoice_number' => $row['invoice_number'],
                'issue_date' => $row['issue_date'],
                'due_date' => $row['due_date'],
                'status' => $row['status'],
                'subtotal' => (float) $row['subtotal'],
                'tax_rate' => (float) $row['tax_rate'],
                'tax_amount' => (float) $row['tax_amount'],
                'total_amount' => (float) $row['total_amount'],
                'notes' => $row['notes'] ?: null,
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at'],
            ]);
        }

        $this->command?->info('Seeded ' . count($rows) . ' invoices.');
    }

    private function seedInvoiceItems(): void
    {
        $rows = $this->readCsv('invoice_items_rows.csv');

        foreach ($rows as $row) {
            InvoiceItem::create([
                'id' => $row['id'],
                'invoice_id' => $row['invoice_id'],
                'description' => $row['description'],
                'quantity' => (float) $row['quantity'],
                'unit_price' => (float) $row['unit_price'],
                'total' => (float) $row['total'],
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at'],
            ]);
        }

        $this->command?->info('Seeded ' . count($rows) . ' invoice items.');
    }

    private function seedPayments(): void
    {
        $rows = $this->readCsv('payments_rows.csv');

        foreach ($rows as $row) {
            $userId = $this->userMap[$row['user_id']] ?? null;
            $recordedBy = $this->userMap[$row['recorded_by']] ?? $userId;
            if (! $userId) continue;

            Payment::create([
                'id' => $row['id'],
                'user_id' => $userId,
                'invoice_id' => $row['invoice_id'] ?: null,
                'client_id' => $row['client_id'] ?: null,
                'amount' => (float) $row['amount'],
                'payment_date' => $row['payment_date'],
                'payment_method' => $row['payment_method'] ?: null,
                'payment_type' => $row['payment_type'] ?: 'payment',
                'reference_number' => $row['reference_number'] ?: null,
                'notes' => $row['notes'] ?: null,
                'recorded_by' => $recordedBy,
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at'],
            ]);
        }

        $this->command?->info('Seeded ' . count($rows) . ' payments.');
    }

    private function seedUserRoles(): void
    {
        $rows = $this->readCsv('user_roles_rows.csv');

        foreach ($rows as $row) {
            $userId = $this->userMap[$row['user_id']] ?? null;
            if (! $userId) continue;

            UserRole::create([
                'id' => $row['id'],
                'user_id' => $userId,
                'role' => $row['role'],
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at'],
            ]);
        }

        $this->command?->info('Seeded ' . count($rows) . ' user roles.');
    }
}
