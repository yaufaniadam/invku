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
        <div class="flex h-full flex-1 flex-col gap-8 p-6 md:p-8 text-foreground">
            <!-- Header section -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight">Laporan Bisnis</h1>
                    <p class="text-muted-foreground mt-1 text-base">Ringkasan pendapatan, performa pembayaran, dan data klien.</p>
                </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div class="card border-0 bg-card rounded-[24px] p-6 lg:p-8 shadow-card flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-xl">
                    <div class="flex items-center gap-4 border-b border-border/40 pb-4 mb-4">
                        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <DollarSign class="h-6 w-6" />
                        </div>
                        <div>
                            <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Pendapatan</p>
                        </div>
                    </div>
                    <div>
                        <p class="text-2xl lg:text-3xl font-black text-foreground">{{ fmt(stats.totalRevenue) }}</p>
                    </div>
                </div>

                <div class="card border-0 bg-card rounded-[24px] p-6 lg:p-8 shadow-card flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-xl">
                    <div class="flex items-center gap-4 border-b border-border/40 pb-4 mb-4">
                        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                            <TrendingUp class="h-6 w-6" />
                        </div>
                        <div>
                            <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Belum Dibayar</p>
                        </div>
                    </div>
                    <div>
                        <p class="text-2xl lg:text-3xl font-black text-foreground">{{ fmt(stats.totalOutstanding) }}</p>
                    </div>
                </div>

                <div class="card border-0 bg-card rounded-[24px] p-6 lg:p-8 shadow-card flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-xl">
                    <div class="flex items-center gap-4 border-b border-border/40 pb-4 mb-4">
                        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                            <FileText class="h-6 w-6" />
                        </div>
                        <div>
                            <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Invoices</p>
                        </div>
                    </div>
                    <div>
                        <p class="text-2xl lg:text-3xl font-black text-foreground">{{ stats.totalInvoices }}</p>
                    </div>
                </div>

                <div class="card border-0 bg-card rounded-[24px] p-6 lg:p-8 shadow-card flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-xl">
                    <div class="flex items-center gap-4 border-b border-border/40 pb-4 mb-4">
                        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
                            <Users class="h-6 w-6" />
                        </div>
                        <div>
                            <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Invoice Lunas</p>
                        </div>
                    </div>
                    <div>
                        <p class="text-2xl lg:text-3xl font-black text-foreground">{{ stats.paidInvoices }}</p>
                    </div>
                </div>
            </div>

            <!-- Monthly Data -->
            <div class="card border-0 bg-card shadow-card rounded-[24px] overflow-hidden mt-2">
                <div class="grid px-8 py-6 border-b border-border/40 bg-muted/10">
                    <h2 class="text-xl font-bold">Performa Bulanan</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b bg-muted/20 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                                <th class="px-8 py-5">Bulan</th>
                                <th class="px-6 py-5">Pendapatan</th>
                                <th class="px-6 py-5">Belum Dibayar</th>
                                <th class="px-8 py-5 text-right border-l border-border/10 bg-muted/5">Jumlah Invoice</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border/40">
                            <tr v-for="m in monthlyData" :key="m.month" class="group transition-colors hover:bg-slate-50/50 dark:hover:bg-muted/10">
                                <td class="px-8 py-6 font-bold text-foreground">{{ m.month }}</td>
                                <td class="px-6 py-6 font-medium text-primary">{{ fmt(m.revenue) }}</td>
                                <td class="px-6 py-6 font-medium text-amber-500">{{ fmt(m.outstanding) }}</td>
                                <td class="px-8 py-6 text-right font-black text-foreground text-lg border-l border-border/10 bg-muted/5">
                                    {{ m.invoices }}
                                </td>
                            </tr>
                            <tr v-if="monthlyData.length === 0">
                                <td colspan="4" class="px-8 py-16 text-center text-muted-foreground">Belum ada data bulanan yang tercatat.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Search and Filters for Client Reports -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-6">
                <div class="relative flex-1 max-w-sm">
                    <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        v-model="search" 
                        placeholder="Search klien, perusahaan..." 
                        class="pl-11 h-12 bg-card border-0 shadow-sm rounded-xl focus-visible:ring-primary/10" 
                    />
                    <button v-if="search" @click="search = ''" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <X class="h-4 w-4" />
                    </button>
                </div>
                <div class="flex items-center gap-3">
                    <Select v-model="sort">
                        <SelectTrigger class="h-12 w-[220px] rounded-xl border-0 bg-card shadow-sm hover:bg-secondary transition-all">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent class="rounded-xl border-border/40 shadow-xl">
                            <SelectItem value="all" class="rounded-lg">Total Invoiced Terbesar</SelectItem>
                            <SelectItem value="highest_revenue" class="rounded-lg">Pendapatan Terbesar</SelectItem>
                            <SelectItem value="highest_outstanding" class="rounded-lg">Tunggakan Terbesar</SelectItem>
                            <SelectItem value="most_invoices" class="rounded-lg">Invoice Terbanyak</SelectItem>
                            <SelectItem value="name_asc" class="rounded-lg">Nama Klien (A-Z)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <!-- Client Reports Table -->
            <div class="card border-0 bg-card shadow-card rounded-[24px] overflow-hidden">
                <div class="grid px-8 py-6 border-b border-border/40 bg-muted/10">
                    <h2 class="text-xl font-bold">Laporan per Klien</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b bg-muted/20 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                                <th class="px-8 py-5">Klien</th>
                                <th class="px-6 py-5">Total Invoice Value</th>
                                <th class="px-6 py-5">Telah Dibayar</th>
                                <th class="px-6 py-5 border-r border-border/10">Sisa Tunggakan</th>
                                <th class="px-8 py-5 text-right bg-muted/5">Jml Inv</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border/40">
                            <tr v-for="c in clientReports" :key="c.id" class="group transition-colors hover:bg-slate-50/50 dark:hover:bg-muted/10">
                                <td class="px-8 py-6">
                                    <div class="flex flex-col">
                                        <span class="font-bold text-foreground leading-tight">{{ c.name }}</span>
                                        <span v-if="c.company" class="text-[13px] text-muted-foreground flex items-center gap-1 mt-1">
                                            <Building class="h-3 w-3" /> {{ c.company }}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-6 py-6 font-medium">{{ fmt(c.total_invoiced) }}</td>
                                <td class="px-6 py-6 font-medium text-emerald-600 dark:text-emerald-500">{{ fmt(c.total_paid) }}</td>
                                <td class="px-6 py-6 border-r border-border/10">
                                    <span :class="[c.outstanding > 0 ? 'text-rose-600 font-bold dark:text-rose-500' : 'text-muted-foreground']">
                                        {{ fmt(c.outstanding) }}
                                    </span>
                                </td>
                                <td class="px-8 py-6 text-right font-black text-foreground text-base leading-none bg-muted/5">
                                    {{ c.invoice_count }}
                                </td>
                            </tr>
                            <tr v-if="clientReports.length === 0">
                                <td colspan="5" class="px-8 py-24 text-center">
                                    <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                                        <div class="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-2">
                                            <Search class="h-10 w-10 text-muted-foreground/30" />
                                        </div>
                                        <div>
                                            <p class="text-xl font-bold text-foreground">Data tidak ditemukan</p>
                                            <p class="text-muted-foreground mt-1">Belum ada laporan klien yang cocok dengan pencarian Anda.</p>
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
