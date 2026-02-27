<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'full_name',
        'avatar_url',
        'company_name',
        'company_address',
        'company_phone',
        'company_email',
        'company_website',
        'tax_id',
        'logo_url',
        'default_tax_rate',
        'default_payment_terms',
        'default_invoice_notes',
        'invoice_number_prefix',
        'currency',
        'timezone',
        'date_format',
        'language',
        'bank_name',
        'bank_account_number',
        'bank_account_name',
    ];

    protected function casts(): array
    {
        return [
            'default_tax_rate' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
