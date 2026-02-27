import React, { useState, useMemo } from 'react';
import { Sidebar, Header } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Trash2, GripVertical, Save, CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const clients = [
  { id: 'client-1', name: 'IPIEF' },
  { id: 'client-2', name: 'PT. Maju Bersama' },
  { id: 'client-3', name: 'CV. Sukses Mandiri' },
];

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function SortableItem({ item, onUpdate, onDelete, canDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const lineTotal = (item.qty || 0) * (item.price || 0);

  return (
    <div ref={setNodeRef} style={style} className={cn("flex items-center gap-3 p-4 bg-card rounded-xl border transition-all", isDragging && "shadow-lg opacity-90 z-50 bg-primary/5")}>
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1 touch-none">
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="flex-1 min-w-0">
        <Input placeholder="Deskripsi item" value={item.description} onChange={(e) => onUpdate(item.id, 'description', e.target.value)} className="border-0 bg-secondary/30" />
      </div>
      <div className="w-20">
        <Input type="number" placeholder="Qty" min="0" step="0.01" value={item.qty} onChange={(e) => onUpdate(item.id, 'qty', parseFloat(e.target.value) || 0)} className="border-0 bg-secondary/30 text-center" />
      </div>
      <div className="w-32">
        <Input type="number" placeholder="Harga" min="0" step="1000" value={item.price} onChange={(e) => onUpdate(item.id, 'price', parseFloat(e.target.value) || 0)} className="border-0 bg-secondary/30 text-right" />
      </div>
      <div className="w-32 text-right font-medium">
        <span className="text-sm text-muted-foreground">Rp </span>
        <span>{lineTotal.toLocaleString('id-ID')}</span>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)} disabled={!canDelete} className="text-muted-foreground hover:text-destructive h-8 w-8">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function InvoiceFormPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({ clientId: '', status: 'draft', issueDate: '', dueDate: '', notes: '' });
  const [items, setItems] = useState([{ id: generateId(), description: '', qty: 1, price: 0 }]);
  const [taxRate, setTaxRate] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.qty || 0) * (item.price || 0), 0);
    const taxAmount = subtotal * (taxRate / 100);
    return { subtotal, taxAmount, total: subtotal + taxAmount };
  }, [items, taxRate]);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  function updateItem(id, field, value) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }

  function deleteItem(id) {
    if (items.length > 1) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function addItem() {
    setItems([...items, { id: generateId(), description: '', qty: 1, price: 0 }]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    navigate('/invoice/INV-0023');
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 lg:p-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
            <div>
              <h1 className="text-2xl font-bold">Buat Invoice Baru</h1>
              <p className="text-muted-foreground mt-0.5">Isi detail invoice di bawah ini</p>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-0 shadow-card">
                  <CardHeader className="pb-4"><CardTitle className="text-lg">Detail Invoice</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Klien *</Label>
                        <select value={formData.clientId} onChange={(e) => setFormData({ ...formData, clientId: e.target.value })} className="flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm" data-testid="client-select">
                          <option value="">Pilih klien</option>
                          {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm" data-testid="status-select">
                          <option value="draft">Draft</option>
                          <option value="pending">Pending</option>
                          <option value="lunas">Lunas</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Tanggal Terbit *</Label>
                        <div className="relative">
                          <Input type="date" value={formData.issueDate} onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })} className="pr-10" />
                          <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Jatuh Tempo *</Label>
                        <div className="relative">
                          <Input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="pr-10" />
                          <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-card">
                  <CardHeader className="pb-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Item Invoice</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={addItem} data-testid="add-item-button"><Plus className="h-4 w-4 mr-2" />Tambah Item</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-muted-foreground uppercase mb-2">
                      <div className="w-7"></div>
                      <div className="flex-1">Deskripsi</div>
                      <div className="w-20 text-center">Qty</div>
                      <div className="w-32 text-right">Harga</div>
                      <div className="w-32 text-right">Total</div>
                      <div className="w-8"></div>
                    </div>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                          {items.map((item) => (
                            <SortableItem key={item.id} item={item} onUpdate={updateItem} onDelete={deleteItem} canDelete={items.length > 1} />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                    <p className="text-xs text-muted-foreground mt-4 flex items-center gap-2"><GripVertical className="h-3 w-3" />Drag dan drop untuk mengatur urutan item</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-card">
                  <CardHeader className="pb-4"><CardTitle className="text-lg">Catatan</CardTitle></CardHeader>
                  <CardContent>
                    <Textarea placeholder="Catatan tambahan..." value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={4} className="resize-none" />
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-card sticky top-24">
                  <CardHeader className="pb-4"><CardTitle className="text-lg">Ringkasan</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">Rp {totals.subtotal.toLocaleString('id-ID')}</span></div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-muted-foreground">Pajak</span>
                      <div className="flex items-center gap-2">
                        <Input type="number" min="0" max="100" step="0.1" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} className="w-20 h-8 text-right text-sm" />
                        <span className="text-muted-foreground">%</span>
                      </div>
                    </div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Jumlah Pajak</span><span className="font-medium">Rp {totals.taxAmount.toLocaleString('id-ID')}</span></div>
                    <div className="border-t pt-4 flex justify-between"><span className="text-lg font-semibold">Total</span><span className="text-xl font-bold text-primary">Rp {totals.total.toLocaleString('id-ID')}</span></div>
                    <Button type="submit" className="w-full mt-6" size="lg" data-testid="save-invoice-button"><Save className="h-4 w-4 mr-2" />Simpan Invoice</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
