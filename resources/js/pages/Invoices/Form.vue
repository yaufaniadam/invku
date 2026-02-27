<script setup lang="ts">
import { Head, useForm, Link, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Plus, Trash2, ArrowLeft, Save, User, Calendar, FileText, Percent, Info, GripVertical, Search, Check, ChevronsUpDown } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { ComboboxRoot, ComboboxInput, ComboboxTrigger, ComboboxContent, ComboboxItem, ComboboxEmpty, ComboboxViewport } from 'reka-ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface Client { id: string; name: string; email: string; }
interface InvoiceItem { id?: string; description: string; quantity: number; unit_price: number; total: number; }
interface Invoice {
    id: string; client_id: string; invoice_number: string;
    issue_date: string; due_date: string; status: string;
    tax_rate: number; notes: string; is_rounded: boolean; items: InvoiceItem[];
}

const props = defineProps<{
    clients: Client[];
    invoiceNumber: string;
    defaultTaxRate: number;
    defaultNotes: string;
    currency: string;
    invoice?: Invoice;
}>();

const isEditing = computed(() => !!props.invoice);
const draggedIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);

function getClientDisplayValue(val: string): string {
    const client = props.clients.find(c => c.id === val);
    return client?.name ?? '';
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Invoices', href: '/invoices' },
    { title: isEditing.value ? 'Edit Invoice' : 'New Invoice', href: '#' },
];

const form = useForm({
    client_id: props.invoice?.client_id ?? '',
    issue_date: props.invoice?.issue_date ?? new Date().toISOString().split('T')[0],
    due_date: props.invoice?.due_date ?? '',
    status: props.invoice?.status ?? 'draft',
    tax_rate: props.invoice?.tax_rate ?? props.defaultTaxRate,
    notes: props.invoice?.notes ?? props.defaultNotes,
    is_rounded: props.invoice?.is_rounded ?? false,
    items: (props.invoice?.items ? props.invoice.items.map(i => ({ ...i, quantity: Number(i.quantity) })) : [{ description: '', quantity: 1, unit_price: 0, total: 0 }]) as InvoiceItem[],
});

function addItem() {
    form.items.push({ description: '', quantity: 1, unit_price: 0, total: 0 });
}

function removeItem(index: number) {
    if (form.items.length > 1) form.items.splice(index, 1);
}

function onDragStart(index: number, event: DragEvent) {
    draggedIndex.value = index;
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.dropEffect = 'move';
    }
}

function onDragEnter(index: number) {
    if (draggedIndex.value !== null && draggedIndex.value !== index) {
        dragOverIndex.value = index;
    }
}

function onDragLeave(index: number, event: DragEvent) {
    // Only clear if we're actually leaving the element, not just moving into a child
    const target = event.target as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (!target.contains(relatedTarget)) {
        if (dragOverIndex.value === index) {
            dragOverIndex.value = null;
        }
    }
}

function onDrop(index: number) {
    if (draggedIndex.value !== null && draggedIndex.value !== index) {
        const item = form.items.splice(draggedIndex.value, 1)[0];
        form.items.splice(index, 0, item);
    }
    draggedIndex.value = null;
    dragOverIndex.value = null;
}

function updateItemTotal(index: number) {
    const item = form.items[index];
    item.total = item.quantity * item.unit_price;
}

const subtotal = computed(() => form.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0));
const taxAmount = computed(() => subtotal.value * (form.tax_rate / 100));
const totalAmount = computed(() => {
    const rawTotal = subtotal.value + taxAmount.value;
    if (form.is_rounded) {
        return Math.ceil(rawTotal / 1000) * 1000;
    }
    return rawTotal;
});
const roundingAmount = computed(() => totalAmount.value - (subtotal.value + taxAmount.value));

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat(props.currency === 'IDR' ? 'id-ID' : 'en-US', {
        style: 'currency', currency: props.currency,
        minimumFractionDigits: props.currency === 'IDR' ? 0 : 2,
    }).format(amount);
}

function submit() {
    if (isEditing.value) {
        form.put(`/invoices/${props.invoice!.id}`);
    } else {
        form.transform((data) => ({ ...data, invoice_number: props.invoiceNumber })).post('/invoices');
    }
}
</script>

<template>
    <Head :title="isEditing ? 'Edit Invoice' : 'Create Invoice'" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-8 p-6 md:p-8 text-foreground">
            <!-- Header section with back button -->
            <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex items-center gap-5">
                    <Link href="/invoices">
                        <Button variant="outline" size="icon" class="h-12 w-12 rounded-xl border-border/40 shadow-sm hover:bg-secondary">
                            <ArrowLeft class="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 class="text-3xl font-bold tracking-tight">{{ isEditing ? 'Edit Invoice' : 'Create New Invoice' }}</h1>
                        <div class="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" class="rounded-lg px-2 py-0 my-0 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border-0">
                                {{ props.invoiceNumber }}
                            </Badge>
                            <p class="text-muted-foreground text-sm font-medium">Drafting since {{ new Date().toLocaleDateString() }}</p>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <Button 
                        @click="submit" 
                        class="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                        :disabled="form.processing"
                    >
                        <Save v-if="!form.processing" class="mr-2 h-5 w-5" />
                        <span v-else class="mr-2 h-4 w-4 border-2 border-primary-foreground border-t-transparent animate-spin rounded-full"></span>
                        {{ form.processing ? 'Saving...' : (isEditing ? 'Update Invoice' : 'Save Invoice') }}
                    </Button>
                </div>
            </div>

            <form @submit.prevent="submit" class="grid gap-8 lg:grid-cols-3 items-start">
                <!-- Main Form (Left side) -->
                <div class="lg:col-span-2 space-y-8">
                    <!-- General Details Card -->
                    <div class="card border-0 bg-card shadow-card rounded-[32px] overflow-hidden p-8 md:p-10">
                        <div class="flex items-center gap-3 mb-8 border-b border-border/40 pb-6">
                            <div class="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <FileText class="h-5 w-5 text-primary" />
                            </div>
                            <h2 class="text-xl font-bold">General Information</h2>
                        </div>
                        
                        <div class="grid gap-8 sm:grid-cols-2">
                            <div class="space-y-2">
                                <Label class="text-sm font-bold ml-1">Client Name</Label>
                                <ComboboxRoot v-model="form.client_id" :reset-search-term-on-select="true" class="relative">
                                    <div class="relative">
                                        <ComboboxInput
                                            :display-value="(val: any) => getClientDisplayValue(val as string)"
                                            placeholder="Search client..."
                                            class="flex h-12 w-full rounded-xl bg-secondary/30 border-0 px-4 pr-10 text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                        />
                                        <ComboboxTrigger class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground">
                                            <ChevronsUpDown class="h-4 w-4" />
                                        </ComboboxTrigger>
                                    </div>
                                    <ComboboxContent
                                        position="popper"
                                        :side-offset="8"
                                        class="z-50 w-[--reka-combobox-trigger-width] max-h-[280px] overflow-y-auto rounded-2xl bg-card border border-border/40 shadow-xl animate-in fade-in-0 zoom-in-95"
                                    >
                                        <ComboboxViewport class="p-1.5">
                                            <ComboboxEmpty class="py-6 text-center text-sm text-muted-foreground">
                                                No clients found.
                                            </ComboboxEmpty>
                                            <ComboboxItem
                                                v-for="client in clients"
                                                :key="client.id"
                                                :value="client.id"
                                                :text-value="client.name"
                                                class="relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium cursor-pointer outline-none transition-colors data-[highlighted]:bg-primary/10 data-[state=checked]:text-primary"
                                            >
                                                <User class="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                <span class="truncate">{{ client.name }}</span>
                                                <Check v-if="form.client_id === client.id" class="ml-auto h-4 w-4 text-primary shrink-0" />
                                            </ComboboxItem>
                                        </ComboboxViewport>
                                    </ComboboxContent>
                                </ComboboxRoot>
                                <p v-if="form.errors.client_id" class="mt-1 text-xs font-bold text-destructive ml-1">Please select a client</p>
                            </div>

                            <div class="space-y-2">
                                <Label class="text-sm font-bold ml-1">Invoice Status</Label>
                                <Select v-model="form.status">
                                    <SelectTrigger class="h-12 rounded-xl bg-secondary/30 border-0 focus:ring-primary/10">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent class="rounded-2xl shadow-xl">
                                        <SelectItem value="draft" class="rounded-lg py-2.5">Draft</SelectItem>
                                        <SelectItem value="sent" class="rounded-lg py-2.5">Sent</SelectItem>
                                        <SelectItem value="paid" class="rounded-lg py-2.5">Paid</SelectItem>
                                        <SelectItem value="overdue" class="rounded-lg py-2.5">Overdue</SelectItem>
                                        <SelectItem value="cancelled" class="rounded-lg py-2.5">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div class="space-y-2">
                                <Label class="text-sm font-bold ml-1">Issue Date</Label>
                                <div class="relative">
                                    <Calendar class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input v-model="form.issue_date" type="date" required class="pl-11 h-12 bg-secondary/30 border-0 rounded-xl focus:ring-primary/10 font-medium" />
                                </div>
                            </div>

                            <div class="space-y-2">
                                <Label class="text-sm font-bold ml-1 text-red-500/80">Due Date</Label>
                                <div class="relative">
                                    <Calendar class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-red-400" />
                                    <Input v-model="form.due_date" type="date" required class="pl-11 h-12 bg-red-50/10 dark:bg-red-950/20 border-0 rounded-xl focus:ring-red-500/10 font-bold" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Items Table Card -->
                    <div class="card border-0 bg-card shadow-card rounded-[32px] overflow-hidden p-8 md:p-10">
                        <div class="flex items-center justify-between mb-8 border-b border-border/40 pb-6">
                            <div class="flex items-center gap-3">
                                <div class="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                    <Plus class="h-5 w-5 text-green-600" />
                                </div>
                                <h2 class="text-xl font-bold">Line Items</h2>
                            </div>
                            <Button type="button" variant="secondary" @click="addItem" class="rounded-xl h-10 px-4 gap-2 font-bold transition-all hover:bg-secondary/80">
                                <Plus class="h-4 w-4" /> Add Item
                            </Button>
                        </div>

                        <div class="space-y-6">
                            <div 
                                v-for="(item, index) in form.items" 
                                :key="index" 
                                draggable="true"
                                @dragstart="onDragStart(index, $event)"
                                @dragover.prevent
                                @dragenter.prevent="onDragEnter(index)"
                                @dragleave="onDragLeave(index, $event)"
                                @drop="onDrop(index)"
                                class="relative group p-6 rounded-2xl bg-slate-50/50 dark:bg-muted/10 border border-transparent transition-all hover:border-primary/20 hover:shadow-sm"
                                :class="{ 
                                    'opacity-50 border-dashed border-primary': draggedIndex === index,
                                    'border-t-2 border-t-primary scale-[1.01] shadow-md bg-primary/5': dragOverIndex === index && draggedIndex !== null && index < draggedIndex,
                                    'border-b-2 border-b-primary scale-[1.01] shadow-md bg-primary/5': dragOverIndex === index && draggedIndex !== null && index > draggedIndex
                                }"
                            >
                                <div class="grid gap-4 sm:gap-6 sm:grid-cols-12 items-start pl-8 sm:pl-0">
                                    <div class="sm:col-span-6 space-y-2 lg:ml-2">
                                        <Label v-if="index === 0" class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Description</Label>
                                        <div class="relative">
                                            <div class="absolute -left-11 sm:-left-8 top-1/2 -translate-y-1/2 flex cursor-move text-muted-foreground/40 hover:text-muted-foreground sm:opacity-0 sm:group-hover:opacity-100 transition-all p-1">
                                                <GripVertical class="h-5 w-5" />
                                            </div>
                                            <Input v-model="item.description" required placeholder="Project consultation, Development..." class="h-11 bg-background border-border/40 rounded-xl shadow-sm focus:ring-primary/10" />
                                        </div>
                                    </div>
                                    <div class="sm:col-span-2 space-y-2">
                                        <Label v-if="index === 0" class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1 text-center block">Qty</Label>
                                        <Input v-model.number="item.quantity" type="number" min="1" step="1" required @input="updateItemTotal(index)" class="h-11 bg-background border-border/40 rounded-xl shadow-sm text-center focus:ring-primary/10 font-bold" />
                                    </div>
                                    <div class="sm:col-span-3 space-y-2">
                                        <Label v-if="index === 0" class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1 text-right block">Unit Price</Label>
                                        <div class="relative">
                                            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">{{ currency }}</span>
                                            <Input v-model.number="item.unit_price" type="number" min="0" required @input="updateItemTotal(index)" class="pl-12 h-11 bg-background border-border/40 rounded-xl shadow-sm text-right focus:ring-primary/10 font-bold" />
                                        </div>
                                    </div>
                                    <div class="sm:col-span-1 pt-2 sm:pt-0">
                                        <Label v-if="index === 0" class="hidden sm:block text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-0">Action</Label>
                                        <Button type="button" size="icon" variant="ghost" @click="removeItem(index)" :disabled="form.items.length <= 1" class="h-11 w-11 rounded-xl text-destructive hover:bg-destructive/5 disabled:opacity-20 transition-all">
                                            <Trash2 class="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                                <div class="mt-4 flex justify-end">
                                    <p class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Row Total: <span class="text-sm font-black text-foreground ml-2">{{ formatCurrency(item.quantity * item.unit_price) }}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Notes Card -->
                    <div class="card border-0 bg-card shadow-card rounded-[32px] overflow-hidden p-8 md:p-10">
                        <div class="flex items-center gap-3 mb-6">
                            <Info class="h-5 w-5 text-muted-foreground" />
                            <h2 class="text-xl font-bold">Additional Notes</h2>
                        </div>
                        <textarea v-model="form.notes" rows="4" class="w-full rounded-[24px] bg-secondary/30 border-0 p-6 text-base font-medium placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/10 transition-all" placeholder="Enter terms, payment instructions or simple thanks..."></textarea>
                    </div>
                </div>

                <!-- Summary Sidebar (Right side) -->
                <div class="space-y-8 sticky top-8">
                    <div class="card border-0 bg-primary/5 dark:bg-primary/10 shadow-card rounded-[32px] overflow-hidden p-8 border border-primary/10 backdrop-blur-sm">
                        <h2 class="text-xl font-black mb-8 tracking-tight text-primary uppercase text-[12px] tracking-[3px]">Total Summary</h2>
                        
                        <div class="space-y-6">
                            <div class="flex justify-between items-center px-1">
                                <span class="text-[13px] font-bold text-muted-foreground">Subtotal</span>
                                <span class="text-base font-bold text-foreground">{{ formatCurrency(subtotal) }}</span>
                            </div>
                            
                            <div class="space-y-3 bg-white/40 dark:bg-black/20 p-5 rounded-2xl border border-white/50 dark:border-black/20">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <Percent class="h-3.5 w-3.5 text-primary" />
                                        <span class="text-[13px] font-bold text-muted-foreground">Tax Rate</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <Input v-model.number="form.tax_rate" type="number" min="0" max="100" class="w-16 h-8 bg-transparent border-0 border-b border-primary/20 rounded-none p-0 text-right font-black text-base focus-visible:ring-0" />
                                        <span class="text-sm font-bold text-muted-foreground">%</span>
                                    </div>
                                </div>
                                <div class="flex justify-between items-center pt-2">
                                    <span class="text-[13px] font-bold text-muted-foreground">Tax Amount</span>
                                    <span class="text-sm font-bold text-foreground">{{ formatCurrency(taxAmount) }}</span>
                                </div>
                            </div>

                            <div class="flex items-center justify-between bg-white/20 dark:bg-black/10 p-4 rounded-2xl border border-white/30 dark:border-black/10 transition-all hover:bg-white/30 cursor-pointer" @click="form.is_rounded = !form.is_rounded">
                                <div class="flex flex-col">
                                    <span class="text-[13px] font-bold text-foreground">Bulatkan Harga</span>
                                    <span class="text-[10px] text-muted-foreground font-medium italic">Ke ribuan terdekat</span>
                                </div>
                                <Switch :checked="form.is_rounded" @update:checked="val => form.is_rounded = val" />
                            </div>

                            <div class="border-t-2 border-dashed border-primary/20 my-6"></div>
                            
                            <div class="flex flex-col gap-2 px-1">
                                <p class="text-[10px] font-black uppercase tracking-[2px] text-primary/50">Grand Total</p>
                                <div class="flex justify-between items-baseline">
                                   <span class="text-4xl font-black tracking-tighter text-foreground">{{ formatCurrency(totalAmount) }}</span>
                                </div>
                            </div>

                            <div v-if="form.is_rounded && roundingAmount > 0" class="mt-2 text-right p-3 rounded-xl bg-primary/5 border border-primary/10">
                                <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Keterangan Pembulatan</p>
                                <div class="flex justify-between items-center text-xs">
                                    <span class="font-medium text-muted-foreground">Ditambahkan:</span>
                                    <span class="font-black text-primary">+ {{ formatCurrency(roundingAmount) }}</span>
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                @click="submit"
                                :disabled="form.processing" 
                                class="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
                            >
                                {{ form.processing ? 'Processing...' : 'Finalize Invoice' }}
                            </Button>
                        </div>
                    </div>
                    
                    <div class="p-6 rounded-[24px] bg-secondary/30 flex items-start gap-4">
                        <div class="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 mt-1">
                            <Info class="h-4 w-4 text-orange-600" />
                        </div>
                        <p class="text-xs text-muted-foreground leading-relaxed font-medium">This action will create a permanent ledger entry. Please review all items and tax calculations before finalizing.</p>
                    </div>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
