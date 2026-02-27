import React, { useState } from 'react';
import { Sidebar, Header } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Download, Layers } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const invoiceData = {
  id: 'INV-0022',
  issueDate: '23 Januari 2026',
  dueDate: '22 Februari 2026',
  status: 'Lunas',
  paymentMethod: 'Bank Transfer',
  company: {
    name: 'Dashboard',
    address: 'Jl. Sudirman No. 123',
    city: 'Jakarta Pusat, 10220',
    country: 'Indonesia',
  },
  client: {
    name: 'IPIEF',
    organization: 'Universitas Muhammadiyah Yogyakarta',
    address: 'Jl. Brawijaya Yogyakarta',
    email: 'ipief@umy.ac.id',
    phone: '082220737964',
  },
  items: [
    { id: 1, description: 'Paket Stiker Premium', qty: 100, price: 3000 },
    { id: 2, description: 'Paket Bollpoint Promosi', qty: 50, price: 10000 },
    { id: 3, description: 'Paket Gantungan Kunci Akrilik', qty: 100, price: 5000 },
  ],
  discount: 0,
  taxRate: 11,
};

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

function InvoicePrintContent({ invoice }) {
  const subtotal = invoice.items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const discountAmount = subtotal * (invoice.discount / 100);
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = afterDiscount * (invoice.taxRate / 100);
  const total = afterDiscount + taxAmount;

  return (
    <div className="invoice-print-content bg-white" style={{ width: '210mm', minHeight: '297mm', padding: '15mm', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        {/* Company Info */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800">{invoice.company.name}</span>
          </div>
          <div className="text-sm text-slate-500 space-y-0.5">
            <p>{invoice.company.address}</p>
            <p>{invoice.company.city}</p>
            <p>{invoice.company.country}</p>
          </div>
        </div>

        {/* Invoice Title */}
        <div className="text-right">
          <h1 className="text-4xl font-bold text-primary mb-2">INVOICE</h1>
          <p className="text-lg font-semibold text-slate-700">{invoice.id}</p>
        </div>
      </div>

      {/* Bill To & Invoice Details */}
      <div className="grid grid-cols-2 gap-8 mb-10">
        {/* Bill To */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Tagihan Kepada</h3>
          <p className="text-lg font-bold text-slate-800 mb-1">{invoice.client.name}</p>
          <div className="text-sm text-slate-600 space-y-0.5">
            <p>{invoice.client.organization}</p>
            <p>{invoice.client.address}</p>
            <p>{invoice.client.email}</p>
            <p>{invoice.client.phone}</p>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="text-right">
          <div className="space-y-2">
            <div className="flex justify-end gap-4">
              <span className="text-sm text-slate-500">No. Invoice:</span>
              <span className="text-sm font-semibold text-slate-800 w-32">{invoice.id}</span>
            </div>
            <div className="flex justify-end gap-4">
              <span className="text-sm text-slate-500">Tanggal Terbit:</span>
              <span className="text-sm font-semibold text-slate-800 w-32">{invoice.issueDate}</span>
            </div>
            <div className="flex justify-end gap-4">
              <span className="text-sm text-slate-500">Jatuh Tempo:</span>
              <span className="text-sm font-semibold text-slate-800 w-32">{invoice.dueDate}</span>
            </div>
            <div className="flex justify-end gap-4">
              <span className="text-sm text-slate-500">Status:</span>
              <span className="text-sm font-semibold text-emerald-600 w-32">{invoice.status}</span>
            </div>
            <div className="flex justify-end gap-4">
              <span className="text-sm text-slate-500">Pembayaran:</span>
              <span className="text-sm font-semibold text-slate-800 w-32">{invoice.paymentMethod}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="bg-primary/10">
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-primary rounded-l-lg">Deskripsi</th>
              <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-primary">Qty</th>
              <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-primary">Harga Satuan</th>
              <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-primary rounded-r-lg">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="py-4 px-4 text-sm text-slate-800">{item.description}</td>
                <td className="py-4 px-4 text-sm text-slate-600 text-center">{item.qty}</td>
                <td className="py-4 px-4 text-sm text-slate-600 text-right">{formatCurrency(item.price)}</td>
                <td className="py-4 px-4 text-sm font-semibold text-slate-800 text-right">{formatCurrency(item.qty * item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Subtotal</span>
              <span className="text-sm font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Diskon ({invoice.discount}%)</span>
                <span className="text-sm font-semibold text-red-500">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">PPN ({invoice.taxRate}%)</span>
              <span className="text-sm font-semibold text-slate-800">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between py-3 bg-primary/10 rounded-lg px-4 mt-2">
              <span className="text-base font-bold text-primary">Total</span>
              <span className="text-xl font-bold text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-slate-200">
        <div className="text-center text-xs text-slate-400">
          <p className="mb-1">Terima kasih atas kepercayaan Anda.</p>
          <p>Invoice ini sah dan diproses secara elektronik.</p>
        </div>
      </div>

      {/* Notes Section */}
      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Catatan</h4>
        <p className="text-sm text-slate-600">Pembayaran dapat dilakukan melalui transfer bank ke rekening yang tertera pada informasi perusahaan. Mohon sertakan nomor invoice sebagai referensi pembayaran.</p>
      </div>
    </div>
  );
}

export default function InvoicePrintPage() {
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const invoice = { ...invoiceData, id: invoiceId || invoiceData.id };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Action Bar - Hidden on print */}
        <div className="print:hidden p-4 lg:p-6 bg-card border-b sticky top-0 z-10">
          <div className="flex items-center justify-between max-w-[210mm] mx-auto">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold">Preview Invoice</h1>
                <p className="text-sm text-muted-foreground">{invoice.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" />
                Cetak
              </Button>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Print Preview Area */}
        <main className="p-4 lg:p-8 print:p-0 bg-slate-100 print:bg-white min-h-screen">
          <div className="print:shadow-none shadow-xl rounded-lg overflow-hidden">
            <InvoicePrintContent invoice={invoice} />
          </div>
        </main>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:bg-white {
            background: white !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .lg\\:pl-64 {
            padding-left: 0 !important;
          }
          .invoice-print-content {
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 15mm !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
