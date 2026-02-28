<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { DollarSign, FileText, TrendingUp, Users, Search, X, Receipt, Building } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { refDebounced } from '@vueuse/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const props = defineProps<{
    stats: { totalRevenue: number; totalOutstanding: number; totalInvoices: number; paidInvoices: number; };
    monthlyData: Array<{ month: string; revenue: number; outstanding: number; invoices: number; }>;
    clientReports: Array<{ id: string; name: string; company: string; total_invoiced: number; total_paid: number; outstanding: number; invoice_count: number; }>;
    clientReports: Array<{ id: string; name: string; company: string; total_invoiced: number; total_paid: number; outstanding: number; invoice_count: number; }>;
    currency: string;
    filters?: { search?: string; sort?: string };
}>();

const search = ref(props.filters?.search ?? '');
const sort = ref(props.filters?.sort ?? 'all');
const debouncedSearch = refDebounced(search, 500);

watch([debouncedSearch, sort], ([newSearch, newSort]) => {
    const query: any = {};
    if (newSearch) query.search = newSearch;
    if (newSort && newSort !== 'all') query.sort = newSort;

    router.get('/reports', query, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Beranda', href: '/dashboard' },
    { title: 'Laporan', href: '/reports' },
];

function fmt(n: number): string {
    return new Intl.NumberFormat(props.currency === 'IDR' ? 'id-ID' : 'en-US', { style: 'currency', currency: props.currency, minimumFractionDigits: props.currency === 'IDR' ? 0 : 2 }).format(n);
}
</script>

<template>
    <Head title="Laporan" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 sm:gap-8 p-4 sm:p-6 md:p-8 text-foreground">
            <!-- Header section -->
            <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                    <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">Laporan Bisnis</h1>
                    <p class="text-muted-foreground mt-1 text-sm sm:text-base">Ringkasan pendapatan, performa, dan data klien.</p>
                </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
                <div class="card border-0 bg-card rounded-[16px] sm:rounded-[24px] p-3 sm:p-6 lg:p-8 shadow-card flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-xl min-w-0">
                    <div class="flex items-center gap-2 sm:gap-4 border-b border-border/40 pb-2 sm:pb-4 mb-2 sm:mb-4">
                        <div class="flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-primary/10 text-primary shrink-0">
                            <DollarSign class="h-4 w-4 sm:h-6 sm:w-6" />
                        </div>
                        <p class="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">Total Pendapatan</p>
                    </div>
                    <p class="text-base sm:text-2xl lg:text-3xl font-black text-foreground truncate">{{ fmt(stats.totalRevenue) }}</p>
                </div>

                <div class="card border-0 bg-card rounded-[16px] sm:rounded-[24px] p-3 sm:p-6 lg:p-8 shadow-card flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-xl min-w-0">
                    <div class="flex items-center gap-2 sm:gap-4 border-b border-border/40 pb-2 sm:pb-4 mb-2 sm:mb-4">
                        <div class="flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500/10 text-amber-500 shrink-0">
                            <TrendingUp class="h-4 w-4 sm:h-6 sm:w-6" />
                        </div>
                        <p class="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">Belum Dibayar</p>
                    </div>
                    <p class="text-base sm:text-2xl lg:text-3xl font-black text-foreground truncate">{{ fmt(stats.totalOutstanding) }}</p>
                </div>

                <div class="card border-0 bg-card rounded-[16px] sm:rounded-[24px] p-3 sm:p-6 lg:p-8 shadow-card flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-xl min-w-0">
                    <div class="flex items-center gap-2 sm:gap-4 border-b border-border/40 pb-2 sm:pb-4 mb-2 sm:mb-4">
                        <div class="flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-500/10 text-blue-500 shrink-0">
                            <FileText class="h-4 w-4 sm:h-6 sm:w-6" />
                        </div>
                        <p class="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">Total Invoices</p>
                    </div>
                    <p class="text-base sm:text-2xl lg:text-3xl font-black text-foreground">{{ stats.totalInvoices }}</p>
                </div>

                <div class="card border-0 bg-card rounded-[16px] sm:rounded-[24px] p-3 sm:p-6 lg:p-8 shadow-card flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-xl min-w-0">
                    <div class="flex items-center gap-2 sm:gap-4 border-b border-border/40 pb-2 sm:pb-4 mb-2 sm:mb-4">
                        <div class="flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-green-500/10 text-green-500 shrink-0">
                            <Users class="h-4 w-4 sm:h-6 sm:w-6" />
                        </div>
                        <p class="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">Invoice Lunas</p>
                    </div>
                    <p class="text-base sm:text-2xl lg:text-3xl font-black text-foreground">{{ stats.paidInvoices }}</p>
                </div>
            </div>

            <!-- Monthly Data -->
            <div class="card border-0 bg-card shadow-card rounded-[16px] sm:rounded-[24px] overflow-hidden mt-1 sm:mt-2">
                <div class="grid px-4 sm:px-8 py-4 sm:py-6 border-b border-border/40 bg-muted/10">
                    <h2 class="text-lg sm:text-xl font-bold">Performa Bulanan</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm sm:text-base">
                        <thead>
                            <tr class="border-b bg-muted/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                                <th class="px-3 sm:px-8 py-3 sm:py-5">Bulan</th>
                                <th class="px-3 sm:px-6 py-3 sm:py-5">Pendapatan</th>
                                <th class="hidden sm:table-cell px-6 py-5">Belum Dibayar</th>
                                <th class="px-3 sm:px-8 py-3 sm:py-5 text-right border-l border-border/10 bg-muted/5">Jml Inv</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border/40">
                            <tr v-for="m in monthlyData" :key="m.month" class="group transition-colors hover:bg-slate-50/50 dark:hover:bg-muted/10">
                                <td class="px-3 sm:px-8 py-3 sm:py-6 font-bold text-foreground text-xs sm:text-sm">{{ m.month }}</td>
                                <td class="px-3 sm:px-6 py-3 sm:py-6 font-medium text-primary text-xs sm:text-sm">{{ fmt(m.revenue) }}</td>
                                <td class="hidden sm:table-cell px-6 py-6 font-medium text-amber-500">{{ fmt(m.outstanding) }}</td>
                                <td class="px-3 sm:px-8 py-3 sm:py-6 text-right font-black text-foreground text-sm sm:text-lg border-l border-border/10 bg-muted/5">
                                    {{ m.invoices }}
                                </td>
                            </tr>
                            <tr v-if="monthlyData.length === 0">
                                <td colspan="4" class="px-4 sm:px-8 py-12 sm:py-16 text-center text-muted-foreground text-sm">Belum ada data bulanan yang tercatat.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Search and Filters for Client Reports -->
            <div class="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-6">
                <div class="relative flex-1 min-w-0">
                    <Search class="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        v-model="search" 
                        placeholder="Cari klien..." 
                        class="pl-9 sm:pl-11 h-10 sm:h-12 bg-card border-0 shadow-sm rounded-xl focus-visible:ring-primary/10 text-sm" 
                    />
                    <button v-if="search" @click="search = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <X class="h-4 w-4" />
                    </button>
                </div>
                <Select v-model="sort">
                    <SelectTrigger class="h-10 sm:h-12 w-[120px] sm:w-[220px] rounded-xl border-0 bg-card shadow-sm hover:bg-secondary transition-all shrink-0 text-sm">
                        <SelectValue placeholder="Urutkan" />
                    </SelectTrigger>
                    <SelectContent class="rounded-xl border-border/40 shadow-xl">
                        <SelectItem value="all" class="rounded-lg">Total Invoiced</SelectItem>
                        <SelectItem value="highest_revenue" class="rounded-lg">Pendapatan Terbesar</SelectItem>
                        <SelectItem value="highest_outstanding" class="rounded-lg">Tunggakan Terbesar</SelectItem>
                        <SelectItem value="most_invoices" class="rounded-lg">Invoice Terbanyak</SelectItem>
                        <SelectItem value="name_asc" class="rounded-lg">Nama (A-Z)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <!-- Client Reports Table -->
            <div class="card border-0 bg-card shadow-card rounded-[16px] sm:rounded-[24px] overflow-hidden">
                <div class="grid px-4 sm:px-8 py-4 sm:py-6 border-b border-border/40 bg-muted/10">
                    <h2 class="text-lg sm:text-xl font-bold">Laporan per Klien</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm sm:text-base">
                        <thead>
                            <tr class="border-b bg-muted/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                                <th class="px-3 sm:px-8 py-3 sm:py-5">Klien</th>
                                <th class="px-3 sm:px-6 py-3 sm:py-5">Total Inv</th>
                                <th class="hidden sm:table-cell px-6 py-5">Dibayar</th>
                                <th class="hidden md:table-cell px-6 py-5 border-r border-border/10">Tunggakan</th>
                                <th class="px-3 sm:px-8 py-3 sm:py-5 text-right bg-muted/5">Jml</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border/40">
                            <tr v-for="c in clientReports" :key="c.id" class="group transition-colors hover:bg-slate-50/50 dark:hover:bg-muted/10">
                                <td class="px-3 sm:px-8 py-3 sm:py-6">
                                    <div class="flex flex-col">
                                        <span class="font-bold text-foreground leading-tight text-xs sm:text-sm">{{ c.name }}</span>
                                        <span v-if="c.company" class="hidden sm:flex text-[13px] text-muted-foreground items-center gap-1 mt-1">
                                            <Building class="h-3 w-3" /> {{ c.company }}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-3 sm:px-6 py-3 sm:py-6 font-medium text-xs sm:text-sm">{{ fmt(c.total_invoiced) }}</td>
                                <td class="hidden sm:table-cell px-6 py-6 font-medium text-emerald-600 dark:text-emerald-500">{{ fmt(c.total_paid) }}</td>
                                <td class="hidden md:table-cell px-6 py-6 border-r border-border/10">
                                    <span :class="[c.outstanding > 0 ? 'text-rose-600 font-bold dark:text-rose-500' : 'text-muted-foreground']">
                                        {{ fmt(c.outstanding) }}
                                    </span>
                                </td>
                                <td class="px-3 sm:px-8 py-3 sm:py-6 text-right font-black text-foreground text-sm sm:text-base leading-none bg-muted/5">
                                    {{ c.invoice_count }}
                                </td>
                            </tr>
                            <tr v-if="clientReports.length === 0">
                                <td colspan="5" class="px-4 sm:px-8 py-16 sm:py-24 text-center">
                                    <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                                        <div class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-secondary flex items-center justify-center mb-2">
                                            <Search class="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/30" />
                                        </div>
                                        <div>
                                            <p class="text-lg sm:text-xl font-bold text-foreground">Data tidak ditemukan</p>
                                            <p class="text-muted-foreground mt-1 text-sm">Belum ada laporan klien yang cocok dengan pencarian Anda.</p>
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
