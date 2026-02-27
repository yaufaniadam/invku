<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Kwitansi #{{ $invoice->invoice_number }}</title>
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
            font-size: 13px;
            color: #334155;
            line-height: 1.6;
            background: #fff;
            padding: 20mm;
        }

        .receipt-card {
            border: 1px solid #e2e8f0;
            padding: 40px;
            border-radius: 4px;
            position: relative;
        }

        .header {
            border-bottom: 2px solid #2563eb1a;
            padding-bottom: 25px;
            margin-bottom: 40px;
        }

        .company-name {
            font-size: 20px;
            font-weight: bold;
            color: #1e293b;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .company-address {
            font-size: 10px;
            color: #64748b;
            margin-top: 5px;
            max-width: 300px;
        }

        .receipt-title {
            position: absolute;
            top: 40px;
            right: 40px;
            text-align: right;
        }

        .title-text {
            font-size: 32px;
            font-weight: 900;
            color: #2563eb;
            letter-spacing: -1px;
        }

        .receipt-no {
            font-size: 14px;
            font-weight: bold;
            color: #64748b;
            margin-top: 5px;
        }

        .line-item {
            border-bottom: 1px solid #f1f5f9;
            padding: 15px 0;
            display: table;
            width: 100%;
        }

        .label {
            display: table-cell;
            width: 180px;
            font-size: 10px;
            font-weight: bold;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            vertical-align: middle;
        }

        .value {
            display: table-cell;
            font-size: 15px;
            font-weight: bold;
            color: #1e293b;
            vertical-align: middle;
        }

        .value.terbilang {
            font-style: italic;
            font-weight: 500;
            color: #475569;
            font-size: 14px;
        }

        .footer {
            margin-top: 60px;
            display: table;
            width: 100%;
        }

        .amount-box {
            display: table-cell;
            background: #f8fafc;
            border: 2px solid #2563eb1a;
            padding: 20px 30px;
            border-radius: 8px;
            vertical-align: middle;
        }

        .amount-label {
            font-size: 9px;
            font-weight: 900;
            color: #2563eb80;
            letter-spacing: 2px;
            margin-bottom: 5px;
        }

        .amount-value {
            font-size: 28px;
            font-weight: 900;
            color: #2563eb;
            letter-spacing: -1px;
        }

        .signature {
            display: table-cell;
            text-align: center;
            width: 250px;
            vertical-align: bottom;
        }

        .date {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 60px;
        }

        .sign-line {
            border-bottom: 1px solid #cbd5e1;
            margin-bottom: 8px;
        }

        .sign-name {
            font-size: 11px;
            font-weight: bold;
            color: #1e293b;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .stamp {
            position: absolute;
            bottom: 60px;
            left: 50%;
            margin-left: -100px;
            border: 6px solid #16a34a1a;
            border-radius: 50%;
            width: 160px;
            height: 160px;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(-15deg);
            opacity: 0.1;
        }

        .stamp-text {
            color: #16a34a;
            font-size: 32px;
            font-weight: 900;
            letter-spacing: 4px;
        }
    </style>
</head>
<body>
    <div class="receipt-card">
        <div class="header">
            <div class="company-name">{{ $profile->company_name }}</div>
            <div class="company-address">{{ $profile->company_address }}</div>
        </div>

        <div class="receipt-title">
            <div class="title-text">KWITANSI</div>
            <div class="receipt-no">NO: {{ $invoice->invoice_number }}/KW</div>
        </div>

        <div class="content">
            <div class="line-item">
                <div class="label">Telah Terima Dari</div>
                <div class="value">: {{ $invoice->client->name }}</div>
            </div>

            <div class="line-item">
                <div class="label">Sejumlah</div>
                <div class="value terbilang">: {{ $invoice->terbilang }}</div>
            </div>

            <div class="line-item">
                <div class="label">Guna Membayar</div>
                <div class="value">: {{ $activePayment->guna_membayar ?? "Membayar Invoice {$invoice->invoice_number}" }}</div>
            </div>
        </div>

        <div class="footer">
            <div class="amount-box">
                <div class="amount-label">TERBILANG</div>
                <div class="amount-value">{{ $formatCurrency($activePayment->amount ?? 0) }}</div>
            </div>

            <div class="signature">
                <div class="date">{{ $activePayment->payment_date->isoFormat('D MMMM Y') ?? now()->isoFormat('D MMMM Y') }}</div>
                <div class="sign-line"></div>
                <div class="sign-name">{{ $profile->company_name }}</div>
            </div>
        </div>

        <div class="stamp">
            <div class="stamp-text">LUNAS</div>
        </div>
    </div>
</body>
</html>
