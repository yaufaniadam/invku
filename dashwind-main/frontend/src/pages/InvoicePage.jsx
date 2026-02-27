import React, { useState } from 'react';
import { Sidebar, Header } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Printer, Download, Edit, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';

const invoiceData = {
  client: {
    name: 'IPIEF',
    organization: 'Universitas Muhammadiyah Yogyakarta',
    address: 'Jl. Brawijaya Yogyakarta',
    email: 'ipief@umy.ac.id',
    phone: '082220737964',
  },
  issueDate: '23 Januari 2026',
  dueDate: '22 Februari 2026',
  items: [
    { id: 1, description: 'paket stiker', qty: 1, price: 300000 },
    { id: 2, description: 'paket Bollpoint Promosi', qty: 1, price: 500000 },
    { id: 3, description: 'Paket Gantungan Kunci Akrilik', qty: 1, price: 500000 },
  ],
};

export default function InvoicePage() {
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [status, setStatus] = useState('lunas');

  const displayId = invoiceId || 'INV-0022';
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const statusLabel = status === 'lunas' ? 'Lunas' : status === 'pending' ? 'Pending' : 'Draft';
  const statusColor = status === 'lunas' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning';

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 lg:p-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <button onClick={() => navigate('/')} className="hover:text-foreground">Beranda</button>
            <span>›</span>
            <span className="text-foreground font-medium">{displayId}</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{displayId}</h1>
                <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", statusColor)}>{statusLabel}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 px-3 rounded-lg border bg-background text-sm" data-testid="status-dropdown">
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="lunas">Lunas</option>
              </select>
              <Button variant="outline" size="sm" onClick={() => navigate('/invoice/' + displayId + '/print')} data-testid="preview-button"><Printer className="h-4 w-4 mr-2" />Preview</Button>
              <Button size="sm" data-testid="pdf-button"><Download className="h-4 w-4 mr-2" />PDF</Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/invoice/create')} data-testid="edit-button"><Edit className="h-4 w-4 mr-2" />Edit</Button>
            </div>
          </div>
          <Card className="border-0 shadow-card">
            <CardContent className="p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Kepada</h3>
                  <h4 className="text-xl font-bold mb-3">{invoiceData.client.name}</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><Building2 className="h-4 w-4" />{invoiceData.client.organization}</p>
                    <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{invoiceData.client.address}</p>
                    <p className="flex items-center gap-2"><Mail className="h-4 w-4" />{invoiceData.client.email}</p>
                    <p className="flex items-center gap-2"><Phone className="h-4 w-4" />{invoiceData.client.phone}</p>
                  </div>
                </div>
                <div className="lg:text-right space-y-4">
                  <div><span className="text-xs font-semibold uppercase text-muted-foreground block mb-1">No. Invoice</span><span className="text-lg font-bold">{displayId}</span></div>
                  <div><span className="text-xs font-semibold uppercase text-muted-foreground block mb-1">Tanggal Terbit</span><span className="font-medium">{invoiceData.issueDate}</span></div>
                  <div><span className="text-xs font-semibold uppercase text-muted-foreground block mb-1">Jatuh Tempo</span><span className="font-medium">{invoiceData.dueDate}</span></div>
                </div>
              </div>
              <div className="mt-10">
                <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-3 bg-secondary/30 rounded-t-xl text-xs font-semibold uppercase text-muted-foreground">
                  <div className="col-span-6">Deskripsi</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Harga Satuan</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                <div className="divide-y">
                  {invoiceData.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-4 py-4">
                      <div className="sm:col-span-6 font-medium">{item.description}</div>
                      <div className="sm:col-span-2 sm:text-center text-muted-foreground">{item.qty.toFixed(2)}</div>
                      <div className="sm:col-span-2 sm:text-right text-muted-foreground">Rp {item.price.toLocaleString('id-ID')}</div>
                      <div className="sm:col-span-2 sm:text-right font-semibold">Rp {(item.qty * item.price).toLocaleString('id-ID')}</div>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-2 pt-4 flex flex-col items-end space-y-2">
                  <div className="flex justify-between w-full sm:w-64 px-4"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span></div>
                  <div className="flex justify-between w-full sm:w-64 px-4 pt-2 border-t"><span className="text-lg font-semibold">Total</span><span className="text-xl font-bold text-primary">Rp {subtotal.toLocaleString('id-ID')}</span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
