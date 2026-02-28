<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Briefcase, ArrowLeft, Receipt, FileText, ArrowRight } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const props = defineProps<{
    order: any;
    invoices: any[];
    expenses: any[];
    stats: {
        total_invoiced: number;
        total_unpaid: number;
        total_expenses: number;
        profit: number;
    };
    currency: string;
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Beranda', href: '/dashboard' },
    { title: 'Pesanan', href: '/orders' },
    { title: props.order.order_number, href: `/orders/${props.order.id}` },
];

function fmt(n: number): string {
    return new Intl.NumberFormat(props.currency === 'IDR' ? 'id-ID' : 'en-US', {
        style: 'currency',
        currency: props.currency,
        minimumFractionDigits: props.currency === 'IDR' ? 0 : 2,
    }).format(n);
}

function fmtDate(d: string | null): string {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        cancelled: 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400',
    };
    return colors[status] ?? colors.pending;
}
</script>

<template>
    <Head :title="order.order_number" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6 md:p-8 text-foreground max-w-7xl mx-auto w-full">
            
            <!-- Header -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="flex items-center gap-3 w-full sm:w-auto">
                    <Button variant="ghost" size="icon" class="h-10 w-10 shrink-0" as-child>
                        <Link href="/orders"><ArrowLeft class="h-5 w-5"/></Link>
                    </Button>
                    <div class="min-w-0">
                        <div class="flex items-center gap-2">
                            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight truncate">{{ order.title }}</h1>
                            <span :class="['hidden sm:inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0', getStatusColor(order.status)]">
                                {{ order.status_label }}
                            </span>
                        </div>
                        <p class="text-muted-foreground mt-1 text-sm sm:text-base truncate">
                            {{ order.order_number }} • {{ order.client.name }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Profit & Loss Summary Cards -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <!-- Total Invoiced (Lunas) -->
                <div class="card bg-card border-border/40 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center text-center">
                    <p class="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Total &nbsp;Invoice &nbsp;(Lunas)</p>
                    <p class="text-xl sm:text-2xl font-black text-primary">{{ fmt(stats.total_invoiced) }}</p>
                </div>
                <!-- Total Unpaid -->
                <div class="card bg-card border-border/40 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center text-center">
                    <p class="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Belum &nbsp;Dibayar</p>
                    <p class="text-xl sm:text-2xl font-black text-amber-500">{{ fmt(stats.total_unpaid) }}</p>
                </div>
                <!-- Total Expenses -->
                <div class="card bg-card border-border/40 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center text-center">
                    <p class="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Total &nbsp;Pengeluaran</p>
                    <p class="text-xl sm:text-2xl font-black text-destructive">{{ fmt(stats.total_expenses) }}</p>
                </div>
                <!-- Profit -->
                <div class="card bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center text-center md:col-span-1 col-span-2">
                    <p class="text-[11px] sm:text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1.5">Keuntungan &nbsp;(Profit)</p>
                    <p class="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-500">{{ fmt(stats.profit) }}</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Left: Invoices tied to this order -->
                <div class="card border-0 bg-card shadow-card rounded-[24px] overflow-hidden flex flex-col h-[500px]">
                    <div class="grid px-6 py-5 border-b border-border/40 bg-muted/10 shrink-0">
                        <div class="flex justify-between items-center">
                            <h2 class="text-lg font-bold flex items-center gap-2">
                                <FileText class="w-5 h-5 text-primary"/> Invoice Terkait
                            </h2>
                            <Button variant="outline" size="sm" class="h-8 rounded-lg" as-child>
                                <Link :href="`/invoices/create?order_id=${order.id}&client_id=${order.client_id}`">Buat Invoice Baru</Link>
                            </Button>
                        </div>
                    </div>
                    <div class="overflow-y-auto p-0 flex-1">
                        <div v-if="invoices.length === 0" class="p-12 text-center text-muted-foreground text-sm flex flex-col items-center">
                            <FileText class="h-10 w-10 text-muted-foreground/20 mb-3" />
                            Belum ada invoice terkait pesanan ini.
                        </div>
                        <ul v-else class="divide-y divide-border/40 text-sm">
                            <li v-for="inv in invoices" :key="inv.id" class="px-6 py-4 hover:bg-muted/5 transition-colors flex justify-between items-center">
                                <div>
                                    <div class="font-bold flex items-center gap-2">
                                        {{ inv.invoice_number }}
                                        <span class="text-[10px] font-normal px-2 bg-muted rounded-full">{{ inv.label_status }}</span>
                                    </div>
                                    <div class="text-muted-foreground text-xs mt-1">{{ fmtDate(inv.issue_date) }}</div>
                                </div>
                                <div class="text-right flex items-center gap-4">
                                    <div class="font-bold whitespace-nowrap">{{ fmt(inv.total_amount) }}</div>
                                    <Link :href="`/invoices/${inv.id}`" class="text-primary hover:text-primary/80"><ArrowRight class="w-4 h-4"/></Link>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Right: Expenses tied to this order -->
                <div class="card border-0 bg-card shadow-card rounded-[24px] overflow-hidden flex flex-col h-[500px]">
                    <div class="grid px-6 py-5 border-b border-border/40 bg-muted/10 shrink-0">
                        <div class="flex justify-between items-center">
                            <h2 class="text-lg font-bold flex items-center gap-2">
                                <Receipt class="w-5 h-5 text-destructive"/> Pengeluaran Terkait
                            </h2>
                            <Button variant="outline" size="sm" class="h-8 rounded-lg" as-child>
                                <Link :href="`/expenses?order_id=${order.id}`">Catat Pengeluaran Baru</Link>
                            </Button>
                        </div>
                    </div>
                    <div class="overflow-y-auto p-0 flex-1">
                        <div v-if="expenses.length === 0" class="p-12 text-center text-muted-foreground text-sm flex flex-col items-center">
                            <Receipt class="h-10 w-10 text-muted-foreground/20 mb-3" />
                            Belum ada pengeluaran terkait pesanan ini.
                        </div>
                        <ul v-else class="divide-y divide-border/40 text-sm">
                            <li v-for="exp in expenses" :key="exp.id" class="px-6 py-4 hover:bg-muted/5 transition-colors flex justify-between items-center">
                                <div>
                                    <div class="font-bold line-clamp-1">{{ exp.description }}</div>
                                    <div class="text-muted-foreground text-[11px] mt-1 flex items-center gap-2">
                                        <span class="bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-sm">{{ exp.category_label }}</span>
                                        {{ fmtDate(exp.expense_date) }}
                                        <span v-if="exp.vendor_name" class="hidden sm:inline-block"> • {{ exp.vendor_name }}</span>
                                    </div>
                                </div>
                                <div class="text-right flex items-center gap-4 pl-4">
                                    <div class="text-destructive font-black whitespace-nowrap">- {{ fmt(exp.amount) }}</div>
                                    <Link :href="`/expenses?search=${encodeURIComponent(exp.description)}`" class="text-primary hover:text-primary/80"><ArrowRight class="w-4 h-4"/></Link>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    </AppLayout>
</template>
