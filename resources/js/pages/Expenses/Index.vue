<script setup lang="ts">
import { Head, useForm, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { computed, ref, watch, nextTick } from 'vue';
import { refDebounced } from '@vueuse/core';
import { Plus, Pencil, Trash2, X, AlertCircle, FileText, Download, Copy, Search, ChevronsUpDown, Check, Building2, User, Users, Receipt } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Expense {
    id: string;
    category: string;
    category_label: string;
    description: string;
    amount: number;
    expense_date: string;
    payment_method: string | null;
    reference_number: string | null;
    vendor_name: string | null;
    notes: string | null;
    is_recurring: boolean;
    order_id: string | null;
    order_number: string | null;
    order_client: string | null;
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

const props = defineProps<{
    expenses: Paginated<Expense>;
    totalThisMonth: number;
    totalLastMonth: number;
    totalAllTime: number;
    categoryTotals: Record<string, number>;
    categories: Record<string, string>;
    paymentMethods: Record<string, string>;
    orders: Array<{ id: string; label: string }>;
    vendors: Array<{ value: string; label: string }>;
    currency: string;
    filters?: { search?: string; sort?: string; category?: string };
    defaultOrderId?: string;
}>();

const search = ref(props.filters?.search ?? '');
const sort = ref(props.filters?.sort ?? 'all');
const categoryFilter = ref(props.filters?.category ?? 'all');
const debouncedSearch = refDebounced(search, 500);

// Vendor Search Dropdown State
const vendorSearch = ref('');
const vendorDropdownOpen = ref(false);
const searchVendorInputRef = ref<HTMLInputElement | null>(null);

const filteredVendors = computed(() => {
    if (!vendorSearch.value) return props.vendors;
    const q = vendorSearch.value.toLowerCase();
    return props.vendors.filter(v => v.label.toLowerCase().includes(q));
});

function toggleVendorDropdown() {
    vendorDropdownOpen.value = !vendorDropdownOpen.value;
    if (vendorDropdownOpen.value) {
        vendorSearch.value = '';
        nextTick(() => searchVendorInputRef.value?.focus());
    }
}

function selectVendor(vendorName: string) {
    form.vendor_name = vendorName;
    vendorDropdownOpen.value = false;
    vendorSearch.value = '';
}

watch([debouncedSearch, sort, categoryFilter], ([newSearch, newSort, newCategory]) => {
    const query: Record<string, string> = {};
    if (newSearch) query.search = newSearch;
    if (newSort && newSort !== 'all') query.sort = newSort;
    if (newCategory && newCategory !== 'all') query.category = newCategory;

    router.get('/expenses', query, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Beranda', href: '/dashboard' },
    { title: 'Pengeluaran', href: '/expenses' },
];

const showForm = ref(!!props.defaultOrderId);
const editingId = ref<string | null>(null);
const isAddingCategory = ref(false);
const newCategoryInput = ref<HTMLInputElement | null>(null);
const isAddingVendor = ref(false);
const newVendorInput = ref<HTMLInputElement | null>(null);

const form = useForm({
    category: 'salary',
    description: '',
    amount: 0,
    expense_date: new Date().toISOString().split('T')[0],
    payment_method: 'bank_transfer',
    reference_number: '',
    vendor_name: '',
    order_id: props.defaultOrderId ?? '',
    notes: '',
    is_recurring: false,
});

function fmt(n: number): string {
    return new Intl.NumberFormat(props.currency === 'IDR' ? 'id-ID' : 'en-US', {
        style: 'currency',
        currency: props.currency,
        minimumFractionDigits: props.currency === 'IDR' ? 0 : 2,
    }).format(n);
}

function fmtDate(d: string): string {
    return new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
}

function submit() {
    if (editingId.value) {
        form.put(`/expenses/${editingId.value}`, {
            onSuccess: () => { closeForm(); },
        });
    } else {
        form.post('/expenses', {
            onSuccess: () => { closeForm(); },
        });
    }
}

function startEdit(expense: Expense) {
    editingId.value = expense.id;
    form.category = expense.category;
    form.description = expense.description;
    form.amount = expense.amount;
    form.expense_date = expense.expense_date;
    form.payment_method = expense.payment_method ?? 'bank_transfer';
    form.reference_number = expense.reference_number ?? '';
    form.vendor_name = expense.vendor_name ?? '';
    form.order_id = expense.order_id ?? '';
    form.notes = expense.notes ?? '';
    form.is_recurring = expense.is_recurring;
    isAddingCategory.value = false;
    isAddingVendor.value = false;
    showForm.value = true;
}

function duplicateExpense(expense: Expense) {
    editingId.value = null; // Create a new one
    form.category = expense.category;
    form.description = expense.description;
    form.amount = expense.amount;
    form.expense_date = new Date().toISOString().split('T')[0];
    form.payment_method = expense.payment_method ?? 'bank_transfer';
    form.reference_number = expense.reference_number ? expense.reference_number + ' (Copy)' : '';
    form.vendor_name = expense.vendor_name ?? '';
    form.order_id = expense.order_id ?? '';
    form.notes = expense.notes ?? '';
    form.is_recurring = false;
    isAddingCategory.value = false;
    isAddingVendor.value = false;
    showForm.value = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeForm() {
    showForm.value = false;
    editingId.value = null;
    form.reset();
    isAddingCategory.value = false;
    isAddingVendor.value = false;
    form.expense_date = new Date().toISOString().split('T')[0];
}

function deleteExpense(id: string) {
    if (confirm('Yakin ingin menghapus pengeluaran ini?')) {
        router.delete(`/expenses/${id}`);
    }
}

function getCategoryColor(cat: string): string {
    const colors: Record<string, string> = {
        salary: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        vendor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        software: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        operational: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        marketing: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
        other: 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400',
    };
    return colors[cat] ?? colors.other;
}
</script>

<template>
    <Head title="Pengeluaran" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 sm:gap-8 p-4 sm:p-6 md:p-8 text-foreground">
            <!-- Header section -->
            <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                    <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">Pengeluaran</h1>
                    <p class="text-muted-foreground mt-1 text-sm sm:text-base">Catat dan kelola semua biaya bisnis Anda.</p>
                </div>
                <Button @click="showForm ? closeForm() : (showForm = true)" class="h-10 sm:h-12 px-3 sm:px-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 shrink-0 text-sm" :variant="showForm ? 'outline' : 'default'">
                    <Plus v-if="!showForm" class="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <X v-else class="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span class="hidden sm:inline">{{ showForm ? 'Batal' : 'Tambah Pengeluaran' }}</span>
                    <span class="sm:hidden">{{ showForm ? 'Batal' : 'Tambah' }}</span>
                </Button>
            </div>

            <!-- Inline Form -->
            <div v-if="showForm" class="rounded-xl border bg-card p-6 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                <h2 class="text-lg font-semibold mb-4">{{ editingId ? 'Edit Pengeluaran' : 'Catat Pengeluaran Baru' }}</h2>
                <form @submit.prevent="submit" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <label class="mb-1 block text-sm font-medium">Kategori *</label>
                        <div v-if="!isAddingCategory" class="flex items-center gap-2">
                            <select v-model="form.category" required class="flex-1 h-11 rounded-xl border-input bg-background px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-primary shadow-sm border">
                                <option v-for="(label, key) in categories" :key="key" :value="key">{{ label }}</option>
                            </select>
                            <Button type="button" variant="outline" size="icon" class="h-11 w-11 rounded-xl shrink-0 border-dashed" @click="isAddingCategory = true; form.category = ''; nextTick(() => newCategoryInput?.focus())" title="Tambah Kategori Baru">
                                <Plus class="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>
                        <div v-else class="flex items-center gap-2">
                            <Input ref="newCategoryInput" v-model="form.category" required placeholder="Nama Kategori Baru" class="h-11 rounded-xl border-input shadow-sm flex-1 lowercase" />
                            <Button type="button" variant="outline" size="icon" class="h-11 w-11 rounded-xl shrink-0" @click="isAddingCategory = false; form.category = Object.keys(categories)[0] || 'other'" title="Batal Tambah">
                                <X class="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>
                    </div>
                    <div class="sm:col-span-1 lg:col-span-2">
                        <label class="mb-1 block text-sm font-medium">Deskripsi *</label>
                        <Input v-model="form.description" required class="h-11 rounded-xl border-input shadow-sm" placeholder="Contoh: Bayar hosting server" />
                    </div>
                    <div>
                        <label class="mb-1 block text-sm font-medium">Jumlah *</label>
                        <Input v-model.number="form.amount" type="number" min="1" required class="h-11 rounded-xl border-input shadow-sm" placeholder="Contoh: 500000" />
                    </div>
                    <div>
                        <label class="mb-1 block text-sm font-medium">Tanggal *</label>
                        <Input v-model="form.expense_date" type="date" required class="h-11 rounded-xl border-input shadow-sm" />
                    </div>
                    <div>
                        <label class="mb-1 block text-sm font-medium">Metode Pembayaran</label>
                        <select v-model="form.payment_method" class="w-full h-11 rounded-xl border-input bg-background px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-primary shadow-sm border">
                            <option v-for="(label, key) in paymentMethods" :key="key" :value="key">{{ label }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="mb-1 block text-sm font-medium">Nama Vendor</label>
                        <div v-if="!isAddingVendor" class="flex items-center gap-2">
                            <div class="relative flex-1">
                                <button
                                    type="button"
                                    @click="toggleVendorDropdown"
                                    class="flex items-center justify-between h-11 w-full rounded-xl bg-background border border-input px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                >
                                    <span :class="form.vendor_name ? 'text-foreground font-medium' : 'text-muted-foreground/50'">
                                        {{ form.vendor_name || 'Ketuk untuk mencari vendor...' }}
                                    </span>
                                    <ChevronsUpDown class="h-4 w-4 text-muted-foreground/50 shrink-0" />
                                </button>

                                <!-- Dropdown panel -->
                                <div
                                    v-if="vendorDropdownOpen"
                                    class="absolute z-50 mt-1 w-full max-w-[300px] sm:max-w-none max-h-[300px] rounded-2xl bg-card border border-border/40 shadow-xl overflow-hidden"
                                >
                                    <!-- Search input -->
                                    <div class="p-2.5 border-b border-border/30 bg-muted/10">
                                        <div class="relative flex items-center gap-2">
                                            <div class="relative flex-1">
                                                <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                                <input
                                                    ref="searchVendorInputRef"
                                                    v-model="vendorSearch"
                                                    type="text"
                                                    placeholder="Cari atau ketik nama baru..."
                                                    class="w-full h-9 pl-9 pr-3 rounded-lg bg-background border-border text-sm font-medium placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
                                                    @keydown.escape="vendorDropdownOpen = false"
                                                    @keydown.enter.prevent="selectVendor(vendorSearch)"
                                                />
                                            </div>
                                        </div>
                                        <p v-if="vendorSearch && filteredVendors.length === 0" class="text-[10px] text-muted-foreground mt-2 px-1">Ketuk Enter atau tombol '+' untuk menggunakan nama ini secara langsung tanpa menyimpannya ke daftar Vendor.</p>
                                    </div>

                                    <!-- Vendor list -->
                                    <div class="max-h-[220px] overflow-y-auto p-1.5 bg-card">
                                        <button
                                            v-if="vendorSearch && filteredVendors.length === 0"
                                            type="button"
                                            @click="selectVendor(vendorSearch)"
                                            class="flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5 text-sm font-medium text-left cursor-pointer outline-none transition-colors hover:bg-primary/10 text-primary"
                                        >
                                            <Plus class="h-3.5 w-3.5 shrink-0" />
                                            <span class="truncate font-bold">Gunakan "{{ vendorSearch }}"</span>
                                        </button>

                                        <div
                                            v-if="filteredVendors.length === 0 && !vendorSearch"
                                            class="py-6 text-center text-sm text-muted-foreground"
                                        >
                                            Tidak ada vendor.
                                        </div>

                                        <button
                                            v-for="v in filteredVendors"
                                            :key="v.value"
                                            type="button"
                                            @click="selectVendor(v.value)"
                                            class="flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5 text-sm font-medium text-left cursor-pointer outline-none transition-colors hover:bg-primary/10"
                                        >
                                            <span class="truncate flex-1">{{ v.label }}</span>
                                            <Check v-if="form.vendor_name === v.value" class="ml-auto h-4 w-4 text-primary shrink-0" />
                                        </button>
                                    </div>
                                </div>

                                <!-- Click outside overlay -->
                                <div
                                    v-if="vendorDropdownOpen"
                                    class="fixed inset-0 z-40"
                                    @click="vendorDropdownOpen = false"
                                />
                            </div>
                            <Button type="button" variant="outline" size="icon" class="h-11 w-11 rounded-xl shrink-0 border-dashed" @click="isAddingVendor = true; vendorDropdownOpen = false; nextTick(() => newVendorInput?.focus())" title="Tambah Vendor Baru">
                                <Plus class="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>
                        <div v-else class="flex items-center gap-2">
                            <Input ref="newVendorInput" v-model="form.vendor_name" placeholder="Ketik nama vendor baru..." class="h-11 rounded-xl border-input shadow-sm flex-1" />
                            <Button type="button" variant="outline" size="icon" class="h-11 w-11 rounded-xl shrink-0" @click="isAddingVendor = false; form.vendor_name = ''" title="Batal Tambah Vendor">
                                <X class="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <label class="mb-1 block text-sm font-medium">No. Referensi</label>
                        <Input v-model="form.reference_number" class="h-11 rounded-xl border-input shadow-sm" placeholder="Contoh: TRX-001" />
                    </div>
                    <div>
                        <label class="mb-1 block text-sm font-medium">Terkait Pesanan</label>
                        <select v-model="form.order_id" class="w-full h-11 rounded-xl border-input bg-background px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-primary shadow-sm border">
                            <option value="">Tidak terkait pesanan</option>
                            <option v-for="ord in orders" :key="ord.id" :value="ord.id">{{ ord.label }}</option>
                        </select>
                    </div>
                    <div class="sm:col-span-2 lg:col-span-3">
                        <label class="mb-1 block text-sm font-medium">Catatan</label>
                        <textarea v-model="form.notes" rows="2" class="w-full rounded-xl border-input bg-background px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-primary shadow-sm border resize-none" placeholder="Catatan tambahan (opsional)"></textarea>
                    </div>
                    <div class="sm:col-span-2 lg:col-span-3 pb-2 pt-2 border-t border-border/40 mt-2">
                        <label class="flex items-center gap-2 cursor-pointer w-fit group">
                            <input type="checkbox" v-model="form.is_recurring" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary shadow-sm group-hover:bg-primary/5 transition-colors cursor-pointer" />
                            <span class="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Tandai sebagai pengeluaran rutin (Langganan)</span>
                        </label>
                    </div>
                    <div class="sm:col-span-2 lg:col-span-3 flex justify-end gap-2">
                        <Button v-if="editingId" type="button" variant="outline" @click="closeForm" class="h-11 px-6 rounded-xl">Batal</Button>
                        <Button type="submit" :disabled="form.processing" class="h-11 px-8 rounded-xl font-bold shadow-sm">
                            {{ form.processing ? 'Menyimpan...' : (editingId ? 'Perbarui' : 'Simpan') }}
                        </Button>
                    </div>
                </form>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6">
                <!-- This Month -->
                <div class="card flex flex-col gap-4 sm:gap-6 border-0 bg-destructive/5 dark:bg-destructive/10 rounded-[16px] sm:rounded-[24px] overflow-hidden p-4 sm:p-6 lg:p-8">
                    <div class="flex items-center gap-4 sm:gap-6">
                        <div class="h-12 w-12 sm:h-16 sm:w-16 bg-destructive text-destructive-foreground rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-destructive/20 rotate-3 shrink-0">
                            <Receipt class="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <div>
                            <h2 class="text-lg sm:text-xl font-bold tracking-tight text-foreground">Total Bulan Ini</h2>
                            <p class="text-2xl sm:text-3xl font-black text-destructive mt-1">
                                {{ fmt(totalThisMonth) }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Last Month -->
                <div class="card flex flex-col justify-center gap-4 sm:gap-6 border-0 bg-amber-500/5 dark:bg-amber-500/10 rounded-[16px] sm:rounded-[24px] overflow-hidden p-4 sm:p-6 lg:p-8">
                    <div class="flex items-center gap-4 sm:gap-6">
                        <div class="h-12 w-12 sm:h-16 sm:w-16 bg-amber-500 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                            <Receipt class="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <div>
                            <h2 class="text-lg sm:text-xl font-bold tracking-tight text-foreground">Total Bulan Lalu</h2>
                            <p class="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-500 mt-1 truncate">
                                {{ fmt(totalLastMonth) }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- All Time -->
                <div class="card flex flex-col justify-center gap-4 sm:gap-6 border-0 bg-primary/5 dark:bg-primary/10 rounded-[16px] sm:rounded-[24px] overflow-hidden p-4 sm:p-6 lg:p-8">
                    <div class="flex items-center gap-4 sm:gap-6">
                        <div class="h-12 w-12 sm:h-16 sm:w-16 bg-primary text-primary-foreground rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 -rotate-3 shrink-0">
                            <Receipt class="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <div>
                            <h2 class="text-lg sm:text-xl font-bold tracking-tight text-foreground">Total Keseluruhan</h2>
                            <p class="text-2xl sm:text-3xl font-black text-primary mt-1 truncate">
                                {{ fmt(totalAllTime) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Search, Sort, and Category Filter -->
            <div class="flex flex-wrap items-center gap-2 sm:gap-4">
                <div class="relative flex-1 min-w-[180px]">
                    <Search class="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        v-model="search"
                        placeholder="Cari deskripsi, vendor, pesanan..."
                        class="pl-9 sm:pl-11 h-10 sm:h-12 bg-card border-0 shadow-sm rounded-xl focus-visible:ring-primary/10 text-sm"
                    />
                    <button v-if="search" @click="search = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <X class="h-4 w-4" />
                    </button>
                </div>
                <Select v-model="categoryFilter">
                    <SelectTrigger class="h-10 sm:h-12 w-[130px] sm:w-[160px] rounded-xl border-0 bg-card shadow-sm hover:bg-secondary transition-all shrink-0 text-sm">
                        <SelectValue placeholder="Kategori" />
                    </SelectTrigger>
                    <SelectContent class="rounded-xl border-border/40 shadow-xl">
                        <SelectItem value="all" class="rounded-lg">Semua</SelectItem>
                        <SelectItem v-for="(label, key) in categories" :key="key" :value="key" class="rounded-lg">{{ label }}</SelectItem>
                    </SelectContent>
                </Select>
                <Select v-model="sort">
                    <SelectTrigger class="h-10 sm:h-12 w-[120px] sm:w-[160px] rounded-xl border-0 bg-card shadow-sm hover:bg-secondary transition-all shrink-0 text-sm">
                        <SelectValue placeholder="Urutkan" />
                    </SelectTrigger>
                    <SelectContent class="rounded-xl border-border/40 shadow-xl">
                        <SelectItem value="all" class="rounded-lg">Terbaru</SelectItem>
                        <SelectItem value="oldest" class="rounded-lg">Terlama</SelectItem>
                        <SelectItem value="highest" class="rounded-lg">Nominal Tertinggi</SelectItem>
                        <SelectItem value="lowest" class="rounded-lg">Nominal Terendah</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <!-- Expenses Table -->
            <div class="card border-0 bg-card shadow-card rounded-[16px] sm:rounded-[24px] overflow-hidden">
                <div class="grid px-4 sm:px-8 py-4 sm:py-6 border-b border-border/40 bg-muted/10">
                    <h2 class="text-lg sm:text-xl font-bold">Daftar Pengeluaran</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm sm:text-base">
                        <thead>
                            <tr class="border-b bg-muted/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                                <th class="px-3 sm:px-8 py-3 sm:py-5">Deskripsi</th>
                                <th class="hidden sm:table-cell px-6 py-5">Kategori</th>
                                <th class="hidden lg:table-cell px-6 py-5">Vendor</th>
                                <th class="hidden md:table-cell px-6 py-5">Pesanan</th>
                                <th class="hidden sm:table-cell px-6 py-5">Tanggal</th>
                                <th class="px-3 sm:px-6 py-3 sm:py-5 text-right border-l border-border/10 bg-muted/5">Nominal</th>
                                <th class="px-3 sm:px-4 py-3 sm:py-5 text-center w-[80px]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border/40">
                            <tr v-for="e in expenses.data" :key="e.id" class="group transition-colors hover:bg-slate-50/50 dark:hover:bg-muted/10">
                                <td class="px-3 sm:px-8 py-3 sm:py-6">
                                    <div class="flex flex-col">
                                        <span class="font-bold text-foreground leading-tight text-xs sm:text-sm">{{ e.description }}</span>
                                        <span class="sm:hidden text-[10px] text-muted-foreground mt-0.5">
                                            <span :class="['inline-block px-1.5 py-0.5 rounded-full text-[9px] font-semibold mr-1', getCategoryColor(e.category)]">{{ e.category_label }}</span>
                                            {{ fmtDate(e.expense_date) }}
                                        </span>
                                        <span v-if="e.vendor_name" class="lg:hidden text-[10px] text-muted-foreground mt-0.5">{{ e.vendor_name }}</span>
                                    </div>
                                </td>
                                <td class="hidden sm:table-cell px-6 py-6">
                                    <span :class="['inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold', getCategoryColor(e.category)]">
                                        {{ e.category_label }}
                                    </span>
                                </td>
                                <td class="hidden lg:table-cell px-6 py-6 text-[14px] text-muted-foreground">{{ e.vendor_name || '-' }}</td>
                                <td class="hidden md:table-cell px-6 py-6 cursor-pointer" @click="e.order_id ? router.get(`/orders/${e.order_id}`) : null">
                                    <template v-if="e.order_number">
                                        <span class="text-xs font-medium text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 transition-colors px-2 py-1 rounded-lg">{{ e.order_number }}</span>
                                        <span class="block text-[10px] text-muted-foreground mt-0.5">{{ e.order_client }}</span>
                                    </template>
                                    <span v-else class="text-muted-foreground/40">—</span>
                                </td>
                                <td class="hidden sm:table-cell px-6 py-6 text-[14px] text-muted-foreground">{{ fmtDate(e.expense_date) }}</td>
                                <td class="px-3 sm:px-6 py-3 sm:py-6 text-right font-black text-xs sm:text-base leading-none border-l border-border/10 bg-muted/5 text-destructive">
                                    - {{ fmt(e.amount) }}
                                </td>
                                <td class="px-3 sm:px-4 py-3 sm:py-6 text-center">
                                    <div class="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button @click="startEdit(e)" class="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                                            <Pencil class="h-3.5 w-3.5" />
                                        </button>
                                        <button @click="duplicateExpense(e)" class="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Duplikat">
                                            <Copy class="h-3.5 w-3.5" />
                                        </button>
                                        <button @click="deleteExpense(e.id)" class="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Hapus">
                                            <Trash2 class="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="expenses.data.length === 0">
                                <td colspan="7" class="px-4 sm:px-8 py-16 sm:py-24 text-center">
                                    <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                                        <div class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-secondary flex items-center justify-center mb-2">
                                            <Receipt class="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/30" />
                                        </div>
                                        <div>
                                            <p class="text-lg sm:text-xl font-bold text-foreground">Belum ada pengeluaran</p>
                                            <p class="text-muted-foreground mt-1 text-sm">Mulai catat pengeluaran bisnis Anda.</p>
                                        </div>
                                        <Button v-if="!showForm" @click="showForm = true" variant="outline" class="mt-4 rounded-xl">
                                            <Plus class="h-4 w-4 mr-2" /> Catat Pengeluaran Pertama
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="expenses.total > 0" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-1 sm:px-2 pt-2">
                <p class="text-xs sm:text-sm text-muted-foreground font-medium">
                    Menampilkan <span class="text-foreground font-bold">{{ expenses.from }}</span> - <span class="text-foreground font-bold">{{ expenses.to }}</span> dari <span class="text-foreground font-bold">{{ expenses.total }}</span> pengeluaran
                </p>
                <div class="flex flex-wrap items-center gap-1 sm:gap-2">
                    <template v-for="(link, i) in expenses.links" :key="i">
                        <Button 
                            v-if="link.url" 
                            @click="router.get(link.url, {}, { preserveState: true, preserveScroll: true })"
                            :variant="link.active ? 'default' : 'outline'" 
                            size="sm" 
                            class="h-8 sm:h-10 px-3 sm:px-4 rounded-xl shadow-sm text-xs sm:text-sm"
                            v-html="link.label"
                        />
                        <Button 
                            v-else 
                            variant="outline" 
                            size="sm" 
                            class="h-8 sm:h-10 px-3 sm:px-4 rounded-xl border-0 bg-card shadow-sm disabled:opacity-50 text-xs sm:text-sm" 
                            disabled 
                            v-html="link.label"
                        />
                    </template>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
