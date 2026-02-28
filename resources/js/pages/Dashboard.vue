<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { FileText, Users, DollarSign, TrendingUp, PlusCircle } from 'lucide-vue-next';

interface Stats {
    totalRevenue: number;
    outstandingAmount: number;
    totalInvoices: number;
    activeClients: number;
}

interface RecentInvoice {
    id: string;
    number: string;
    client: string;
    amount: number;
    status: string;
    date: string;
}

const props = defineProps<{
    stats: Stats;
    recentInvoices: RecentInvoice[];
    currency: string;
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Beranda', href: dashboard().url },
];

const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat(props.currency === 'IDR' ? 'id-ID' : 'en-US', {
        style: 'currency',
        currency: props.currency,
        minimumFractionDigits: props.currency === 'IDR' ? 0 : 2,
    }).format(amount);
}
</script>

<template>
    <Head title="Beranda" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 sm:gap-8 p-4 sm:p-6 md:p-8 text-foreground">
            <!-- Header -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight">Beranda</h1>
                    <p class="text-muted-foreground mt-1 text-base">Selamat datang kembali! Berikut ringkasan bisnis Anda.</p>
                </div>
               <!-- <Link href="/invoices/create" class="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors">
                    <PlusCircle class="h-4 w-4" />
                    Invoice Baru
                </Link> -->
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
                <!-- Total Revenue -->
                <div class="card border-0 bg-card rounded-[16px] sm:rounded-[24px] p-4 sm:p-6 lg:p-8 shadow-card flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-xl">
                    <div class="flex items-center gap-2 sm:gap-4 border-b border-border/40 pb-3 sm:pb-4 mb-3 sm:mb-4">
                        <div class="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-primary/10 text-primary shrink-0">
                            <DollarSign class="h-4 w-4 sm:h-6 sm:w-6" />
                        </div>
                        <div class="min-w-0">
                            <p class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">Total Pendapatan</p>
                            <div class="hidden sm:inline-flex items-center gap-1 mt-1 rounded-full text-[11px] font-bold text-emerald-600 dark:text-emerald-500">
                                <TrendingUp class="h-3 w-3" /> +12.5%
                            </div>
                        </div>
                    </div>
                    <div>
                        <p class="text-base sm:text-2xl lg:text-3xl font-black text-foreground">{{ formatCurrency(stats.totalRevenue) }}</p>
                    </div>
                </div>

                <!-- Outstanding -->
                <div class="card border-0 bg-card rounded-[16px] sm:rounded-[24px] p-4 sm:p-6 lg:p-8 shadow-card flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-xl">
                    <div class="flex items-center gap-2 sm:gap-4 border-b border-border/40 pb-3 sm:pb-4 mb-3 sm:mb-4">
                        <div class="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500/10 text-amber-500 shrink-0">
                            <TrendingUp class="h-4 w-4 sm:h-6 sm:w-6" />
                        </div>
                        <div class="min-w-0">
                            <p class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">Belum Dibayar</p>
                            <div class="hidden sm:inline-flex items-center gap-1 mt-1 rounded-full text-[11px] font-bold text-amber-600 dark:text-amber-500">
                                <TrendingUp class="h-3 w-3" /> +8.2%
                            </div>
                        </div>
                    </div>
                    <div>
                        <p class="text-base sm:text-2xl lg:text-3xl font-black text-foreground">{{ formatCurrency(stats.outstandingAmount) }}</p>
                    </div>
                </div>

                <!-- Total Invoices -->
                <div class="card border-0 bg-card rounded-[16px] sm:rounded-[24px] p-4 sm:p-6 lg:p-8 shadow-card flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-xl">
                    <div class="flex items-center gap-2 sm:gap-4 border-b border-border/40 pb-3 sm:pb-4 mb-3 sm:mb-4">
                        <div class="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-500/10 text-blue-500 shrink-0">
                            <FileText class="h-4 w-4 sm:h-6 sm:w-6" />
                        </div>
                        <div class="min-w-0">
                            <p class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">Total Invoice</p>
                            <div class="hidden sm:inline-flex items-center gap-1 mt-1 rounded-full text-[11px] font-bold text-blue-600 dark:text-blue-500">
                                <TrendingUp class="h-3 w-3" /> +15.3%
                            </div>
                        </div>
                    </div>
                    <div>
                        <p class="text-base sm:text-2xl lg:text-3xl font-black text-foreground">{{ stats.totalInvoices }}</p>
                    </div>
                </div>

                <!-- Active Clients -->
                <div class="card border-0 bg-card rounded-[16px] sm:rounded-[24px] p-4 sm:p-6 lg:p-8 shadow-card flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-xl">
                    <div class="flex items-center gap-2 sm:gap-4 border-b border-border/40 pb-3 sm:pb-4 mb-3 sm:mb-4">
                        <div class="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-purple-500/10 text-purple-500 shrink-0">
                            <Users class="h-4 w-4 sm:h-6 sm:w-6" />
                        </div>
                        <div class="min-w-0">
                            <p class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">Klien Aktif</p>
                            <div class="hidden sm:inline-flex items-center gap-1 mt-1 rounded-full text-[11px] font-bold text-purple-600 dark:text-purple-500">
                                <TrendingUp class="h-3 w-3" /> +5.1%
                            </div>
                        </div>
                    </div>
                    <div>
                        <p class="text-base sm:text-2xl lg:text-3xl font-black text-foreground">{{ stats.activeClients }}</p>
                    </div>
                </div>
            </div>

            <!-- Recent Invoices -->
            <div class="card border-0 bg-card shadow-card rounded-[16px] sm:rounded-[24px] overflow-hidden mt-2">
                <div class="card-header flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/40 bg-muted/10 px-4 sm:px-8 py-4 sm:py-6">
                    <div>
                        <h2 class="text-xl font-bold">Invoice Terbaru</h2>
                        <p class="text-sm text-muted-foreground mt-1">Ringkasan aktivitas pembayaran terakhir</p>
                    </div>
                    <div class="mt-4 sm:mt-0">
                        <Link href="/invoices" class="inline-flex items-center justify-center rounded-xl font-medium bg-background border border-border/50 px-4 py-2 text-sm shadow-sm hover:bg-muted transition-colors">Lihat Semua</Link>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm sm:text-base">
                        <thead>
                            <tr class="border-b bg-muted/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                                <th class="px-3 sm:px-8 py-3 sm:py-5">No. Invoice</th>
                                <th class="px-2 sm:px-6 py-3 sm:py-5">Klien</th>
                                <th class="hidden sm:table-cell px-6 py-5">Tanggal</th>
                                <th class="px-2 sm:px-6 py-3 sm:py-5 text-center">Status</th>
                                <th class="px-3 sm:px-8 py-3 sm:py-5 text-right border-l border-border/10">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border/40">
                            <tr v-for="invoice in recentInvoices" :key="invoice.id" class="group transition-colors hover:bg-slate-50/50 dark:hover:bg-muted/10">
                                <td class="px-3 sm:px-8 py-3 sm:py-6">
                                    <Link :href="`/invoices/${invoice.id}`" class="font-bold text-primary hover:underline text-xs sm:text-sm">
                                        {{ invoice.number }}
                                    </Link>
                                </td>
                                <td class="px-2 sm:px-6 py-3 sm:py-6 font-medium text-foreground text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">{{ invoice.client }}</td>
                                <td class="hidden sm:table-cell px-6 py-6 text-muted-foreground text-[14px] font-medium">{{ invoice.date }}</td>
                                <td class="px-2 sm:px-6 py-3 sm:py-6 text-center">
                                    <span :class="[
                                        invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                        invoice.status === 'sent' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                        invoice.status === 'overdue' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
                                        'inline-flex items-center rounded-full px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider'
                                    ]">
                                        {{ invoice.status === 'paid' ? 'LUNAS' : invoice.status === 'sent' ? 'TERKIRIM' : invoice.status === 'overdue' ? 'TERLAMBAT' : invoice.status === 'draft' ? 'DRAF' : invoice.status }}
                                    </span>
                                </td>
                                <td class="px-3 sm:px-8 py-3 sm:py-6 text-right font-black text-foreground text-sm sm:text-lg border-l border-border/10 bg-muted/5">{{ formatCurrency(invoice.amount) }}</td>
                            </tr>
                            <tr v-if="recentInvoices.length === 0">
                                <td colspan="5" class="px-8 py-16 text-center">
                                    <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                                        <div class="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-2">
                                            <FileText class="h-8 w-8 text-muted-foreground/30" />
                                        </div>
                                        <div>
                                            <p class="text-xl font-bold text-foreground">Data tidak ditemukan</p>
                                            <p class="text-muted-foreground mt-1">Belum ada invoice yang tercetak.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

