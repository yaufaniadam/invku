<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Printer, Download, CheckCircle2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

interface Payment { id: string; amount: number; payment_date: string; payment_method: string; guna_membayar: string; }
interface Client { id: string; name: string; email: string; phone: string; address: string; company: string; }
interface Profile { company_name: string; company_address: string; company_phone: string; company_email: string; company_website: string; logo_url: string; }
interface Invoice {
    id: string; invoice_number: string; total_amount: number; client: Client; 
    payments: Payment[]; terbilang: string; custom_terbilang?: string;
}

const props = defineProps<{ invoice: Invoice; profile: Profile; currency: string; activePayment?: Payment; }>();

const displayPayment = props.activePayment || props.invoice.payments[props.invoice.payments.length - 1];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Invoices', href: '/invoices' },
    { title: props.invoice.invoice_number, href: `/invoices/${props.invoice.id}` },
    { title: 'Kwitansi', href: '#' },
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

function printReceipt() {
    window.print();
}
</script>

<template>
    <Head :title="`Kwitansi ${invoice.invoice_number}`" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col p-0 text-foreground bg-white dark:bg-slate-900">
            <!-- Header (In-App Only) -->
            <div class="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between print:hidden">
                <div class="flex items-center gap-4">
                    <Button variant="ghost" size="icon" @click="router.visit(`/invoices/${invoice.id}`)">
                        <ArrowLeft class="h-5 w-5" />
                    </Button>
                    <h1 class="text-sm font-bold">Kwitansi Pembayaran</h1>
                </div>
                <div class="flex items-center gap-3">
                    <Button variant="outline" @click="printReceipt" class="gap-2">
                        <Printer class="h-4 w-4" /> Cetak
                    </Button>
                    <a :href="`/invoices/${invoice.id}/receipt/pdf${props.activePayment ? '?payment_id=' + props.activePayment.id : ''}`">
                        <Button variant="default" class="gap-2 bg-primary">
                            <Download class="h-4 w-4" /> PDF
                        </Button>
                    </a>
                </div>
            </div>

            <!-- Receipt Paper -->
            <div class="flex-1 overflow-y-auto p-4 sm:p-12 flex justify-center bg-slate-50 dark:bg-slate-950/20">
                <div class="w-full max-w-[210mm] bg-white dark:bg-slate-900 shadow-xl rounded-sm p-6 sm:p-16 relative border border-slate-100 dark:border-slate-800">
                    
                    <!-- Header -->
                    <div class="flex justify-between items-start mb-6 sm:mb-12 border-b-2 border-primary/10 pb-4 sm:pb-8">
                        <div>
                            <img v-if="profile.logo_url" :src="profile.logo_url" alt="Logo" class="max-h-10 sm:max-h-12 w-auto mb-2 sm:mb-4" />
                            <h2 class="text-base sm:text-xl font-bold text-slate-800 dark:text-white uppercase tracking-wider">{{ profile.company_name }}</h2>
                            <p class="text-[10px] sm:text-[11px] text-slate-500 mt-1 max-w-sm leading-relaxed">{{ profile.company_address }}</p>
                        </div>
                        <div class="text-right">
                            <h1 class="text-xl sm:text-3xl font-black text-primary tracking-tighter mb-1 uppercase">KWITANSI</h1>
                            <p class="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400">NO: {{ invoice.invoice_number }}/KW</p>
                        </div>
                    </div>

                    <!-- Receipt Content -->
                    <div class="space-y-4 sm:space-y-8 text-slate-700 dark:text-slate-300">
                        <div class="grid grid-cols-12 items-baseline border-b border-slate-100 dark:border-slate-800 pb-3 sm:pb-4 gap-2">
                            <div class="col-span-12 sm:col-span-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">Telah Terima Dari</div>
                            <div class="col-span-12 sm:col-span-9 text-base sm:text-lg font-bold text-slate-900 dark:text-white">: {{ invoice.client.name }}</div>
                        </div>

                        <div class="grid grid-cols-12 items-baseline border-b border-slate-100 dark:border-slate-800 pb-3 sm:pb-4 gap-2">
                            <div class="col-span-12 sm:col-span-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">Sejumlah</div>
                            <div class="col-span-12 sm:col-span-9 text-sm sm:text-base italic font-medium text-slate-700 dark:text-slate-300">: {{ invoice.custom_terbilang || invoice.terbilang }}</div>
                        </div>

                        <div class="grid grid-cols-12 items-baseline border-b border-slate-100 dark:border-slate-800 pb-3 sm:pb-4 gap-2">
                            <div class="col-span-12 sm:col-span-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">Guna Membayar</div>
                            <div class="col-span-12 sm:col-span-9 text-sm sm:text-base font-medium">: {{ displayPayment?.guna_membayar || `Membayar Invoice ${invoice.invoice_number}` }}</div>
                        </div>
                    </div>

                    <!-- Bottom Section -->
                    <div class="mt-8 sm:mt-16 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0">
                        <div class="bg-primary/5 dark:bg-primary/10 border-2 border-primary/20 px-4 sm:px-8 py-3 sm:py-4 rounded-xl">
                            <p class="text-[10px] font-black uppercase tracking-[2px] text-primary/60 mb-1">TERBILANG</p>
                            <p class="text-xl sm:text-3xl font-black text-primary tracking-tighter">{{ formatCurrency(displayPayment?.amount || 0) }}</p>
                        </div>

                        <div class="text-center w-48 sm:w-64">
                            <p class="text-xs font-medium text-slate-500 mb-16">{{ formatDate(displayPayment?.payment_date || new Date().toISOString()) }}</p>
                            <div class="border-b border-slate-200 dark:border-slate-700 w-full mb-2"></div>
                            <p class="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-widest">{{ profile.company_name }}</p>
                        </div>
                    </div>

                    <!-- Lunas Stamp -->
                    <div class="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-10 pointer-events-none rotate-[-15deg]">
                        <div class="border-[8px] border-green-600 rounded-full p-8 flex items-center justify-center">
                            <span class="text-6xl font-black text-green-600 tracking-[10px] uppercase">LUNAS</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<style scoped>
@media print {
    .print\:hidden { display: none !important; }
    @page { margin: 0; size: auto; }
    .bg-slate-50 { background: white !important; padding: 0 !important; }
    .shadow-xl { box-shadow: none !important; border: none !important; }
    .w-full.max-w-\[210mm\] { padding: 20mm !important; margin: 0 !important; max-width: none !important; }
}
</style>
