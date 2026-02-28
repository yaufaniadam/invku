<script setup lang="ts">
import { Head, useForm, router, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { ref, watch, computed, nextTick } from 'vue';
import { refDebounced } from '@vueuse/core';
import { Search, X, Briefcase, Plus, Pencil, Trash2, User, Check, ChevronsUpDown } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Order {
    id: string;
    order_number: string;
    title: string;
    client_name: string;
    status: string;
    status_label: string;
    start_date: string | null;
    end_date: string | null;
}

const props = defineProps<{
    orders: Order[];
    clients: Array<{ id: string; name: string }>;
    filters?: { search?: string; status?: string };
}>();

const search = ref(props.filters?.search ?? '');
const statusFilter = ref(props.filters?.status ?? 'all');
const debouncedSearch = refDebounced(search, 500);

watch([debouncedSearch, statusFilter], ([newSearch, newStatus]) => {
    const query: Record<string, string> = {};
    if (newSearch) query.search = newSearch;
    if (newStatus && newStatus !== 'all') query.status = newStatus;

    router.get('/orders', query, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Beranda', href: '/dashboard' },
    { title: 'Pesanan', href: '/orders' },
];

const showForm = ref(false);
const editingId = ref<string | null>(null);

const form = useForm({
    client_id: '',
    order_number: '',
    title: '',
    status: 'pending',
    start_date: '',
    end_date: '',
    notes: '',
});

const clientDropdownOpen = ref(false);
const clientSearch = ref('');
const searchInputRef = ref<HTMLInputElement | null>(null);

const selectedClientName = computed(() => {
    if (!form.client_id) return null;
    const client = props.clients.find(c => c.id == (form.client_id as any));
    return client ? client.name : null;
});

const filteredClients = computed(() => {
    if (!clientSearch.value) return props.clients;
    const lowerQuery = clientSearch.value.toLowerCase();
    return props.clients.filter(client => 
        client.name.toLowerCase().includes(lowerQuery)
    );
});

function selectClient(client: { id: string; name: string }) {
    form.client_id = client.id;
    clientDropdownOpen.value = false;
    clientSearch.value = '';
}

watch(clientDropdownOpen, (isOpen) => {
    if (isOpen) {
        nextTick(() => {
            searchInputRef.value?.focus();
        });
    } else {
        clientSearch.value = '';
    }
});

function fmtDate(d: string | null): string {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
}

function submit() {
    if (editingId.value) {
        form.put(`/orders/${editingId.value}`, {
            onSuccess: () => { closeForm(); },
        });
    } else {
        form.post('/orders', {
            onSuccess: () => { closeForm(); },
        });
    }
}

function startEdit(order: any) {
    editingId.value = order.id;
    form.client_id = order.client_id;
    form.order_number = order.order_number;
    form.title = order.title;
    form.status = order.status;
    form.start_date = order.start_date ?? '';
    form.end_date = order.end_date ?? '';
    form.notes = order.notes ?? '';
    showForm.value = true;
}

function closeForm() {
    showForm.value = false;
    editingId.value = null;
    form.reset();
}

function deleteOrder(id: string) {
    if (confirm('Yakin ingin menghapus pesanan ini? Semua invoice dan pengeluaran terkait mungkin terpengaruh.')) {
        router.delete(`/orders/${id}`);
    }
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
    <Head title="Pesanan" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 sm:gap-8 p-4 sm:p-6 md:p-8 text-foreground">
            <!-- Header section -->
            <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                    <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">Pesanan</h1>
                    <p class="text-muted-foreground mt-1 text-sm sm:text-base">Kelola proyek dan pesanan klien.</p>
                </div>
                <Button @click="showForm ? closeForm() : (showForm = true)" class="h-10 sm:h-12 px-3 sm:px-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 shrink-0 text-sm" :variant="showForm ? 'outline' : 'default'">
                    <Plus v-if="!showForm" class="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <X v-else class="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span class="hidden sm:inline">{{ showForm ? 'Batal' : 'Buat Pesanan' }}</span>
                    <span class="sm:hidden">{{ showForm ? 'Batal' : 'Buat' }}</span>
                </Button>
            </div>

            <!-- Inline Form -->
            <div v-if="showForm" class="rounded-xl border bg-card p-6 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                <h2 class="text-lg font-semibold mb-4">{{ editingId ? 'Edit Pesanan' : 'Pesanan Baru' }}</h2>
                <form @submit.prevent="submit" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <label class="mb-1 block text-sm font-medium">Klien *</label>
                        <div class="relative">
                            <button
                                type="button"
                                @click="clientDropdownOpen = !clientDropdownOpen"
                                class="flex items-center justify-between h-11 w-full rounded-xl bg-background border-input px-3 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-1 focus:ring-primary border transition-all"
                            >
                                <span :class="selectedClientName ? 'text-foreground' : 'text-muted-foreground/50'">
                                    {{ selectedClientName || 'Pilih Klien...' }}
                                </span>
                                <ChevronsUpDown class="h-4 w-4 text-muted-foreground/50 shrink-0" />
                            </button>
                            
                            <!-- Dropdown Menu -->
                            <div
                                v-if="clientDropdownOpen"
                                class="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-xl border border-border/40 bg-popover text-popover-foreground shadow-xl outline-none"
                            >
                                <div class="p-2 sticky top-0 bg-popover/90 backdrop-blur-sm z-10 border-b border-border/40">
                                    <div class="relative">
                                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                        <input
                                            ref="searchInputRef"
                                            v-model="clientSearch"
                                            type="text"
                                            placeholder="Cari klien..."
                                            class="w-full h-9 pl-9 pr-3 rounded-lg bg-secondary/30 border-0 text-sm font-medium placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
                                            @keydown.escape="clientDropdownOpen = false"
                                        />
                                    </div>
                                </div>
                                <div class="p-1">
                                    <div
                                        v-if="filteredClients.length === 0"
                                        class="py-6 text-center text-sm text-muted-foreground"
                                    >
                                        Klien tidak ditemukan.
                                    </div>
                                    <button
                                        v-for="client in filteredClients"
                                        :key="client.id"
                                        type="button"
                                        @click="selectClient(client)"
                                        class="relative flex w-full cursor-default select-none items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium outline-none hover:bg-secondary/50 focus:bg-secondary/50 focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
                                    >
                                        <User class="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                        <span class="truncate">{{ client.name }}</span>
                                        <Check v-if="form.client_id === client.id" class="ml-auto h-4 w-4 text-primary shrink-0" />
                                    </button>
                                </div>
                            </div>

                            <!-- Click outside overlay -->
                            <div
                                v-if="clientDropdownOpen"
                                class="fixed inset-0 z-40"
                                @click="clientDropdownOpen = false"
                            />
                        </div>
                        <p v-if="form.errors.client_id" class="mt-1 text-xs text-destructive">{{ form.errors.client_id }}</p>
                    </div>
                    <div v-if="editingId">
                        <label class="mb-1 block text-sm font-medium">No. Pesanan *</label>
                        <Input v-model="form.order_number" disabled class="h-11 rounded-xl border-input shadow-sm bg-muted text-muted-foreground opacity-80" />
                    </div>
                    <div v-else>
                        <label class="mb-1 block text-sm font-medium">No. Pesanan</label>
                        <Input disabled value="Dibuat Otomatis" class="h-11 rounded-xl border-input shadow-sm bg-muted text-muted-foreground opacity-80 italic" />
                    </div>
                    <div>
                        <label class="mb-1 block text-sm font-medium">Judul Proyek *</label>
                        <Input v-model="form.title" required class="h-11 rounded-xl border-input shadow-sm" placeholder="Contoh: Pembuatan Website Toko Online" />
                    </div>
                    <div>
                        <label class="mb-1 block text-sm font-medium">Status *</label>
                        <select v-model="form.status" required class="w-full h-11 rounded-xl border-input bg-background px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-primary shadow-sm border">
                            <option value="pending">Pending</option>
                            <option value="in_progress">Dalam Proses</option>
                            <option value="completed">Selesai</option>
                            <option value="cancelled">Dibatalkan</option>
                        </select>
                    </div>
                    <div>
                        <label class="mb-1 block text-sm font-medium">Tanggal Mulai</label>
                        <Input v-model="form.start_date" type="date" class="h-11 rounded-xl border-input shadow-sm" />
                    </div>
                    <div>
                        <label class="mb-1 block text-sm font-medium">Tanggal Selesai</label>
                        <Input v-model="form.end_date" type="date" class="h-11 rounded-xl border-input shadow-sm" />
                    </div>
                    <div class="sm:col-span-2 lg:col-span-3">
                        <label class="mb-1 block text-sm font-medium">Catatan</label>
                        <textarea v-model="form.notes" rows="2" class="w-full rounded-xl border-input bg-background px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-primary shadow-sm border resize-none" placeholder="Catatan internal (opsional)"></textarea>
                    </div>
                    <div class="sm:col-span-2 lg:col-span-3 pt-2 flex justify-end gap-2">
                        <Button v-if="editingId" type="button" variant="outline" @click="closeForm" class="h-11 px-6 rounded-xl">Batal</Button>
                        <Button type="submit" :disabled="form.processing" class="h-11 px-8 rounded-xl font-bold shadow-sm">
                            {{ form.processing ? 'Menyimpan...' : (editingId ? 'Perbarui' : 'Simpan') }}
                        </Button>
                    </div>
                </form>
            </div>

            <!-- Search and Filter -->
            <div class="flex flex-wrap items-center gap-2 sm:gap-4">
                <div class="relative flex-1 min-w-[180px]">
                    <Search class="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        v-model="search"
                        placeholder="Cari judul, no. pesanan, atau klien..."
                        class="pl-9 sm:pl-11 h-10 sm:h-12 bg-card border-0 shadow-sm rounded-xl focus-visible:ring-primary/10 text-sm"
                    />
                    <button v-if="search" @click="search = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <X class="h-4 w-4" />
                    </button>
                </div>
                <Select v-model="statusFilter">
                    <SelectTrigger class="h-10 sm:h-12 w-[140px] sm:w-[160px] rounded-xl border-0 bg-card shadow-sm hover:bg-secondary transition-all shrink-0 text-sm">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent class="rounded-xl border-border/40 shadow-xl">
                        <SelectItem value="all" class="rounded-lg">Semua Status</SelectItem>
                        <SelectItem value="pending" class="rounded-lg">Pending</SelectItem>
                        <SelectItem value="in_progress" class="rounded-lg">Dalam Proses</SelectItem>
                        <SelectItem value="completed" class="rounded-lg">Selesai</SelectItem>
                        <SelectItem value="cancelled" class="rounded-lg">Dibatalkan</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <!-- Orders Table -->
            <div class="card border-0 bg-card shadow-card rounded-[16px] sm:rounded-[24px] overflow-hidden">
                <div class="grid px-4 sm:px-8 py-4 sm:py-6 border-b border-border/40 bg-muted/10">
                    <h2 class="text-lg sm:text-xl font-bold">Daftar Pesanan</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm sm:text-base">
                        <thead>
                            <tr class="border-b bg-muted/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                                <th class="px-4 sm:px-8 py-3 sm:py-5">Pesanan</th>
                                <th class="hidden sm:table-cell px-6 py-5">Klien</th>
                                <th class="hidden md:table-cell px-6 py-5">Status</th>
                                <th class="hidden lg:table-cell px-6 py-5">Tanggal</th>
                                <th class="px-3 sm:px-4 py-3 sm:py-5 text-center w-[80px]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border/40">
                            <tr v-for="o in orders" :key="o.id" class="group transition-colors hover:bg-slate-50/50 dark:hover:bg-muted/10">
                                <!-- Linking the row to the show page -->
                                <td class="px-4 sm:px-8 py-3 sm:py-6 cursor-pointer" @click="router.get(`/orders/${o.id}`)">
                                    <div class="flex flex-col">
                                        <span class="font-bold text-foreground leading-tight text-xs sm:text-sm">{{ o.title }}</span>
                                        <span class="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{{ o.order_number }}</span>
                                        <div class="sm:hidden flex items-center gap-2 mt-1.5">
                                            <span class="text-[10px] text-muted-foreground">{{ o.client_name }}</span>
                                            <span :class="['inline-block px-1.5 py-0.5 rounded-full text-[9px] font-semibold', getStatusColor(o.status)]">
                                                {{ o.status_label }}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td class="hidden sm:table-cell px-6 py-6" @click="router.get(`/orders/${o.id}`)">
                                    <span class="text-xs sm:text-sm font-medium">{{ o.client_name }}</span>
                                </td>
                                <td class="hidden md:table-cell px-6 py-6" @click="router.get(`/orders/${o.id}`)">
                                    <span :class="['inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold', getStatusColor(o.status)]">
                                        {{ o.status_label }}
                                    </span>
                                </td>
                                <td class="hidden lg:table-cell px-6 py-6 text-[14px] text-muted-foreground">
                                    {{ fmtDate(o.start_date) }} - {{ fmtDate(o.end_date) }}
                                </td>
                                <td class="px-3 sm:px-4 py-3 sm:py-6 text-center">
                                    <div class="flex items-center justify-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <button @click.stop="startEdit(o)" class="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                                            <Pencil class="h-3.5 w-3.5" />
                                        </button>
                                        <button @click.stop="deleteOrder(o.id)" class="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Hapus">
                                            <Trash2 class="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="orders.length === 0">
                                <td colspan="5" class="px-4 sm:px-8 py-16 sm:py-24 text-center">
                                    <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                                        <div class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-secondary flex items-center justify-center mb-2">
                                            <Briefcase class="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/30" />
                                        </div>
                                        <div>
                                            <p class="text-lg sm:text-xl font-bold text-foreground">Belum ada pesanan</p>
                                            <p class="text-muted-foreground mt-1 text-sm">Mulai buat pesanan dan kaitkan invoice & pengeluaran ke dalamnya.</p>
                                        </div>
                                        <Button v-if="!showForm" @click="showForm = true" variant="outline" class="mt-4 rounded-xl">
                                            <Plus class="h-4 w-4 mr-2" /> Buat Pesanan Pertama
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
