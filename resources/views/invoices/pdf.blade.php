<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $invoice->judul_dokumen }} {{ $invoice->invoice_number }}</title>
    @php
        $accentColor = $profile->color ?? '#6366f1';
    @endphp
    <style>
        @page {
            size: A4 portrait;
            margin: 0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Helvetica Neue', helvetica, Arial, sans-serif !important;
        }

        body {
            font-size: 11px;
            color: #334155;
            line-height: 1.5;
            background: #fff;
            padding: 20mm;
        }

        .invoice-container {
            width: 100%;
            margin: 0;
            padding: 0;
            background: #fff;
            position: relative;
        }

        /* ========== WATERMARK ========== */
        .watermark {
            position: fixed;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 120px;
            font-weight: 900;
            color: rgba(34, 197, 94, 0.06);
            letter-spacing: 20px;
            z-index: 0;
            pointer-events: none;
            white-space: nowrap;
        }

        /* ========== HEADER ========== */
        .header-table {
            width: 100%;
            margin-bottom: 0;
            border-collapse: collapse;
        }

        .header-left {
            width: 60%;
            vertical-align: top;
        }

        .header-right {
            width: 40%;
            vertical-align: top;
            text-align: right;
        }

        .logo-circle {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background-color: {{ $accentColor }};
            display: inline-block;
            text-align: center;
            line-height: 48px;
            vertical-align: middle;
            overflow: hidden;
            margin-bottom: 8px;
        }

        .logo-circle img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .logo-initial {
            font-size: 22px;
            font-weight: 900;
            color: #fff;
            font-style: italic;
            font-family: Georgia, serif !important;
        }

        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
            display: block;
            margin-top: 8px;
        }

        .doc-type {
            font-size: 30px;
            font-weight: 900;
            color: {{ $accentColor }};
            letter-spacing: 2px;
            margin-bottom: 8px;
            line-height: 1;
        }

        .doc-id {
            font-size: 18px;
            font-weight: bold;
            color: #1e293b;
        }

        /* ========== SEPARATOR ========== */
        .separator {
            height: 1px;
            background-color: #e2e8f0;
            margin: 30px 0;
        }

        /* ========== METADATA SECTION ========== */
        .meta-table {
            width: 100%;
            margin-bottom: 30px;
            border-collapse: collapse;
        }

        .meta-col {
            width: 50%;
            vertical-align: top;
        }

        .section-label {
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #94a3b8;
            margin-bottom: 12px;
        }

        .client-name {
            font-size: 18px;
            font-weight: 900;
            color: #1e293b;
            margin-bottom: 6px;
        }

        .client-detail {
            font-size: 11px;
            color: #64748b;
            line-height: 1.8;
            margin-bottom: 2px;
        }

        .meta-info-row {
            margin-bottom: 12px;
            text-align: right;
        }

        .meta-info-label {
            display: inline-block;
            width: 90px;
            color: #64748b;
            font-size: 11px;
            font-weight: 500;
            text-align: left;
        }

        .meta-info-value {
            display: inline-block;
            font-weight: 900;
            color: #1e293b;
            text-align: right;
            padding-left: 10px;
            width: 128px;
            font-size: 11px;
        }

        .meta-info-label-due {
            color: #dc2626;
            font-weight: 500;
        }

        .meta-info-value-due {
            color: #dc2626;
            font-weight: 900;
        }

        .status-badge {
            display: inline-block;
            font-size: 11px;
            font-weight: 600;
            padding: 2px 12px;
            border-radius: 9999px;
            background-color: #f1f5f9;
            color: #475569;
            width: 128px;
            box-sizing: border-box;
            text-align: center;
        }

        /* ========== ITEMS TABLE ========== */
        .items-wrapper {
            margin-top: 30px;
            border-top: 2px solid {{ $accentColor }};
            border-bottom: 2px solid {{ $accentColor }};
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
        }

        .items-table thead th {
            padding: 10px 0;
            text-align: left;
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #64748b;
            border-bottom: 1px solid {{ $accentColor }};
        }

        .items-table thead th:last-child { text-align: right; }
        .items-table thead th.text-center { text-align: center; }
        .items-table thead th.text-right { text-align: right; }

        .items-table tbody td {
            padding: 14px 0;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
            font-size: 11px;
        }

        .items-table tbody tr:last-child td {
            border-bottom: none;
        }

        .item-desc {
            font-weight: 600;
            color: #1e293b;
            font-size: 12px;
        }

        .items-table .text-right { text-align: right; }
        .items-table .text-center { text-align: center; }
        .text-muted { color: #64748b; }
        .text-bold { font-weight: 900; color: #1e293b; }

        /* ========== SEPARATOR AFTER ITEMS ========== */
        .separator-light {
            height: 1px;
            background-color: #e2e8f0;
            margin: 16px 0 30px 0;
        }

        /* ========== TOTALS AREA ========== */
        .totals-table {
            width: 100%;
            border-collapse: collapse;
        }

        .totals-notes {
            width: 50%;
            vertical-align: top;
            padding-right: 40px;
        }

        .totals-summary {
            width: 50%;
            vertical-align: top;
        }

        .payment-label {
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #94a3b8;
            margin-bottom: 10px;
        }

        .bank-name {
            font-weight: 900;
            color: #1e293b;
            font-size: 13px;
            margin-bottom: 4px;
        }

        .bank-detail {
            font-size: 11px;
            color: #64748b;
            margin-bottom: 2px;
        }

        .bank-detail span {
            font-weight: 900;
            color: #1e293b;
        }

        .summary-row {
            margin-bottom: 10px;
        }

        .summary-inner {
            width: 100%;
            border-collapse: collapse;
        }

        .summary-label {
            color: #64748b;
            font-size: 11px;
            text-align: left;
            padding: 4px 0;
        }

        .summary-value {
            font-weight: 900;
            color: #1e293b;
            font-size: 11px;
            text-align: right;
            padding: 4px 0;
        }

        .grand-total-row td {
            padding-top: 14px;
            border-top: 1px solid #e2e8f0;
        }

        .grand-label {
            font-size: 16px;
            font-weight: 900;
            color: #1e293b;
            text-align: left;
        }

        .grand-value {
            font-size: 24px;
            font-weight: 900;
            color: {{ $accentColor }};
            letter-spacing: -1px;
            text-align: right;
        }

        /* ========== NOTES ========== */
        .notes-section {
            margin-top: 60px;
            text-align: center;
        }

        .notes-text {
            font-size: 11px;
            color: #64748b;
            line-height: 1.8;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>

    @if($invoice->isPaid())
    <div class="watermark">LUNAS</div>
    @endif

    <div class="invoice-container">
        {{-- Header Section --}}
        <table class="header-table">
            <tr>
                <td class="header-left">
                    <div class="logo-circle">
                        @if($profile->logo_url)
                            @php
                                $logoSrc = null;
                                if (isset($isPdf) && $isPdf) {
                                    if (\Illuminate\Support\Str::startsWith($profile->logo_url, ['http://', 'https://'])) {
                                        try {
                                            $data = @file_get_contents($profile->logo_url);
                                            if ($data) {
                                                $type = pathinfo(parse_url($profile->logo_url, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'png';
                                                $logoSrc = 'data:image/' . $type . ';base64,' . base64_encode($data);
                                            }
                                        } catch (\Exception $e) {}
                                    } else {
                                        $storagePath = str_replace('/storage/', '', parse_url($profile->logo_url, PHP_URL_PATH));
                                        if (\Illuminate\Support\Facades\Storage::disk('public')->exists($storagePath)) {
                                            $absolutePath = \Illuminate\Support\Facades\Storage::disk('public')->path($storagePath);
                                            $type = pathinfo($absolutePath, PATHINFO_EXTENSION);
                                            $data = file_get_contents($absolutePath);
                                            $logoSrc = 'data:image/' . $type . ';base64,' . base64_encode($data);
                                        }
                                    }
                                } else {
                                    $logoSrc = $profile->logo_url;
                                }
                            @endphp
                            @if($logoSrc)
                                <img src="{{ $logoSrc }}" alt="Logo">
                            @else
                                <span class="logo-initial">{{ substr($profile->company_name ?? 'S', 0, 1) }}</span>
                            @endif
                        @else
                            <span class="logo-initial">{{ substr($profile->company_name ?? 'S', 0, 1) }}</span>
                        @endif
                    </div>
                    <span class="company-name">{{ $profile->company_name ?? 'Perusahaan' }}</span>
                </td>
                <td class="header-right">
                    <h1 class="doc-type">{{ strtoupper($invoice->judul_dokumen) }}</h1>
                    <p class="doc-id">{{ $invoice->invoice_number }}</p>
                </td>
            </tr>
        </table>

        <div class="separator"></div>

        {{-- Metadata & Bill To --}}
        <table class="meta-table">
            <tr>
                <td class="meta-col">
                    <h3 class="section-label">Kepada</h3>
                    <div class="client-name">{{ $invoice->client->name }}</div>
                    <div class="client-detail">
                        @if($invoice->client->phone){{ $invoice->client->phone }}<br>@endif
                        @if($invoice->client->address){{ $invoice->client->address }}@endif
                    </div>
                </td>
                <td class="meta-col">
                    <div class="meta-info-row">
                        <span class="meta-info-label">Tanggal Terbit:</span>
                        <span class="meta-info-value">{{ $invoice->issue_date->translatedFormat('d F Y') }}</span>
                    </div>
                    <div class="meta-info-row">
                        <span class="meta-info-label meta-info-label-due">Jatuh Tempo:</span>
                        <span class="meta-info-value meta-info-value-due">{{ $invoice->due_date->translatedFormat('d F Y') }}</span>
                    </div>
                    <div class="meta-info-row">
                        <span class="meta-info-label">Status:</span>
                        <span class="status-badge">{{ $invoice->label_status }}</span>
                    </div>
                </td>
            </tr>
        </table>

        {{-- Items Table --}}
        <div class="items-wrapper">
            <table class="items-table">
                <thead>
                    <tr>
                        <th style="width: 50%">Deskripsi</th>
                        <th style="width: 15%" class="text-center">Qty</th>
                        <th style="width: 17%" class="text-right">Harga Satuan</th>
                        <th style="width: 18%" class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($invoice->items as $item)
                    <tr>
                        <td>
                            <div class="item-desc">{{ $item->description }}</div>
                        </td>
                        <td class="text-center text-muted">{{ rtrim(rtrim(number_format($item->quantity, 2), '0'), '.') }}</td>
                        <td class="text-right text-muted">{{ $formatCurrency($item->unit_price) }}</td>
                        <td class="text-right text-bold">{{ $formatCurrency($item->total) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div class="separator-light"></div>

        {{-- Totals Area --}}
        <table class="totals-table">
            <tr>
                <td class="totals-notes">
                    @if($profile && $profile->bank_account_number)
                    <div class="payment-label">Informasi Pembayaran</div>
                    <div class="bank-name">{{ $profile->bank_name }}</div>
                    <div class="bank-detail">No. Rek: <span>{{ $profile->bank_account_number }}</span></div>
                    <div class="bank-detail">A.N: <span>{{ $profile->bank_account_name }}</span></div>
                    @endif
                </td>
                <td class="totals-summary">
                    <table class="summary-inner">
                        <tr>
                            <td class="summary-label">Subtotal</td>
                            <td class="summary-value">{{ $formatCurrency($invoice->subtotal) }}</td>
                        </tr>
                        @if($invoice->tax_rate > 0)
                        <tr>
                            <td class="summary-label">Pajak ({{ $invoice->tax_rate }}%)</td>
                            <td class="summary-value">{{ $formatCurrency($invoice->tax_amount) }}</td>
                        </tr>
                        @endif
                        @if($invoice->is_rounded && $invoice->rounding_amount > 0)
                        <tr>
                            <td class="summary-label">Pembulatan</td>
                            <td class="summary-value">{{ $formatCurrency($invoice->rounding_amount) }}</td>
                        </tr>
                        @endif
                        <tr class="grand-total-row">
                            <td class="grand-label">Total</td>
                            <td class="grand-value">{{ $formatCurrency($invoice->total_amount) }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        @if($invoice->notes || ($profile && $profile->default_invoice_notes))
        <div class="notes-section">
            <div class="notes-text">{{ $invoice->notes ?: ($profile ? $profile->default_invoice_notes : '') }}</div>
        </div>
        @endif
    </div>
</body>
</html>
