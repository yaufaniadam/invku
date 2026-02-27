<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('full_name')->nullable();
            $table->string('avatar_url')->nullable();
            $table->string('company_name')->nullable();
            $table->text('company_address')->nullable();
            $table->string('company_phone')->nullable();
            $table->string('company_email')->nullable();
            $table->string('company_website')->nullable();
            $table->string('tax_id')->nullable();
            $table->string('logo_url')->nullable();
            $table->decimal('default_tax_rate', 5, 2)->default(0);
            $table->string('default_payment_terms')->default('Net 30');
            $table->text('default_invoice_notes')->nullable();
            $table->string('invoice_number_prefix')->default('INV');
            $table->string('currency', 10)->default('IDR');
            $table->string('timezone')->default('Asia/Jakarta');
            $table->string('date_format')->default('dd/MM/yyyy');
            $table->string('language', 10)->default('id');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
