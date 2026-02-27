<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Pencil, Trash2, Printer, Download, CheckCircle2, AlertCircle, Clock, XCircle, FileText, Mail, Phone, MapPin, Building2, Banknote, Calendar, Image as ImageIcon } from 'lucide-vue-next';
import { useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toJpeg } from 'html-to-image';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface InvoiceItem { id: string; description: string; quantity: number; unit_price: number; total: number; }
interface Client { id: string; name: string; email: string; phone: string; address: string; company: string; }
interface Payment { id: string; amount: number; payment_date: string; payment_method: string; guna_membayar: string; proof_url: string | null; }
interface Profile { company_name: string; company_address: string; company_phone: string; company_email: string; company_website: string; logo_url: string; bank_name: string | null; bank_account_number: string | null; bank_account_name: string | null; default_invoice_notes: string | null; }
interface Invoice {
    id: string; invoice_number: string; issue_date: string; due_date: string;
    status: string; subtotal: number; tax_rate: number; tax_amount: number;
    total_amount: number; notes: string; client: Client; items: InvoiceItem[];
    payments: Payment[]; judul_dokumen: string; is_receipt: boolean;
    is_rounded: boolean; rounding_amount: number;
    balance_due: number;
}

const props = defineProps<{ invoice: Invoice; profile: Profile; currency: string; client_deposit_balance?: number; }>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Invoices', href: '/invoices' },
    { title: props.invoice.invoice_number, href: '#' },
];

const showPaymentModal = ref(false);
const isGeneratingImage = ref(false);
const invoiceCardRef = ref<any>(null);

async function shareAsImage() {
    isGeneratingImage.value = true;
    try {
        const el = invoiceCardRef.value?.$el || invoiceCardRef.value;
        if (!el) return;
        
        const dataUrl = await toJpeg(el, { 
            quality: 0.8, 
            backgroundColor: '#ffffff'
        });
        
        if (navigator.share) {
            try {
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], `Invoice-${props.invoice.invoice_number}.jpg`, { type: 'image/jpeg' });
                
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: `Invoice ${props.invoice.invoice_number}`,
                        text: `Berikut adalah invoice ${props.invoice.invoice_number} dari ${props.invoice.client.name}`,
                        files: [file]
                    });
                    return;
                }
            } catch (error) {
                console.error("Error sharing:", error);
            }
        }
        
        const link = document.createElement('a');
        link.download = `Invoice-${props.invoice.invoice_number}.jpg`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error('Failed to generate image', err);
        alert('Gagal menghasilkan gambar invoice.');
    } finally {
        isGeneratingImage.value = false;
    }
}

const paymentForm = useForm({
    amount: props.invoice.balance_due,
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'transfer',
    guna_membayar: `Membayar Invoice ${props.invoice.invoice_number}`,
    notes: '',
    proof: null as File | null,
});

function openPaymentModal() {
    paymentForm.amount = props.invoice.balance_due;
    showPaymentModal.value = true;
}

function submitPayment() {
    paymentForm.post(`/invoices/${props.invoice.id}/payments`, {
        onSuccess: () => {
            showPaymentModal.value = false;
            paymentForm.reset();
        },
    });
}

const statusLabels: Record<string, string> = {
    draft: 'Draf', sent: 'Terkirim', paid: 'Lunas', overdue: 'Jatuh Tempo', cancelled: 'Dibatalkan',
};

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat(props.currency === 'IDR' ? 'id-ID' : 'en-US', {
        style: 'currency', currency: props.currency,
        minimumFractionDigits: props.currency === 'IDR' ? 0 : 2,
    }).format(amount);
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
}

function updateStatus(newStatus: string) {
    router.patch(`/invoices/${props.invoice.id}/status`, { status: newStatus });
}

function deleteInvoice() {
    if (confirm(`Hapus permanen invoice "${props.invoice.invoice_number}"?`)) {
        router.delete(`/invoices/${props.invoice.id}`);
    }
}
</script>

<template>
    <Head :title="invoice.invoice_number" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-8 p-6 md:p-8 text-foreground">
            <!-- Header section with back button and actions -->
            <!-- Action Bar -->
            <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div class="flex items-center gap-4">
                    <Button variant="ghost" size="icon" @click="router.visit('/invoices')">
                        <ArrowLeft class="h-5 w-5" />
                    </Button>
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-bold">{{ invoice.invoice_number }}</h1>
                        <Badge class="rounded-full px-3 py-1 text-xs font-medium border" :class="{
                            'bg-green-500/10 text-green-600 border-green-200': invoice.status === 'paid',
                            'bg-blue-500/10 text-blue-600 border-blue-200': invoice.status === 'sent',
                            'bg-red-500/10 text-red-600 border-red-200': invoice.status === 'overdue',
                            'bg-slate-100 text-slate-600 border-slate-200': invoice.status === 'draft' || invoice.status === 'cancelled',
                        }">
                            {{ statusLabels[invoice.status] }}
                        </Badge>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button variant="outline" size="sm" class="h-9 px-3 rounded-lg border bg-background text-sm">
                                <Clock class="h-4 w-4 mr-2" />
                                Status
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-48 rounded-xl p-2 shadow-xl border-border/10">
                            <DropdownMenuItem class="rounded-lg py-2 focus:bg-green-500/10 focus:text-green-600 cursor-pointer" @click="updateStatus('paid')">
                                <CheckCircle2 class="mr-3 h-4 w-4" /> Lunas
                            </DropdownMenuItem>
                            <DropdownMenuItem class="rounded-lg py-2 focus:bg-blue-500/10 focus:text-blue-600 cursor-pointer" @click="updateStatus('sent')">
                                <FileText class="mr-3 h-4 w-4" /> Sent
                            </DropdownMenuItem>
                            <DropdownMenuItem class="rounded-lg py-2 focus:bg-red-500/10 focus:text-red-600 cursor-pointer" @click="updateStatus('overdue')">
                                <AlertCircle class="mr-3 h-4 w-4" /> Overdue
                            </DropdownMenuItem>
                             <DropdownMenuItem class="rounded-lg py-2 focus:bg-slate-500/10 focus:text-slate-600 cursor-pointer" @click="updateStatus('cancelled')">
                                <XCircle class="mr-3 h-4 w-4" /> Cancelled
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link :href="`/invoices/${invoice.id}/preview`">
                        <Button variant="outline" size="sm" class="h-9 px-3 rounded-lg border bg-background text-sm">
                            <Printer class="h-4 w-4 mr-2" /> Preview
                        </Button>
                    </Link>
                    
                    <a :href="`/invoices/${invoice.id}/pdf`">
                        <Button variant="default" size="sm" class="h-9 px-3 rounded-lg text-sm bg-primary text-primary-foreground shadow-sm">
                            <Download class="h-4 w-4 mr-2" /> PDF
                        </Button>
                    </a>

                    <Link :href="`/invoices/${invoice.id}/edit`">
                        <Button variant="outline" size="sm" class="h-9 px-3 rounded-lg border bg-background text-sm">
                            <Pencil class="h-4 w-4 mr-2" /> Edit
                        </Button>
                    </Link>

                    <Button variant="outline" size="sm" class="h-9 px-3 rounded-lg border bg-background text-sm text-destructive hover:bg-destructive/5 hover:text-destructive" @click="deleteInvoice">
                        <Trash2 class="h-4 w-4 mr-2" /> Hapus
                    </Button>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Main Invoice Card (Left) -->
                <div class="lg:col-span-2">
                    <Card class="border-0 shadow-card rounded-2xl overflow-hidden" ref="invoiceCardRef">
                <CardContent class="p-6 lg:p-10">
                    <div class="flex justify-between items-start mb-8">
                        <div class="flex flex-col gap-4">
                            <div class="h-12 w-12 rounded-full flex items-center justify-center relative overflow-hidden" :style="{ backgroundColor: profile?.color || '#eab308' }">
                                <img v-if="profile?.logo_url" :src="profile.logo_url" class="absolute inset-0 w-full h-full object-contain" />
                                <span v-else class="font-serif italic text-2xl font-bold" :class="profile?.color ? 'text-white' : 'text-yellow-900'">{{ profile?.company_name?.charAt(0) || 'S' }}</span>
                            </div>
                            <h2 class="text-2xl font-bold mt-2 text-foreground">{{ profile?.company_name || 'Perusahaan' }}</h2>
                        </div>
                        <div class="text-right flex flex-col items-end gap-2 text-foreground">
                            <h1 class="text-3xl font-bold tracking-wide uppercase text-primary" :style="{ color: profile?.color ? `${profile.color}` : '' }">Invoice</h1>
                            <span class="text-lg font-bold">{{ invoice.invoice_number }}</span>
                        </div>
                    </div>

                    <div class="h-px w-full bg-border/40 my-8"></div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div>
                            <h3 class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-4 mb-4">Kepada</h3>
                            <h4 class="text-lg font-bold mb-2 text-foreground">{{ invoice.client?.name }}</h4>
                            <div class="space-y-1.5 text-sm text-muted-foreground">
                                <p v-if="invoice.client?.company" class="flex items-center gap-2">
                                    <Building2 class="h-3.5 w-3.5" /> {{ invoice.client.company }}
                                </p>
                                <p v-if="invoice.client?.email" class="flex items-center gap-2">
                                    <Mail class="h-3.5 w-3.5" /> {{ invoice.client.email }}
                                </p>
                                <p v-if="invoice.client?.phone" class="flex items-center gap-2">
                                    <Phone class="h-3.5 w-3.5" /> {{ invoice.client.phone }}
                                </p>
                                <p v-if="invoice.client?.address" class="flex items-start gap-2">
                                    <MapPin class="h-3.5 w-3.5 mt-0.5" /> 
                                    <span>{{ invoice.client.address }}</span>
                                </p>
                            </div>
                        </div>

                        <div class="space-y-3 md:text-right">
                            <div class="flex justify-start md:justify-end items-center gap-4 text-sm">
                                <span class="font-medium text-muted-foreground">Tanggal Terbit:</span>
                                <span class="font-bold text-foreground w-32 md:text-right">{{ formatDate(invoice.issue_date) }}</span>
                            </div>
                            <div class="flex justify-start md:justify-end items-center gap-4 text-sm">
                                <span class="font-medium text-destructive">Jatuh Tempo:</span>
                                <span class="font-bold text-destructive w-32 md:text-right">{{ formatDate(invoice.due_date) }}</span>
                            </div>
                            <div class="flex justify-start md:justify-end items-center gap-4 text-sm">
                                <span class="font-medium text-muted-foreground">Status:</span>
                                <div class="w-32 flex justify-start md:justify-end">
                                    <Badge class="rounded-full px-3 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 border-none">
                                        {{ invoice.label_status || invoice.status }}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Items Table -->
                    <div class="mt-8 border-y-2 border-primary" :style="{ borderColor: profile?.color ? `${profile.color}` : '' }">
                        <div class="hidden sm:grid grid-cols-12 gap-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            <div class="col-span-6">Deskripsi</div>
                            <div class="col-span-2 text-center">Qty</div>
                            <div class="col-span-2 text-right">Harga Satuan</div>
                            <div class="col-span-2 text-right">Total</div>
                        </div>
                        <div class="divide-y divide-border/20 border-t border-primary" :style="{ borderColor: profile?.color ? `${profile.color}` : '' }">
                            <div v-for="item in invoice.items" :key="item.id" class="grid grid-cols-1 sm:grid-cols-12 gap-4 py-4 text-sm items-center">
                                <div class="sm:col-span-6 font-medium text-foreground">{{ item.description }}</div>
                                <div class="sm:col-span-2 sm:text-center text-muted-foreground">
                                    {{ item.quantity.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                                </div>
                                <div class="sm:col-span-2 sm:text-right text-muted-foreground">
                                    {{ formatCurrency(item.unit_price) }}
                                </div>
                                <div class="sm:col-span-2 sm:text-right font-bold text-foreground">
                                    {{ formatCurrency(item.total) }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="h-px w-full bg-border/40 mb-8 mt-4"></div>

                    <!-- Summary & Payment Info -->
                    <div class="flex flex-col sm:flex-row justify-between items-start gap-8 mt-4">
                        <div class="w-full sm:w-1/2">
                            <div v-if="profile?.bank_account_number" class="py-2">
                                <h4 class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Informasi Pembayaran</h4>
                                <div class="space-y-1 text-sm">
                                    <p class="font-bold text-foreground">{{ profile.bank_name }}</p>
                                    <p class="text-muted-foreground">No. Rek: <span class="font-bold text-foreground">{{ profile.bank_account_number }}</span></p>
                                    <p class="text-muted-foreground">A.N: <span class="font-bold text-foreground">{{ profile.bank_account_name }}</span></p>
                                </div>
                            </div>
                        </div>

                        <div class="w-full sm:w-80 flex flex-col items-end space-y-3">
                            <div class="flex justify-between w-full text-sm">
                                <span class="text-muted-foreground">Subtotal</span>
                                <span class="font-bold text-foreground">{{ formatCurrency(invoice.subtotal) }}</span>
                            </div>
                            <div v-if="invoice.tax_rate > 0" class="flex justify-between w-full text-sm">
                                <span class="text-muted-foreground">Pajak ({{ invoice.tax_rate }}%)</span>
                                <span class="font-bold text-foreground">{{ formatCurrency(invoice.tax_amount) }}</span>
                            </div>
                            <div v-if="invoice.is_rounded && invoice.rounding_amount > 0" class="flex justify-between w-full text-sm">
                                <span class="text-muted-foreground">Pembulatan</span>
                                <span class="font-bold text-foreground">{{ formatCurrency(invoice.rounding_amount) }}</span>
                            </div>
                            <div class="flex justify-between w-full pt-4 border-t border-border/20 mt-2">
                                <span class="text-base font-bold text-foreground">Total</span>
                                <span class="text-2xl font-bold text-primary" :style="{ color: profile?.color ? `${profile.color}` : '' }">{{ formatCurrency(invoice.total_amount) }}</span>
                            </div>
                        </div>
                    </div>

                    <div v-if="invoice.notes || profile?.default_invoice_notes" class="mt-16 text-center">
                        <p class="text-sm text-muted-foreground flex items-center justify-center whitespace-pre-wrap">
                            {{ invoice.notes || profile?.default_invoice_notes }}
                        </p>
                    </div>
                </CardContent>
                </Card>
            </div>

                <!-- Right side Panel (Activity/Details) -->
                <div class="space-y-8">
                    <!-- Payment Status Card -->
                    <div class="card border-0 bg-card shadow-card rounded-[24px] overflow-hidden p-6">
                        <h3 class="text-sm font-bold mb-4 flex items-center gap-2">
                            <Clock class="h-4 w-4 text-primary" />
                            Status Pembayaran
                        </h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <p class="text-xs font-semibold uppercase text-muted-foreground">Status</p>
                                <Badge :variant="invoice.status === 'paid' ? 'default' : 'secondary'" class="rounded-full px-3 py-1 text-xs font-medium border" :class="{
                                    'bg-green-500/10 text-green-600 border-green-200': invoice.status === 'paid',
                                    'bg-blue-500/10 text-blue-600 border-blue-200': invoice.status === 'sent',
                                    'bg-red-500/10 text-red-600 border-red-200': invoice.status === 'overdue',
                                    'bg-slate-100 text-slate-600 border-slate-200': invoice.status === 'draft' || invoice.status === 'cancelled',
                                }">
                                    {{ invoice.label_status || invoice.status }}
                                </Badge>
                            </div>
                            <div class="bg-secondary/30 p-4 rounded-xl">
                                <p class="text-xs font-semibold uppercase text-muted-foreground mb-1">Sisa Pembayaran</p>
                                <p class="text-2xl font-bold text-foreground">{{ formatCurrency(invoice.balance_due) }}</p>
                            </div>
                            <Button 
                                v-if="invoice.balance_due > 0"
                                @click="openPaymentModal"
                                class="w-full h-11 rounded-lg gap-2 bg-green-600 hover:bg-green-700 text-white shadow-sm border-0"
                            >
                                <Banknote class="h-4 w-4" />
                                <span class="text-sm font-medium">Catat Pembayaran</span>
                            </Button>

                            <!-- Progress Bar -->
                            <div class="space-y-2 pt-2">
                                <div class="flex justify-between items-center px-1">
                                    <span class="text-xs font-semibold text-muted-foreground">Progres</span>
                                    <span class="text-xs font-bold">{{ Math.round(100 - (invoice.balance_due / (invoice.total_amount || 1)) * 100) }}%</span>
                                </div>
                                <div class="h-2 w-full bg-secondary/30 rounded-full overflow-hidden">
                                     <div 
                                        class="h-full bg-primary transition-all duration-1000"
                                        :style="{ width: `${100 - (invoice.balance_due / (invoice.total_amount || 1)) * 100}%` }"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Payment History Section -->
                    <div class="card border-0 bg-card shadow-card rounded-[24px] overflow-hidden p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                        <h3 class="text-sm font-bold mb-4 flex items-center gap-2">
                            <Banknote class="h-4 w-4 text-primary" />
                            Riwayat Pembayaran
                        </h3>
                        
                        <div v-if="invoice.payments && invoice.payments.length > 0" class="space-y-3">
                            <div v-for="payment in invoice.payments" :key="payment.id" class="p-4 bg-secondary/10 rounded-xl border border-border/40 flex items-center justify-between group hover:bg-secondary/20 transition-all">
                                <div class="flex flex-col">
                                    <span class="text-sm font-bold text-foreground">{{ formatCurrency(payment.amount) }}</span>
                                    <span class="text-xs font-medium text-muted-foreground">{{ formatDate(payment.payment_date) }}</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <a v-if="payment.proof_url" :href="payment.proof_url" target="_blank" class="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-primary/10 transition-colors group/proof" title="Lihat Bukti">
                                        <ImageIcon class="h-4 w-4 text-muted-foreground group-hover/proof:text-primary" />
                                    </a>
                                    <Link :href="`/invoices/${invoice.id}/receipt?payment_id=${payment.id}`">
                                        <Button variant="ghost" size="icon" class="h-9 w-9 rounded-lg hover:bg-primary/10 transition-all" title="Kwitansi">
                                            <FileText class="h-4 w-4 text-primary" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div v-else class="py-8 text-center space-y-2 border-2 border-dashed border-secondary/20 rounded-xl bg-secondary/10">
                            <div class="h-8 w-8 bg-secondary/20 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                                <AlertCircle class="h-4 w-4 opacity-50" />
                            </div>
                            <p class="text-xs font-medium text-muted-foreground px-4">Belum ada riwayat pembayaran</p>
                        </div>
                    </div>
                    
                    <!-- Quick Actions Sidebar Card -->
                    <div class="card border-0 bg-card shadow-card rounded-[24px] overflow-hidden p-6">
                        <h3 class="text-sm font-bold mb-4">Sharing & Export</h3>
                        <div class="grid grid-cols-1 gap-2">
                             <Button @click="shareAsImage" :disabled="isGeneratingImage" variant="outline" class="justify-start h-11 rounded-lg gap-3 border bg-background hover:bg-muted transition-all text-foreground">
                                <ImageIcon v-if="!isGeneratingImage" class="h-4 w-4 text-muted-foreground" />
                                <Clock v-else class="h-4 w-4 animate-spin text-muted-foreground" />
                                <span class="text-sm font-medium">{{ isGeneratingImage ? 'Memproses...' : 'Share Image' }}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Payment Modal -->
        <div v-if="showPaymentModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card class="w-full max-w-md border-0 shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                <CardContent class="p-0">
                    <div class="p-6 border-b border-border/10 flex items-center justify-between">
                        <h2 class="text-lg font-bold">Catat Pembayaran</h2>
                        <Button variant="ghost" size="icon" @click="showPaymentModal = false" class="rounded-full">
                            <XCircle class="h-5 w-5" />
                        </Button>
                    </div>
                    <form @submit.prevent="submitPayment" class="p-6 space-y-4">
                        <div class="space-y-2">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Jumlah Pembayaran</label>
                            <div class="relative">
                                <Banknote class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input 
                                    v-model="paymentForm.amount" 
                                    type="number" 
                                    step="0.01"
                                    required
                                    class="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <p v-if="paymentForm.errors.amount" class="text-xs text-red-500 px-1">{{ paymentForm.errors.amount }}</p>
                        </div>

                        <div class="space-y-2">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tanggal Pembayaran</label>
                            <div class="relative">
                                <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input 
                                    v-model="paymentForm.payment_date" 
                                    type="date" 
                                    required
                                    class="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <p v-if="paymentForm.errors.payment_date" class="text-xs text-red-500 px-1">{{ paymentForm.errors.payment_date }}</p>
                        </div>

                        <div class="space-y-2">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Metode Pembayaran</label>
                            <div class="relative">
                                <Banknote class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <select 
                                    v-model="paymentForm.payment_method" 
                                    required
                                    class="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                                >
                                    <option value="transfer">Transfer Bank</option>
                                    <option value="cash">Tunai</option>
                                    <option v-if="client_deposit_balance && client_deposit_balance > 0" value="deposit">
                                        Potong Saldo Deposit (Sisa: {{ formatCurrency(client_deposit_balance) }})
                                    </option>
                                </select>
                            </div>
                            <p v-if="paymentForm.errors.payment_method" class="text-xs text-red-500 px-1">{{ paymentForm.errors.payment_method }}</p>
                        </div>

                        <div class="space-y-2">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Guna Membayar</label>
                            <textarea 
                                v-model="paymentForm.guna_membayar" 
                                rows="2"
                                placeholder="Guna membayar..."
                                class="w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                            ></textarea>
                            <p v-if="paymentForm.errors.guna_membayar" class="text-xs text-red-500 px-1">{{ paymentForm.errors.guna_membayar }}</p>
                        </div>

                        <div class="space-y-2">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Bukti Pembayaran (Opsional)</label>
                            <div class="relative">
                                <ImageIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground text-foreground" />
                                <input 
                                    @input="paymentForm.proof = ($event.target as HTMLInputElement).files?.[0] || null"
                                    type="file" 
                                    accept="image/*"
                                    class="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                />
                            </div>
                            <p class="text-[10px] text-muted-foreground px-1">Format: JPG, PNG, GIF (Maks. 2MB)</p>
                            <p v-if="paymentForm.errors.proof" class="text-xs text-red-500 px-1">{{ paymentForm.errors.proof }}</p>
                        </div>

                        <div class="pt-4 flex gap-3">
                            <Button 
                                type="submit" 
                                :disabled="paymentForm.processing"
                                class="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-bold uppercase tracking-wider text-xs shadow-lg shadow-primary/20"
                            >
                                {{ paymentForm.processing ? 'Menyimpan...' : 'Simpan Pembayaran' }}
                            </Button>
                            <Button 
                                type="button" 
                                variant="outline"
                                @click="showPaymentModal = false"
                                class="h-11 rounded-xl px-6 font-bold uppercase tracking-wider text-xs border-border/60 hover:bg-secondary/80"
                            >
                                Batal
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
