<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Printer, Download, Building2, MapPin, Mail, Phone } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

interface InvoiceItem { id: string; description: string; quantity: number; unit_price: number; total: number; }
interface Client { id: string; name: string; email: string; phone: string; address: string; company: string; }
interface Profile { company_name: string; company_address: string; company_phone: string; company_email: string; company_website: string; logo_url: string; tax_id: string; }
interface Invoice {
    id: string; invoice_number: string; issue_date: string; due_date: string;
    status: string; subtotal: number; tax_rate: number; tax_amount: number;
    total_amount: number; notes: string; client: Client; items: InvoiceItem[];
    judul_dokumen: string; is_rounded: boolean; rounding_amount: number;
}

const props = defineProps<{ invoice: Invoice; profile: Profile; currency: string; }>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Invoices', href: '/invoices' },
    { title: props.invoice.invoice_number, href: `/invoices/${props.invoice.id}` },
    { title: 'Preview', href: '#' },
];

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat(props.currency === 'IDR' ? 'id-ID' : 'en-US', {
        style: 'currency', currency: props.currency,
        minimumFractionDigits: props.currency === 'IDR' ? 0 : 2,
    }).format(amount);
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
}

function printInvoice() {
    window.print();
}
</script>

<template>
    <Head :title="`Preview ${invoice.invoice_number}`" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col p-0 text-foreground bg-white dark:bg-slate-910">
            <!-- Premium Preview Header (Sticky) -->
            <div class="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-border/40 px-6 py-4 flex items-center justify-between print:hidden">
                <div class="flex items-center gap-4">
                    <Button variant="ghost" size="icon" class="rounded-xl" @click="router.visit(`/invoices/${invoice.id}`)">
                        <ArrowLeft class="h-5 w-5" />
                    </Button>
                    <div class="flex flex-col">
                        <h1 class="text-sm font-bold leading-none">Preview Invoice</h1>
                        <span class="text-[11px] font-medium text-muted-foreground mt-1">{{ invoice.invoice_number }}</span>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <Button variant="outline" class="h-10 rounded-xl gap-2 border-border/60 hover:bg-secondary/80" @click="printInvoice">
                        <Printer class="h-4 w-4" />
                        <span class="text-xs font-bold uppercase tracking-wider">Cetak</span>
                    </Button>
                    <a :href="`/invoices/${invoice.id}/pdf`">
                        <Button variant="default" class="h-10 rounded-xl gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                            <Download class="h-4 w-4" />
                            <span class="text-xs font-bold uppercase tracking-wider">Download PDF</span>
                        </Button>
                    </a>
                </div>
            </div>

            <!-- Paper-style Preview Container -->
            <div class="flex-1 overflow-y-auto p-8 lg:p-12 flex justify-center">
                <div class="w-full max-w-[210mm] min-h-[297mm] bg-white dark:bg-slate-900 shadow-[0_0_50px_-12px_rgba(0,0,0,0.12)] rounded-[2px] p-[15mm] relative print:m-0 print:p-0 print:shadow-none print:w-full print:bg-white text-slate-800 dark:text-slate-200">
                    
                    <!-- Watermark Lunas -->
                    <div v-if="invoice.status === 'paid'" class="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 -rotate-[30deg] pointer-events-none opacity-[0.06] select-none">
                        <h2 class="text-[120px] font-black tracking-[20px] text-green-500">LUNAS</h2>
                    </div>

                    <!-- Header Section -->
                    <div class="flex justify-between items-start mb-16 relative z-10">
                        <div class="max-w-[60%]">
                            <div class="mb-6">
                                <img v-if="profile.logo_url" :src="profile.logo_url" alt="Logo" class="max-h-12 w-auto mb-4 block" />
                                <h2 class="text-[24px] font-bold text-slate-900 dark:text-white leading-tight">{{ profile.company_name || 'Dashboard' }}</h2>
                            </div>
                            <div class="space-y-1.5 text-[11px] text-slate-500 font-medium leading-relaxed">
                                <p v-if="profile.company_address" class="whitespace-pre-wrap">{{ profile.company_address }}</p>
                                <p v-if="profile.company_phone || profile.company_email">
                                    <span v-if="profile.company_phone">Tel: {{ profile.company_phone }}</span>
                                    <span v-if="profile.company_phone && profile.company_email"> • </span>
                                    <span v-if="profile.company_email">{{ profile.company_email }}</span>
                                </p>
                                <p v-if="profile.tax_id" class="font-bold">NPWP: {{ profile.tax_id }}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <h1 class="text-[25px] font-black text-primary tracking-tight leading-none mb-2">{{ invoice.judul_dokumen.toUpperCase() }}</h1>
                            <p class="text-base font-bold text-slate-600 dark:text-slate-400 font-mono tracking-tighter">{{ invoice.invoice_number }}</p>
                        </div>
                    </div>

                    <!-- Client & Info Section -->
                    <div class="grid grid-cols-2 gap-12 mb-16 relative z-10">
                        <div>
                            <h3 class="text-[10px] font-black uppercase tracking-[2px] text-slate-400 mb-4">Tagihan Kepada</h3>
                            <h4 class="text-base font-black text-slate-900 dark:text-white mb-3">{{ invoice.client?.name }}</h4>
                            <div class="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                <p v-if="invoice.client?.company">{{ invoice.client.company }}</p>
                                <p v-if="invoice.client?.address" class="whitespace-pre-wrap">{{ invoice.client.address }}</p>
                                <p v-if="invoice.client?.email">{{ invoice.client.email }}</p>
                                <p v-if="invoice.client?.phone">{{ invoice.client.phone }}</p>
                            </div>
                        </div>
                        <div class="flex flex-col items-end gap-2.5">
                            <div class="flex items-center gap-6">
                                <span class="text-[11px] font-medium text-slate-500">No. Invoice:</span>
                                <span class="text-[11px] font-bold text-slate-900 dark:text-white w-28 text-right">{{ invoice.invoice_number }}</span>
                            </div>
                            <div class="flex items-center gap-6">
                                <span class="text-[11px] font-medium text-slate-500">Tanggal Terbit:</span>
                                <span class="text-[11px] font-bold text-slate-900 dark:text-white w-28 text-right">{{ formatDate(invoice.issue_date) }}</span>
                            </div>
                            <div class="flex items-center gap-6 text-red-600">
                                <span class="text-[11px] font-medium opacity-80">Jatuh Tempo:</span>
                                <span class="text-[11px] font-bold w-28 text-right">{{ formatDate(invoice.due_date) }}</span>
                            </div>
                            <div class="flex items-center gap-6 mt-1">
                                <span class="text-[11px] font-medium text-slate-500">Status:</span>
                                <span class="text-[9px] font-black px-2 py-0.5 rounded-full border border-current uppercase tracking-wider w-28 text-center"
                                    :class="{
                                        'text-green-600 bg-green-50': invoice.status === 'paid',
                                        'text-blue-600 bg-blue-50': invoice.status === 'sent',
                                        'text-red-500 bg-red-50': invoice.status === 'overdue',
                                        'text-slate-500 bg-slate-50': ['draft', 'cancelled'].includes(invoice.status)
                                    }">
                                    {{ invoice.status === 'paid' ? 'LUNAS' : invoice.status.toUpperCase() }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Items Table -->
                    <div class="mb-12 relative z-10">
                        <table class="w-full border-collapse">
                            <thead>
                                <tr class="bg-blue-50 dark:bg-blue-950/30">
                                    <th class="text-left py-3 px-4 text-[10px] font-black uppercase tracking-[2px] text-primary border-y border-blue-100 dark:border-blue-900/50 rounded-tl-lg">Deskripsi Layanan</th>
                                    <th class="text-center py-3 px-4 text-[10px] font-black uppercase tracking-[2px] text-primary border-y border-blue-100 dark:border-blue-900/50">Qty</th>
                                    <th class="text-right py-3 px-4 text-[10px] font-black uppercase tracking-[2px] text-primary border-y border-blue-100 dark:border-blue-900/50">Harga</th>
                                    <th class="text-right py-3 px-4 text-[10px] font-black uppercase tracking-[2px] text-primary border-y border-blue-100 dark:border-blue-900/50 rounded-tr-lg">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                <tr v-for="item in invoice.items" :key="item.id">
                                    <td class="py-4 px-4">
                                        <p class="text-[12px] font-bold text-slate-900 dark:text-white">{{ item.description }}</p>
                                    </td>
                                    <td class="py-4 px-4 text-center text-[11px] text-slate-600 font-medium">{{ item.quantity }}</td>
                                    <td class="py-4 px-4 text-right text-[11px] text-slate-600 font-medium">{{ formatCurrency(item.unit_price) }}</td>
                                    <td class="py-4 px-4 text-right text-[12px] font-black text-slate-900 dark:text-white">{{ formatCurrency(item.total) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Totals Area -->
                    <div class="flex gap-8 justify-between relative z-10">
                        <div class="w-full sm:w-1/2">
                            <div v-if="profile?.bank_account_number" class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <h4 class="text-[10px] font-black uppercase tracking-[2px] text-slate-400 mb-3 underline decoration-primary/20 underline-offset-4">Rekening</h4>
                                <div class="space-y-1 text-sm font-medium">
                                    <p class="font-bold text-slate-900 dark:text-white text-base">{{ profile.bank_name }}</p>
                                    <p class="text-slate-500">No. Rek: <span class="text-slate-900 dark:text-white tracking-wider font-mono">{{ profile.bank_account_number }}</span></p>
                                    <p class="text-slate-500">A.N: <span class="text-slate-900 dark:text-white">{{ profile.bank_account_name }}</span></p>
                                </div>
                            </div>
                        </div>
                        <div class="w-72 space-y-2.5">
                            <div class="flex justify-between items-center py-1 px-4 border-b border-slate-50 dark:border-slate-800">
                                <span class="text-[11px] font-medium text-slate-500">Subtotal</span>
                                <span class="text-[11px] font-bold text-slate-900 dark:text-white">{{ formatCurrency(invoice.subtotal) }}</span>
                            </div>
                            <div v-if="invoice.tax_rate > 0" class="flex justify-between items-center py-1 px-4 border-b border-slate-50 dark:border-slate-800">
                                <span class="text-[11px] font-medium text-slate-500">Pajak ({{ invoice.tax_rate }}%)</span>
                                <span class="text-[11px] font-bold text-slate-900 dark:text-white">{{ formatCurrency(invoice.tax_amount) }}</span>
                            </div>
                            <div v-if="invoice.is_rounded && invoice.rounding_amount > 0" class="flex justify-between items-center py-1 px-4 border-b border-slate-50 dark:border-slate-800 text-primary">
                                <span class="text-[11px] font-medium text-slate-500">Pembulatan</span>
                                <span class="text-[11px] font-bold">{{ formatCurrency(invoice.rounding_amount) }}</span>
                            </div>
                            <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl flex justify-between items-center mt-4">
                                <span class="text-[13px] font-black text-primary uppercase tracking-tight">Total</span>
                                <span class="text-[18px] font-black text-primary tracking-tighter">{{ formatCurrency(invoice.total_amount) }}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Below: Notes -->
                    <div v-if="invoice.notes || profile?.default_invoice_notes" class="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                        <p class="text-sm text-slate-500 font-medium italic leading-[1.8] whitespace-pre-wrap text-center">{{ invoice.notes || profile?.default_invoice_notes }}</p>
                    </div>

                </div>
            </div>
        </div>
    </AppLayout>
</template>

<style scoped>
@media print {
    @page {
        margin: 0;
        size: auto;
    }

    .preview-header {
        display: none !important;
    }
    
    .bg-slate-200\/50,
    .dark\:bg-slate-900\/40 {
        background: white !important;
        padding: 0 !important;
        display: block !important;
    }

    .flex-1.overflow-y-auto {
        display: block !important;
        padding: 0 !important;
        overflow: visible !important;
    }

    .flex-1.p-8.lg\:p-12 {
        padding: 0 !important;
        display: block !important;
    }

    .w-full.max-w-\[210mm\] {
        box-shadow: none !important;
        margin: 0 !important;
        padding: 20mm !important; /* Standard print padding */
        width: 100% !important;
        max-width: none !important;
        min-height: auto !important;
        border: none !important;
    }
}
</style>
