<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->foreignUuid('order_id')->nullable()->after('client_id')->constrained()->nullOnDelete();
        });

        Schema::table('expenses', function (Blueprint $table) {
            // Drop the existing invoice_id constraint first
            $table->dropForeign(['invoice_id']);
            $table->dropColumn('invoice_id');
            
            // Add the new order_id column
            $table->foreignUuid('order_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->dropColumn('order_id');
            $table->foreignUuid('invoice_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->dropColumn('order_id');
        });
    }
};
