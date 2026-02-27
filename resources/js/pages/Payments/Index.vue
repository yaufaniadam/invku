<script setup lang="ts">
import { Head, router, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { ref, watch } from 'vue';
import { refDebounced } from '@vueuse/core';
import { Search, X, Receipt, Banknote } from 'lucide-vue-next';
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
    payments: Array<{
        id: string; invoice_number: string | null; client_name: string;
        amount: number; payment_date: string; payment_method: string | null;
        payment_type: string; reference_number: string | null;
    }>;
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

    router.get('/payments', query, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Beranda', href: '/dashboard' },
    { title: 'Pembayaran', href: '/payments' },
];

function fmt(amount: number): string {
    return new Intl.NumberFormat(props.currency === 'IDR' ? 'id-ID' : 'en-US', {
        style: 'currency', currency: props.currency,
        minimumFractionDigits: props.currency === 'IDR' ? 0 : 2,
    }).format(amount);
}

function fmtDate(d: string): string {
    return new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
}
</script>

<template>
    <Head title="Pembayaran" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-8 p-6 md:p-8 text-foreground">
            <!-- Header section -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight">Pembayaran</h1>
                    <p class="text-muted-foreground mt-1 text-base">Riwayat transaksi pembayaran dan deposit klien.</p>
                </div>
            </div>

            <!-- Search and Filters -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div class="relative flex-1 max-w-sm">
                    <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        v-model="search" 
                        placeholder="Search transaksi..." 
                        class="pl-11 h-12 bg-card border-0 shadow-sm rounded-xl focus-visible:ring-primary/10" 
                    />
                    <button 
                        v-if="search" 
                        @click="search = ''" 
                        class="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X class="h-4 w-4" />
                    </button>
                </div>
                <div class="flex items-center gap-3">
                    <Select v-model="sort">
                        <SelectTrigger class="h-12 w-[180px] rounded-xl border-0 bg-card shadow-sm hover:bg-secondary transition-all">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent class="rounded-xl border-border/40 shadow-xl">
                            <SelectItem value="all" class="rounded-lg">Terbaru</SelectItem>
                            <SelectItem value="oldest" class="rounded-lg">Terlama</SelectItem>
                            <SelectItem value="highest" class="rounded-lg">Nominal Tertinggi</SelectItem>
                            <SelectItem value="lowest" class="rounded-lg">Nominal Terendah</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <!-- Main Table Card -->
            <div class="card border-0 bg-card shadow-card rounded-[24px] overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b bg-muted/20 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                                <th class="px-8 py-5">Klien / Invoice</th>
                                <th class="px-6 py-5">Tipe Transaksi</th>
                                <th class="px-6 py-5">Tanggal</th>
                                <th class="px-6 py-5">Metode</th>
                                <th class="px-8 py-5 text-right border-l border-border/10 bg-muted/5">Nominal</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border/40">
                            <tr 
                                v-for="p in payments" 
                                :key="p.id" 
                                class="group transition-colors hover:bg-slate-50/50 dark:hover:bg-muted/10"
                            >
                                <td class="px-8 py-6">
                                    <div class="flex flex-col">
                                        <span class="font-bold text-foreground leading-tight">{{ p.client_name }}</span>
                                        <Link v-if="p.invoice_number" :href="`/invoices/${p.invoice_id}`" class="text-[13px] text-primary hover:underline underline-offset-2 flex items-center gap-1 mt-1">
                                            <Receipt class="h-3 w-3" /> {{ p.invoice_number }}
                                        </Link>
                                    </div>
                                </td>
                                <td class="px-6 py-6">
                                    <span :class="[p.payment_type === 'deposit' ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400', 'rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-wider border-0']">
                                        {{ p.payment_type === 'deposit' ? 'Deposit' : 'Pembayaran' }}
                                    </span>
                                </td>
                                <td class="px-6 py-6 text-[14px] text-muted-foreground">{{ fmtDate(p.payment_date) }}</td>
                                <td class="px-6 py-6 text-[14px] text-muted-foreground font-medium uppercase text-xs">{{ p.payment_method || '-' }}</td>
                                <td class="px-8 py-6 text-right font-black text-foreground text-base leading-none border-l border-border/10 bg-muted/5">
                                    <span :class="p.payment_type === 'deposit' ? 'text-primary' : 'text-foreground'">{{ fmt(p.amount) }}</span>
                                </td>
                            </tr>
                            <tr v-if="payments.length === 0">
                                <td colspan="5" class="px-8 py-24 text-center">
                                    <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                                        <div class="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-2">
                                            <Banknote class="h-10 w-10 text-muted-foreground/30" />
                                        </div>
                                        <div>
                                            <p class="text-xl font-bold text-foreground">Transaksi tidak ditemukan</p>
                                            <p class="text-muted-foreground mt-1">Belum ada riwayat pembayaran atau deposit sama sekali.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Pagination Placeholder -->
            <div class="flex items-center justify-between px-2 pt-2">
                <p class="text-sm text-muted-foreground font-medium">
                    Menampilkan <span class="text-foreground font-bold">{{ payments.length }}</span> transaksi
                </p>
                <div class="flex items-center gap-2">
                    <Button variant="outline" size="sm" class="h-10 px-4 rounded-xl border-0 bg-card shadow-sm disabled:opacity-50" disabled>Sebelumnya</Button>
                    <Button variant="outline" size="sm" class="h-10 px-4 rounded-xl border-0 bg-card shadow-sm disabled:opacity-50" disabled>Selanjutnya</Button>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
