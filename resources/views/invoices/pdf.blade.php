<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $invoice->judul_dokumen }} {{ $invoice->invoice_number }}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: helvetica, sans-serif !important;
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
            margin-bottom: 40px;
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

        .brand-section {
            display: inline-block;
            margin-bottom: 15px;
        }

        .logo-box {
            display: inline-block;
            vertical-align: middle;
            margin-right: 12px;
        }

        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
            display: inline-block;
            vertical-align: middle;
        }

        .company-detail {
            font-size: 11px;
            color: #64748b;
            line-height: 1.6;
        }

        .doc-type {
            font-size: 25px;
            font-weight: 900;
            color: #2563eb;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
            line-height: 1;
        }

        .doc-id {
            font-size: 16px;
            font-weight: bold;
            color: #475569;
            font-family: monospace, monospace !important;
            letter-spacing: -1px;
        }

        /* ========== PREVIEW HEADER (NON-PDF) ========== */
        .preview-header {
            background: #fff;
            padding: 12px 24px;
            border-bottom: 1px solid #f1f5f9;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .preview-title-box {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .back-link {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            color: #64748b;
            text-decoration: none;
            transition: all 0.2s;
        }

        .back-link:hover {
            background: #f8fafc;
            color: #1e293b;
        }

        .preview-info {
            display: flex;
            flex-direction: column;
        }

        .preview-label {
            font-size: 14px;
            font-weight: bold;
            color: #1e293b;
        }

        .preview-sublabel {
            font-size: 11px;
            color: #94a3b8;
        }

        .preview-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .btn-preview {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s;
            cursor: pointer;
            border: 1px solid transparent;
        }

        .btn-secondary {
            background: #fff;
            border-color: #e2e8f0;
            color: #475569;
        }

        .btn-secondary:hover {
            background: #f8fafc;
            border-color: #cbd5e1;
        }

        .btn-primary {
            background: #6366f1;
            color: #fff;
            box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2);
        }

        .btn-primary:hover {
            background: #4f46e5;
            transform: translateY(-1px);
        }

        @media print {
            .preview-header { display: none !important; }
            body { background: #fff; }
            .invoice-container { margin: 0; padding: 15mm; }
        }

        /* ========== METADATA SECTION ========== */
        .meta-table {
            width: 100%;
            margin-bottom: 40px;
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
            font-size: 16px;
            font-weight: 900;
            color: #0f172a;
            margin-bottom: 8px;
        }

        .client-detail {
            font-size: 11px;
            color: #475569;
            line-height: 1.6;
            margin-bottom: 2px;
        }

        .meta-info-row {
            margin-bottom: 10px;
            text-align: right;
        }

        .meta-info-label {
            display: inline-block;
            width: 80px;
            color: #64748b;
            font-size: 11px;
            text-align: left;
        }

        .meta-info-value {
            display: inline-block;
            font-weight: 900;
            color: #0f172a;
            text-align: right;
            padding-left: 10px;
            width: 112px;
        }

        .status-badge {
            display: inline-block;
            font-size: 9px;
            font-weight: 900;
            padding: 2px 8px;
            border-radius: 9999px;
            border: 1px solid currentcolor;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-align: center;
            width: 112px;
            box-sizing: border-box;
            background-color: #f8fafc;
        }

        .status-paid { color: #16a34a; background-color: #f0fdf4; border-color: currentcolor; }
        .status-sent { color: #2563eb; background-color: #eff6ff; border-color: currentcolor; }
        .status-overdue { color: #ef4444; background-color: #fef2f2; border-color: currentcolor; }
        .status-draft { color: #64748b; background-color: #f8fafc; border-color: currentcolor; }
        .status-cancelled { color: #64748b; background-color: #f8fafc; border-color: currentcolor; }

        /* ========== ITEMS TABLE ========== */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            border-bottom: 1px solid #f1f5f9;
        }

        .items-table thead th {
            background: #eff6ff;
            color: #2563eb;
            padding: 12px 16px;
            text-align: left;
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
            border-top: 1px solid rgba(37, 99, 235, 0.1);
            border-bottom: 1px solid rgba(37, 99, 235, 0.1);
        }

        .items-table thead th:first-child { border-radius: 8px 0 0 0; }
        .items-table thead th:last-child { border-radius: 0 8px 0 0; text-align: right; }

        .items-table tbody td {
            padding: 16px;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
        }

        .item-desc {
            font-weight: 900;
            color: #0f172a;
            font-size: 12px;
        }

        .items-table .text-right { text-align: right; }
        .items-table .text-center { text-align: center; }

        /* ========== TOTALS AREA ========== */
        .totals-table {
            width: 100%;
            border-collapse: collapse;
        }

        .totals-notes {
            width: 55%;
            vertical-align: top;
            padding-right: 40px;
        }

        .rekening-box {
            background: #f8fafc;
            padding: 24px;
            border-radius: 16px;
            border: 1px solid #f1f5f9;
        }

        .totals-summary {
            width: 45%;
            vertical-align: top;
        }

        .summary-row {
            margin-bottom: 5px;
            padding: 5px 0;
            border-bottom: 1px solid #f8fafc;
        }

        .summary-label {
            color: #64748b;
            font-size: 11px;
            text-align: left;
            padding: 6px 16px;
            border-bottom: 1px solid #f8fafc;
        }

        .summary-value {
            font-weight: 900;
            color: #0f172a;
            font-size: 11px;
            text-align: right;
            padding: 6px 16px;
            border-bottom: 1px solid #f8fafc;
        }

        .grand-total-box {
            background: #eff6ff;
            padding: 16px;
            border-radius: 12px;
            margin-top: 16px;
        }

        .grand-label {
            font-size: 13px;
            font-weight: 900;
            color: #2563eb;
            text-transform: uppercase;
            letter-spacing: -0.5px;
            text-align: left;
        }

        .grand-value {
            font-size: 18px;
            font-weight: 900;
            color: #2563eb;
            letter-spacing: -1px;
            text-align: right;
        }

        .rounding-row {
            color: #2563eb;
        }
        
        .rounding-label {
            font-size: 11px;
            padding: 6px 16px;
            font-weight: 500;
            color: #64748b;
        }

        /* ========== FOOTER SECTION ========== */
        .notes-box {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            margin-top: 50px;
        }

        .notes-title {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            color: #94a3b8;
            margin-bottom: 5px;
        }

        .notes-content {
            font-size: 11px;
            color: #475569;
            line-height: 1.6;
        }

        .footer-line {
            margin-top: 40px;
            padding: 20px 0;
            border-top: 1px solid #e2e8f0;
            text-align: center;
        }

        .footer-text {
            font-size: 10px;
            color: #94a3b8;
        }

        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
    </style>
</head>
<body>
    @if(!isset($isPdf))
    <div class="preview-header">
        <div class="preview-title-box">
            <a href="{{ route('invoices.show', $invoice) }}" class="back-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </a>
            <div class="preview-info">
                <span class="preview-label">Preview Invoice</span>
                <span class="preview-sublabel">{{ $invoice->invoice_number }}</span>
            </div>
        </div>
        <div class="preview-actions">
            <button onclick="window.print()" class="btn-preview btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                Cetak
            </button>
            <a href="{{ route('invoices.pdf', $invoice) }}" class="btn-preview btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Download PDF
            </a>
        </div>
    </div>
    @endif

    @if($invoice->isPaid())
    <div class="watermark">LUNAS</div>
    @endif

    <div class="invoice-container">
        {{-- Header Section --}}
        <table class="header-table">
            <tr>
                <td class="header-left">
                    <div class="brand-section">
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
                                <img src="{{ $logoSrc }}" alt="Logo" style="max-height: 45px; max-width: 180px; margin-bottom: 10px; display: block;">
                            @endif
                        @endif
                        <span class="company-name">{{ $profile->company_name ?? 'Dashboard' }}</span>
                    </div>
                    <div class="company-detail">
                        @if($profile->company_address){{ $profile->company_address }}<br>@endif
                        @if($profile->company_phone)Tel: {{ $profile->company_phone }} • @endif
                        @if($profile->company_email){{ $profile->company_email }}@endif
                        @if($profile->tax_id)<br>NPWP: {{ $profile->tax_id }}@endif
                    </div>
                </td>
                <td class="header-right">
                    <h1 class="doc-type">{{ strtoupper($invoice->judul_dokumen) }}</h1>
                    <p class="doc-id">{{ $invoice->invoice_number }}</p>
                </td>
            </tr>
        </table>

        {{-- Metadata & Bill To --}}
        <table class="meta-table">
            <tr>
                <td class="meta-col">
                    <h3 class="section-label">Tagihan Kepada</h3>
                    <div class="client-name">{{ $invoice->client->name }}</div>
                    <div class="client-detail">
                        @if($invoice->client->company){{ $invoice->client->company }}<br>@endif
                        @if($invoice->client->address){{ $invoice->client->address }}<br>@endif
                        @if($invoice->client->email){{ $invoice->client->email }}<br>@endif
                        @if($invoice->client->phone){{ $invoice->client->phone }}@endif
                    </div>
                </td>
                <td class="meta-col">
                    <div class="meta-info-row">
                        <span class="meta-info-label">No. Invoice:</span>
                        <span class="meta-info-value">{{ $invoice->invoice_number }}</span>
                    </div>
                    <div class="meta-info-row">
                        <span class="meta-info-label">Tanggal Terbit:</span>
                        <span class="meta-info-value">{{ $invoice->issue_date->translatedFormat('d F Y') }}</span>
                    </div>
                    <div class="meta-info-row">
                        <span class="meta-info-label">Jatuh Tempo:</span>
                        <span class="meta-info-value" style="color: #dc2626;">{{ $invoice->due_date->translatedFormat('d F Y') }}</span>
                    </div>
                    <div class="meta-info-row">
                        <span class="meta-info-label">Status:</span>
                        <span class="meta-info-value status-{{ $invoice->status }}">{{ $invoice->isPaid() ? 'LUNAS' : strtoupper($invoice->label_status) }}</span>
                    </div>
                </td>
            </tr>
        </table>

        {{-- Items Table --}}
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 50%">Deskripsi Layanan</th>
                    <th style="width: 10%" class="text-center">Qty</th>
                    <th style="width: 20%" class="text-right">Harga</th>
                    <th style="width: 20%" class="text-right">Jumlah</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                <tr>
                    <td>
                        <div class="item-desc">{{ $item->description }}</div>
                    </td>
                    <td class="text-center">{{ rtrim(rtrim(number_format($item->quantity, 2), '0'), '.') }}</td>
                    <td class="text-right">{{ $formatCurrency($item->unit_price) }}</td>
                    <td class="text-right" style="font-weight: 700; color: #1e293b;">{{ $formatCurrency($item->total) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        {{-- Totals Area --}}
        <table class="totals-table">
            <tr>
                <td class="totals-notes">
                    @if($profile && $profile->bank_account_number)
                    <div class="rekening-box">
                        <h4 class="section-label">Rekening</h4>
                        <div style="font-size: 14px; color: #0f172a; font-weight: 900; margin-bottom: 4px;">{{ $profile->bank_name }}</div>
                        <div style="font-size: 11px; color: #64748b; margin-bottom: 2px;">
                            No. Rek: <span style="font-family: monospace, monospace !important; color: #0f172a; font-weight: bold; letter-spacing: 1px;">{{ $profile->bank_account_number }}</span>
                        </div>
                        <div style="font-size: 11px; color: #64748b;">
                            A.N: <span style="color: #0f172a; font-weight: bold;">{{ $profile->bank_account_name }}</span>
                        </div>
                    </div>
                    @endif


                </td>
                <td class="totals-summary">
                    <table style="width: 100%; border-collapse: collapse;">
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
                        <tr class="rounding-row">
                            <td class="summary-label rounding-label">Pembulatan</td>
                            <td class="summary-value">{{ $formatCurrency($invoice->rounding_amount) }}</td>
                        </tr>
                        @endif
                        <tr>
                            <td colspan="2">
                                <div class="grand-total-box">
                                    <table style="width: 100%;">
                                        <tr>
                                            <td class="grand-label">TOTAL</td>
                                            <td class="grand-value">{{ $formatCurrency($invoice->total_amount) }}</td>
                                        </tr>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        @if($invoice->notes || ($profile && $profile->default_invoice_notes))
        <div style="margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 30px;">
            <div style="font-size: 14px; font-weight: 500; color: #64748b; line-height: 1.8; white-space: pre-wrap; font-style: italic; text-align: center;">{{ $invoice->notes ?: ($profile ? $profile->default_invoice_notes : '') }}</div>
        </div>
        @endif
    </div>
</body>
</html>
