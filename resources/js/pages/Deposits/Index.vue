<script setup lang="ts">
import { Head, useForm, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { ref, watch } from 'vue';
import { refDebounced } from '@vueuse/core';
import { Search, X, Banknote, Plus, Wallet } from 'lucide-vue-next';
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
    deposits: Array<{ id: string; client_name: string; amount: number; payment_date: string; payment_method: string; }>;
    clientBalances: Array<{ client_id: string; client_name: string; total_deposit: number; used_deposit: number; outstanding_balance: number; }>;
    clients: Array<{ id: string; name: string; }>;
    clients: Array<{ id: string; name: string; }>;
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

    router.get('/deposits', query, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Beranda', href: '/dashboard' },
    { title: 'Deposit', href: '/deposits' },
];

const showForm = ref(false);
const form = useForm({ client_id: '', amount: 0, payment_date: new Date().toISOString().split('T')[0], payment_method: 'bank_transfer', reference_number: '', notes: '' });

function fmt(n: number): string {
    return new Intl.NumberFormat(props.currency === 'IDR' ? 'id-ID' : 'en-US', { style: 'currency', currency: props.currency, minimumFractionDigits: props.currency === 'IDR' ? 0 : 2 }).format(n);
}
function fmtDate(d: string): string {
    return new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
}
function submit() {
    form.post('/deposits', { onSuccess: () => { showForm.value = false; form.reset(); } });
}
</script>

<template>
    <Head title="Deposit" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-8 p-6 md:p-8 text-foreground">
            <!-- Header section -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight">Deposit Klien</h1>
                    <p class="text-muted-foreground mt-1 text-base">Kelola saldo titipan dana klien.</p>
                </div>
                <Button @click="showForm = !showForm" class="h-12 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95" :variant="showForm ? 'outline' : 'default'">
                    <Plus v-if="!showForm" class="mr-2 h-5 w-5" />
                    <X v-else class="mr-2 h-5 w-5" />
                    {{ showForm ? 'Batal Tambah' : 'Catat Deposit Baru' }}
                </Button>
            </div>

            <!-- Form Dialog -->
            <div v-if="showForm" class="rounded-xl border bg-card p-6 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                <h2 class="text-lg font-semibold mb-4">Catat Deposit Baru</h2>
                <form @submit.prevent="submit" class="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label class="mb-1 block text-sm font-medium">Klien *</label>
                        <select v-model="form.client_id" required class="w-full h-11 rounded-xl border-input bg-background px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-primary shadow-sm border">
                            <option value="">Pilih klien...</option>
                            <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="mb-1 block text-sm font-medium">Jumlah *</label>
                        <Input v-model.number="form.amount" type="number" min="1" required class="h-11 rounded-xl border-input shadow-sm" placeholder="Contoh: 1000000" />
                    </div>
                    <div>
                        <label class="mb-1 block text-sm font-medium">Tanggal *</label>
                        <Input v-model="form.payment_date" type="date" required class="h-11 rounded-xl border-input shadow-sm" />
                    </div>
                    <div>
                        <label class="mb-1 block text-sm font-medium">Metode *</label>
                        <select v-model="form.payment_method" required class="w-full h-11 rounded-xl border-input bg-background px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-primary shadow-sm border">
                            <option value="bank_transfer">Transfer Bank</option>
                            <option value="cash">Tunai</option>
                            <option value="qris">QRIS / E-Wallet</option>
                            <option value="other">Metode Lainnya</option>
                        </select>
                    </div>
                    <div class="sm:col-span-2 pt-2 flex justify-end">
                        <Button type="submit" :disabled="form.processing" class="h-11 px-8 rounded-xl font-bold shadow-sm">
                            {{ form.processing ? 'Menyimpan...' : 'Simpan Deposit' }}
                        </Button>
                    </div>
                </form>
            </div>

            <!-- Client Balances Card -->
            <div v-if="clientBalances.length > 0" class="card flex flex-col items-center justify-between sm:flex-row gap-6 border-0 bg-primary/5 dark:bg-primary/10 rounded-[24px] overflow-hidden p-6 lg:p-8">
                <div class="flex items-center gap-6">
                    <div class="h-16 w-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
                        <Wallet class="h-8 w-8" />
                    </div>
                    <div>
                        <h2 class="text-xl font-bold tracking-tight text-foreground">Ringkasan Saldo Klien</h2>
                        <p class="text-sm text-primary font-medium mt-1">
                            {{ clientBalances.length }} Klien memiliki dana titipan yang belum terpakai.
                        </p>
                    </div>
                </div>
            </div>

            <div v-if="clientBalances.length > 0" class="card border-0 bg-card shadow-card rounded-[24px] overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b bg-muted/20 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                                <th class="px-8 py-5">Nama Klien</th>
                                <th class="px-6 py-5">Total Disetor</th>
                                <th class="px-6 py-5">Deposit Terpakai</th>
                                <th class="px-8 py-5 text-right border-l border-border/10 bg-primary/5 text-primary">Sisa Deposit</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border/40">
                            <tr v-for="b in clientBalances" :key="b.client_id" class="group transition-colors hover:bg-slate-50/50 dark:hover:bg-muted/10">
                                <td class="px-8 py-6 font-bold text-foreground">{{ b.client_name }}</td>
                                <td class="px-6 py-6 font-medium">{{ fmt(b.total_deposit) }}</td>
                                <td class="px-6 py-6 font-medium text-muted-foreground">{{ fmt(b.used_deposit) }}</td>
                                <td class="px-8 py-6 font-black text-right text-lg text-primary border-l border-border/10 bg-primary/5">
                                    {{ fmt(b.outstanding_balance) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Search and Filters for History -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-6">
                <div class="relative flex-1 max-w-sm">
                    <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        v-model="search" 
                        placeholder="Search nama klien, nominal, metode..." 
                        class="pl-11 h-12 bg-card border-0 shadow-sm rounded-xl focus-visible:ring-primary/10" 
                    />
                    <button v-if="search" @click="search = ''" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
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

            <!-- Deposit History Table -->
            <div class="card border-0 bg-card shadow-card rounded-[24px] overflow-hidden">
                <div class="grid px-8 py-6 border-b border-border/40 bg-muted/10">
                    <h2 class="text-xl font-bold">Riwayat Dana Masuk</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b bg-muted/20 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                                <th class="px-8 py-5">Klien</th>
                                <th class="px-6 py-5">Tanggal</th>
                                <th class="px-6 py-5">Metode</th>
                                <th class="px-8 py-5 text-right border-l border-border/10 bg-muted/5">Nominal Penambahan</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border/40">
                            <tr v-for="d in deposits" :key="d.id" class="group transition-colors hover:bg-slate-50/50 dark:hover:bg-muted/10">
                                <td class="px-8 py-6">
                                    <div class="flex flex-col">
                                        <span class="font-bold text-foreground leading-tight">{{ d.client_name }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-6 text-[14px] text-muted-foreground">{{ fmtDate(d.payment_date) }}</td>
                                <td class="px-6 py-6 text-[14px] text-muted-foreground font-medium uppercase text-xs">{{ d.payment_method || '-' }}</td>
                                <td class="px-8 py-6 text-right font-black text-foreground text-base leading-none border-l border-border/10 bg-muted/5 text-primary">
                                    + {{ fmt(d.amount) }}
                                </td>
                            </tr>
                            <tr v-if="deposits.length === 0">
                                <td colspan="4" class="px-8 py-24 text-center">
                                    <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                                        <div class="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-2">
                                            <Banknote class="h-10 w-10 text-muted-foreground/30" />
                                        </div>
                                        <div>
                                            <p class="text-xl font-bold text-foreground">Riwayat tidak ditemukan</p>
                                            <p class="text-muted-foreground mt-1">Belum ada riwayat dana masuk untuk klien manapun.</p>
                                        </div>
                                        <Button v-if="!showForm" @click="showForm = true" variant="outline" class="mt-4 border-full rounded-xl">
                                            <Plus class="h-4 w-4 mr-2" /> Catat Deposit Pertama
                                        </Button>
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
