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
        <div class="flex h-full flex-1 flex-col gap-8 p-6 md:p-8 text-foreground">
            <!-- Header section -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight">Invoices</h1>
                    <p class="text-muted-foreground mt-1 text-base">Manage your billing and client invoices</p>
                </div>
                <Link href="/invoices/create">
                    <Button class="h-12 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                        <Plus class="mr-2 h-5 w-5" />
                        Create New Invoice
                    </Button>
                </Link>
            </div>

            <!-- Search and Filters -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div class="relative flex-1 max-w-sm">
                    <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        v-model="search" 
                        placeholder="Search invoices..." 
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
                    <Select v-model="status">
                        <SelectTrigger class="h-12 w-[180px] rounded-xl border-0 bg-card shadow-sm hover:bg-secondary transition-all">
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
            </div>

            <!-- Main Table Card -->
            <div class="card border-0 bg-card shadow-card rounded-[24px] overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b bg-muted/20 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                                <th class="px-8 py-5">Invoice No.</th>
                                <th class="px-6 py-5">Client</th>
                                <th class="px-6 py-5">Date</th>
                                <th class="px-6 py-5">Due Date</th>
                                <th class="px-6 py-5">Amount</th>
                                <th class="px-6 py-5">Status</th>
                                <th class="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border/40">
                            <tr 
                                v-for="invoice in invoices" 
                                :key="invoice.id" 
                                class="group transition-colors hover:bg-slate-50/50 dark:hover:bg-muted/10"
                            >
                                <td class="px-8 py-6">
                                    <Link :href="`/invoices/${invoice.id}`" class="font-bold text-foreground hover:text-primary transition-all underline-offset-4 hover:underline decoration-primary/30">
                                        {{ invoice.invoice_number }}
                                    </Link>
                                </td>
                                <td class="px-6 py-6">
                                    <div class="flex flex-col">
                                        <span class="font-bold text-foreground leading-tight">{{ invoice.client?.name || '-' }}</span>
                                        <span class="text-[13px] text-muted-foreground">{{ invoice.client?.email || '' }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-6 text-[14px] text-muted-foreground">{{ formatDate(invoice.issue_date) }}</td>
                                <td class="px-6 py-6 text-[14px] text-muted-foreground">{{ formatDate(invoice.due_date) }}</td>
                                <td class="px-6 py-6 font-bold text-foreground text-base leading-none">
                                    {{ formatCurrency(invoice.total_amount) }}
                                </td>
                                <td class="px-6 py-6">
                                    <Badge :variant="statusVariants[invoice.status]" class="rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-opacity-10 border-0 bg-primary/10 text-primary dark:bg-primary/20" :class="{
                                        'bg-green-500/10 text-green-600 dark:text-green-400': invoice.status === 'paid',
                                        'bg-blue-500/10 text-blue-600 dark:text-blue-400': invoice.status === 'sent',
                                        'bg-red-500/10 text-red-600 dark:text-red-400': invoice.status === 'overdue',
                                        'bg-slate-500/10 text-slate-600 dark:text-slate-400': invoice.status === 'draft' || invoice.status === 'cancelled',
                                    }">
                                        {{ statusLabels[invoice.status] || invoice.status }}
                                    </Badge>
                                </td>
                                <td class="px-8 py-6 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <Link :href="`/invoices/${invoice.id}`">
                                            <Button variant="ghost" size="icon" class="rounded-xl h-10 w-10 hover:bg-primary/10 hover:text-primary transition-all" title="View Details">
                                                <Eye class="h-5 w-5" />
                                            </Button>
                                        </Link>
                                        <Link :href="`/invoices/${invoice.id}/edit`">
                                            <Button variant="ghost" size="icon" class="rounded-xl h-10 w-10 hover:bg-blue-500/10 hover:text-blue-600 transition-all" title="Edit Invoice">
                                                <Pencil class="h-5 w-5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="invoices.length === 0">
                                <td colspan="7" class="px-8 py-24 text-center">
                                    <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                                        <div class="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-2">
                                            <Search class="h-10 w-10 text-muted-foreground/30" />
                                        </div>
                                        <div>
                                            <p class="text-xl font-bold text-foreground">No invoices found</p>
                                            <p class="text-muted-foreground mt-1">Try broadening your search or create your first invoice to get started.</p>
                                        </div>
                                        <Link href="/invoices/create" class="mt-2">
                                            <Button variant="secondary" class="rounded-xl px-6">
                                                <Plus class="mr-2 h-4 w-4" />
                                                Create First Invoice
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
            <div class="flex items-center justify-between px-2 pt-2">
                <p class="text-sm text-muted-foreground font-medium">
                    Showing <span class="text-foreground font-bold">{{ invoices.length }}</span> results
                </p>
                <div class="flex items-center gap-2">
                    <Button variant="outline" size="sm" class="h-10 px-4 rounded-xl border-0 bg-card shadow-sm disabled:opacity-50" disabled>Previous</Button>
                    <Button variant="outline" size="sm" class="h-10 px-4 rounded-xl border-0 bg-card shadow-sm disabled:opacity-50" disabled>Next</Button>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
