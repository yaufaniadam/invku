<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'amount',
        'billing_cycle',
        'next_billing_date',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'next_billing_date' => 'date',
            'amount' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
