<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Riskihajar\Terbilang\Facades\Terbilang;

class Invoice extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'order_id',
        'client_id',
        'invoice_number',
        'issue_date',
        'due_date',
        'status',
        'subtotal',
        'tax_rate',
        'tax_amount',
        'total_amount',
        'notes',
        'is_rounded',
    ];

    protected $appends = ['judul_dokumen', 'is_receipt', 'rounding_amount', 'balance_due', 'label_status'];

    protected function casts(): array
    {
        return [
            'issue_date' => 'date',
            'due_date' => 'date',
            'subtotal' => 'decimal:2',
            'tax_rate' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'is_rounded' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    // --- Dynamic Document Logic ---

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    public function isOverdue(): bool
    {
        return $this->status !== 'paid'
            && $this->status !== 'cancelled'
            && $this->due_date->isPast();
    }

    /**
     * Apakah dokumen ini ditampilkan sebagai kwitansi?
     */
    public function getIsReceiptAttribute(): bool
    {
        return $this->isPaid();
    }

    /**
     * Judul dokumen: Gunakan preferensi klien jika sudah lunas, jika belum atau tidak ada preferensi tetap 'INVOICE'.
     */
    public function getJudulDokumenAttribute(): string
    {
        if ($this->isPaid() && $this->client->invoice_title) {
            return $this->client->invoice_title;
        }

        return 'INVOICE';
    }

    /**
     * Label status dalam Bahasa Indonesia.
     */
    public function getLabelStatusAttribute(): string
    {
        return match ($this->status) {
            'draft' => 'Draf',
            'sent' => 'Terkirim',
            'paid' => 'Lunas',
            'overdue' => 'Jatuh Tempo',
            'cancelled' => 'Dibatalkan',
            default => $this->status,
        };
    }

    /**
     * Terbilang: jumlah total dalam kata-kata (Bahasa Indonesia).
     */
    public function getTerbilangAttribute(): string
    {
        $amount = (int) round((float) $this->total_amount);
        return ucwords(Terbilang::make($amount)) . ' Rupiah';
    }

    /**
     * Jumlah Pembulatan: selisih antara total_amount dan (subtotal + tax_amount).
     */
    public function getRoundingAmountAttribute(): float
    {
        if (!$this->is_rounded) {
            return 0;
        }
        
        $rawTotal = (float) $this->subtotal + (float) $this->tax_amount;
        return (float) $this->total_amount - $rawTotal;
    }

    /**
     * Sisa tagihan: total_amount dikurangi jumlah pembayaran yang sudah masuk.
     */
    public function getBalanceDueAttribute(): float
    {
        $paidAmount = (float) $this->payments()->sum('amount');
        return max(0, (float) $this->total_amount - $paidAmount);
    }

    /**
     * Data pembayaran terakhir (untuk kwitansi).
     */
    public function getLastPaymentAttribute(): ?Payment
    {
        return $this->payments()->latest('payment_date')->first();
    }
}

