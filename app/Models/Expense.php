<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    use HasUuids;

    public const CATEGORIES = [
        'salary' => 'Gaji',
        'vendor' => 'Vendor',
        'software' => 'Software',
        'operational' => 'Operasional',
        'marketing' => 'Marketing',
        'other' => 'Lainnya',
    ];

    public const PAYMENT_METHODS = [
        'bank_transfer' => 'Transfer Bank',
        'cash' => 'Tunai',
        'qris' => 'QRIS / E-Wallet',
        'other' => 'Metode Lainnya',
    ];

    protected $fillable = [
        'user_id',
        'order_id',
        'category',
        'description',
        'amount',
        'expense_date',
        'payment_method',
        'reference_number',
        'vendor_name',
        'notes',
        'is_recurring',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'expense_date' => 'date',
            'is_recurring' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function getCategoryLabelAttribute(): string
    {
        return self::CATEGORIES[$this->category] ?? $this->category;
    }
}
