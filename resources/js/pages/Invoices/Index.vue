<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Plus, Eye, Pencil, Trash2, Search, Filter, MoreHorizontal, X } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { refDebounced } from '@vueuse/core';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface InvoiceClient {
    id: string;
    name: string;
    email: string;
}

interface Invoice {
    id: string;
    invoice_number: string;
    client: InvoiceClient;
    issue_date: string;
    due_date: string;
    status: string;
    total_amount: number;
}

const props = defineProps<{
    invoices: Invoice[];
    currency: string;
    filters: {
        search?: string;
        status?: string;
    };
    stats: {
        total_paid: number;
        total_unpaid: number;
        total_draft: number;
        count_unpaid: number;
    };
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Invoices', href: '/invoices' },
];

const search = ref(props.filters.search || '');
const status = ref(props.filters.status || 'all');
const debouncedSearch = refDebounced(search, 500);

watch([debouncedSearch, status], ([newSearch, newStatus]) => {
    const query: any = {};
    if (newSearch) query.search = newSearch;
    if (newStatus && newStatus !== 'all') query.status = newStatus;

    router.get('/invoices', query, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
});

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    draft: 'outline',
    sent: 'secondary',
    paid: 'default',
    overdue: 'destructive',
    cancelled: 'outline',
};

const statusLabels: Record<string, string> = {
    draft: 'Draf',
    sent: 'Terkirim',
    paid: 'Lunas',
    overdue: 'Jatuh Tempo',
    cancelled: 'Dibatalkan',
};

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat(props.currency === 'IDR' ? 'id-ID' : 'en-US', {
        style: 'currency',
        currency: props.currency,
        minimumFractionDigits: props.currency === 'IDR' ? 0 : 2,
    }).format(amount);
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
}

</script>

<template>
    <Head title="Invoices" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 sm:gap-8 p-4 sm:p-6 md:p-8 text-foreground">
            <!-- Header section -->
            <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                    <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">Invoice</h1>
                    <p class="text-muted-foreground mt-1 text-sm sm:text-base">Kelola tagihan dan invoice klien</p>
                </div>
                <Link href="/invoices/create" class="shrink-0">
                    <Button class="h-10 sm:h-12 px-3 sm:px-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base">
                        <Plus class="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        <span class="hidden sm:inline">Buat Invoice Baru</span>
                        <span class="sm:hidden">Buat</span>
                    </Button>
                </Link>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <!-- Total Paid -->
                <div class="card bg-card border-border/40 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center px-4">
                    <p class="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Lunas</p>
                    <p class="text-3xl font-black text-primary">{{ formatCurrency(stats.total_paid) }}</p>
                </div>
                <!-- Total Unpaid -->
                <div class="card bg-card border-border/40 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
                    <div v-if="stats.count_unpaid > 0" class="absolute top-0 right-0 bg-destructive text-destructive-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                        {{ stats.count_unpaid }} Tagihan
                    </div>
                    <p class="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Belum Dibayar</p>
                    <p class="text-3xl font-black text-amber-500">{{ formatCurrency(stats.total_unpaid) }}</p>
                </div>
                <!-- Total Draft -->
                <div class="card bg-card border-border/40 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center px-4">
                    <p class="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Draf</p>
                    <p class="text-3xl font-black text-muted-foreground">{{ formatCurrency(stats.total_draft) }}</p>
                </div>
            </div>

            <!-- Search and Filters -->
            <div class="flex items-center gap-2 sm:gap-4">
                <div class="relative flex-1 min-w-0">
                    <Search class="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        v-model="search" 
                        placeholder="Cari invoice..." 
                        class="pl-9 sm:pl-11 h-10 sm:h-12 bg-card border-0 shadow-sm rounded-xl focus-visible:ring-primary/10 text-sm" 
                    />
                    <button 
                        v-if="search" 
                        @click="search = ''" 
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X class="h-4 w-4" />
                    </button>
                </div>
                <Select v-model="status">
                    <SelectTrigger class="h-10 sm:h-12 w-[120px] sm:w-[180px] rounded-xl border-0 bg-card shadow-sm hover:bg-secondary transition-all shrink-0 text-sm">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent class="rounded-xl border-border/40 shadow-xl">
                        <SelectItem value="all" class="rounded-lg">Semua Status</SelectItem>
                        <SelectItem value="draft" class="rounded-lg">Draf</SelectItem>
                        <SelectItem value="sent" class="rounded-lg">Terkirim</SelectItem>
                        <SelectItem value="paid" class="rounded-lg">Lunas</SelectItem>
                        <SelectItem value="overdue" class="rounded-lg">Jatuh Tempo</SelectItem>
                        <SelectItem value="cancelled" class="rounded-lg">Dibatalkan</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <!-- Main Table Card -->
            <div class="card border-0 bg-card shadow-card rounded-[16px] sm:rounded-[24px] overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm sm:text-base">
                        <thead>
                            <tr class="border-b bg-muted/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                                <th class="px-3 sm:px-8 py-3 sm:py-5">No. Invoice</th>
                                <th class="px-2 sm:px-6 py-3 sm:py-5">Klien</th>
                                <th class="hidden md:table-cell px-6 py-5">Tanggal</th>
                                <th class="hidden lg:table-cell px-6 py-5">Jatuh Tempo</th>
                                <th class="px-2 sm:px-6 py-3 sm:py-5 text-right">Jumlah</th>
                                <th class="px-2 sm:px-6 py-3 sm:py-5 text-center">Status</th>
                                <th class="hidden sm:table-cell px-8 py-5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border/40">
                            <tr 
                                v-for="invoice in invoices" 
                                :key="invoice.id" 
                                class="group transition-colors hover:bg-slate-50/50 dark:hover:bg-muted/10"
                            >
                                <td class="px-3 sm:px-8 py-3 sm:py-6">
                                    <Link :href="`/invoices/${invoice.id}`" class="font-bold text-foreground hover:text-primary transition-all underline-offset-4 hover:underline decoration-primary/30 text-xs sm:text-sm">
                                        {{ invoice.invoice_number }}
                                    </Link>
                                    <div class="sm:hidden mt-0.5 text-[10px] text-muted-foreground">{{ formatDate(invoice.issue_date) }}</div>
                                </td>
                                <td class="px-2 sm:px-6 py-3 sm:py-6">
                                    <div class="flex flex-col">
                                        <span class="font-bold text-foreground leading-tight text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">{{ invoice.client?.name || '-' }}</span>
                                        <span class="hidden sm:inline text-[13px] text-muted-foreground">{{ invoice.client?.email || '' }}</span>
                                    </div>
                                </td>
                                <td class="hidden md:table-cell px-6 py-6 text-[14px] text-muted-foreground">{{ formatDate(invoice.issue_date) }}</td>
                                <td class="hidden lg:table-cell px-6 py-6 text-[14px] text-muted-foreground">{{ formatDate(invoice.due_date) }}</td>
                                <td class="px-2 sm:px-6 py-3 sm:py-6 font-bold text-foreground text-xs sm:text-base leading-none text-right">
                                    {{ formatCurrency(invoice.total_amount) }}
                                </td>
                                <td class="px-2 sm:px-6 py-3 sm:py-6 text-center">
                                    <Badge :variant="statusVariants[invoice.status]" class="rounded-lg px-1.5 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider bg-opacity-10 border-0 bg-primary/10 text-primary dark:bg-primary/20" :class="{
                                        'bg-green-500/10 text-green-600 dark:text-green-400': invoice.status === 'paid',
                                        'bg-blue-500/10 text-blue-600 dark:text-blue-400': invoice.status === 'sent',
                                        'bg-red-500/10 text-red-600 dark:text-red-400': invoice.status === 'overdue',
                                        'bg-slate-500/10 text-slate-600 dark:text-slate-400': invoice.status === 'draft' || invoice.status === 'cancelled',
                                    }">
                                        {{ statusLabels[invoice.status] || invoice.status }}
                                    </Badge>
                                </td>
                                <td class="hidden sm:table-cell px-8 py-6 text-right">
                                    <div class="flex items-center justify-end gap-1 sm:gap-2">
                                        <Link :href="`/invoices/${invoice.id}`">
                                            <Button variant="ghost" size="icon" class="rounded-xl h-8 w-8 sm:h-10 sm:w-10 hover:bg-primary/10 hover:text-primary transition-all" title="Lihat Detail">
                                                <Eye class="h-4 w-4 sm:h-5 sm:w-5" />
                                            </Button>
                                        </Link>
                                        <Link :href="`/invoices/${invoice.id}/edit`">
                                            <Button variant="ghost" size="icon" class="rounded-xl h-8 w-8 sm:h-10 sm:w-10 hover:bg-blue-500/10 hover:text-blue-600 transition-all" title="Edit Invoice">
                                                <Pencil class="h-4 w-4 sm:h-5 sm:w-5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="invoices.length === 0">
                                <td colspan="7" class="px-4 sm:px-8 py-16 sm:py-24 text-center">
                                    <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                                        <div class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-secondary flex items-center justify-center mb-2">
                                            <Search class="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/30" />
                                        </div>
                                        <div>
                                            <p class="text-lg sm:text-xl font-bold text-foreground">Invoice tidak ditemukan</p>
                                            <p class="text-muted-foreground mt-1 text-sm">Coba sesuaikan pencarian atau buat invoice pertama Anda.</p>
                                        </div>
                                        <Link href="/invoices/create" class="mt-2">
                                            <Button variant="secondary" class="rounded-xl px-6">
                                                <Plus class="mr-2 h-4 w-4" />
                                                Buat Invoice
                                            </Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Pagination Placeholder -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1 sm:px-2 pt-2">
                <p class="text-xs sm:text-sm text-muted-foreground font-medium">
                    Menampilkan <span class="text-foreground font-bold">{{ invoices.length }}</span> hasil
                </p>
                <div class="flex items-center gap-2">
                    <Button variant="outline" size="sm" class="h-8 sm:h-10 px-3 sm:px-4 rounded-xl border-0 bg-card shadow-sm disabled:opacity-50 text-xs sm:text-sm" disabled>Sebelumnya</Button>
                    <Button variant="outline" size="sm" class="h-8 sm:h-10 px-3 sm:px-4 rounded-xl border-0 bg-card shadow-sm disabled:opacity-50 text-xs sm:text-sm" disabled>Selanjutnya</Button>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
