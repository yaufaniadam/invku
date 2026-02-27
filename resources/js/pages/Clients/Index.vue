<script setup lang="ts">
import { Head, Link, useForm, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Plus, Pencil, Trash2, X, Search, Building2, Mail, Phone, MoreHorizontal } from 'lucide-vue-next';
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

interface Client {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    company: string | null;
    invoice_title: string | null;
    created_at: string;
    invoices_count: number;
}

const props = defineProps<{
    clients: Client[];
    filters?: { search?: string; sort?: string };
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Beranda', href: '/dashboard' },
    { title: 'Klien', href: '/clients' },
];

const showForm = ref(false);
const editingClient = ref<Client | null>(null);

const search = ref(props.filters?.search ?? '');
const sort = ref(props.filters?.sort ?? 'all');
const debouncedSearch = refDebounced(search, 500);

watch([debouncedSearch, sort], ([newSearch, newSort]) => {
    const query: any = {};
    if (newSearch) query.search = newSearch;
    if (newSort && newSort !== 'all') query.sort = newSort;

    router.get('/clients', query, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
});

const form = useForm({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    invoice_title: '',
});

function openCreate() {
    editingClient.value = null;
    form.reset();
    showForm.value = true;
}

function openEdit(client: Client) {
    editingClient.value = client;
    form.name = client.name;
    form.email = client.email ?? '';
    form.phone = client.phone ?? '';
    form.address = client.address ?? '';
    form.company = client.company ?? '';
    form.invoice_title = client.invoice_title ?? '';
    showForm.value = true;
}

function closeForm() {
    showForm.value = false;
    editingClient.value = null;
    form.reset();
}

function submit() {
    if (editingClient.value) {
        form.put(`/clients/${editingClient.value.id}`, {
            onSuccess: () => closeForm(),
        });
    } else {
        form.post('/clients', {
            onSuccess: () => closeForm(),
        });
    }
}

function deleteClient(client: Client) {
    if (confirm(`Hapus klien "${client.name}"?`)) {
        router.delete(`/clients/${client.id}`);
    }
}
</script>

<template>
    <Head title="Klien" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-8 p-6 md:p-8 text-foreground">
            <!-- Header section -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight">Klien</h1>
                    <p class="text-muted-foreground mt-1 text-base">Kelola data klien Anda.</p>
                </div>
                <Button @click="openCreate" class="h-12 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                    <Plus class="mr-2 h-5 w-5" />
                    Tambah Klien
                </Button>
            </div>

            <!-- Search and Filters -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div class="relative flex-1 max-w-sm">
                    <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        v-model="search" 
                        placeholder="Search clients..." 
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
                            <SelectItem value="name_asc" class="rounded-lg">Nama (A-Z)</SelectItem>
                            <SelectItem value="name_desc" class="rounded-lg">Nama (Z-A)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <!-- Form Dialog -->
            <div v-if="showForm" class="rounded-xl border bg-card p-6 shadow-sm">
                <div class="mb-4 flex items-center justify-between">
                    <h2 class="text-lg font-semibold">{{ editingClient ? 'Edit Klien' : 'Tambah Klien Baru' }}</h2>
                    <button @click="closeForm" class="text-muted-foreground hover:text-foreground">
                        <X class="h-5 w-5" />
                    </button>
                </div>
                <form @submit.prevent="submit" class="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label class="mb-1 block text-sm font-medium">Nama *</label>
                        <input v-model="form.name" type="text" required class="w-full rounded-md border bg-background px-3 py-2 text-sm" />
                        <p v-if="form.errors.name" class="mt-1 text-xs text-red-500">{{ form.errors.name }}</p>
                    </div>
                    <div>
                        <label class="mb-1 block text-sm font-medium">Email</label>
                        <input v-model="form.email" type="email" class="w-full rounded-md border bg-background px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label class="mb-1 block text-sm font-medium">Telepon</label>
                        <input v-model="form.phone" type="text" class="w-full rounded-md border bg-background px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label class="mb-1 block text-sm font-medium">Perusahaan</label>
                        <input v-model="form.company" type="text" class="w-full rounded-md border bg-background px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label class="mb-1 block text-sm font-medium">Istilah Invoice (Contoh: Nota Pembayaran)</label>
                        <input v-model="form.invoice_title" type="text" placeholder="Default: INVOICE" class="w-full rounded-md border bg-background px-3 py-2 text-sm" />
                    </div>
                    <div class="sm:col-span-2">
                        <label class="mb-1 block text-sm font-medium">Alamat</label>
                        <textarea v-model="form.address" rows="2" class="w-full rounded-md border bg-background px-3 py-2 text-sm"></textarea>
                    </div>
                    <div class="sm:col-span-2 flex gap-2">
                        <button type="submit" :disabled="form.processing" class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50">
                            {{ form.processing ? 'Menyimpan...' : (editingClient ? 'Perbarui' : 'Simpan') }}
                        </button>
                        <button type="button" @click="closeForm" class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
                            Batal
                        </button>
                    </div>
                </form>
            </div>

            <!-- Client Table -->
            <div class="card border-0 bg-card shadow-card rounded-[24px] overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b bg-muted/20 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                                <th class="px-8 py-5">Nama Klien</th>
                                <th class="px-6 py-5">Kontak</th>
                                <th class="px-6 py-5">Perusahaan</th>
                                <th class="px-6 py-5">Total Invoice</th>
                                <th class="px-8 py-5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border/40">
                            <tr 
                                v-for="client in clients" 
                                :key="client.id" 
                                class="group transition-colors hover:bg-slate-50/50 dark:hover:bg-muted/10"
                            >
                                <td class="px-8 py-6">
                                    <span class="font-bold text-foreground">{{ client.name }}</span>
                                </td>
                                <td class="px-6 py-6 flex flex-col gap-1">
                                    <span v-if="client.email" class="text-[13px] text-muted-foreground flex items-center gap-2"><Mail class="h-3 w-3" /> {{ client.email }}</span>
                                    <span v-if="client.phone" class="text-[13px] text-muted-foreground flex items-center gap-2"><Phone class="h-3 w-3" /> {{ client.phone }}</span>
                                    <span v-if="!client.email && !client.phone" class="text-[13px] text-muted-foreground">-</span>
                                </td>
                                <td class="px-6 py-6 text-[14px] text-muted-foreground">
                                    <span v-if="client.company" class="flex items-center gap-2"><Building2 class="h-3 w-3" /> {{ client.company }}</span>
                                    <span v-else>-</span>
                                </td>
                                <td class="px-6 py-6 font-bold text-foreground text-base leading-none">
                                    {{ client.invoices_count }}
                                </td>
                                <td class="px-8 py-6 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <Button @click="openEdit(client)" variant="ghost" size="icon" class="rounded-xl h-10 w-10 hover:bg-primary/10 hover:text-primary transition-all" title="Edit Klien">
                                            <Pencil class="h-5 w-5" />
                                        </Button>
                                        <Button @click="deleteClient(client)" variant="ghost" size="icon" class="rounded-xl h-10 w-10 hover:bg-red-500/10 hover:text-red-600 transition-all" title="Hapus Klien">
                                            <Trash2 class="h-5 w-5" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="clients.length === 0">
                                <td colspan="5" class="px-8 py-24 text-center">
                                    <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                                        <div class="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-2">
                                            <Search class="h-10 w-10 text-muted-foreground/30" />
                                        </div>
                                        <div>
                                            <p class="text-xl font-bold text-foreground">Klien tidak ditemukan</p>
                                            <p class="text-muted-foreground mt-1">Coba sesuaikan kata kunci pencarian atau tambah klien baru.</p>
                                        </div>
                                        <Button @click="openCreate" variant="secondary" class="mt-2 rounded-xl px-6">
                                            <Plus class="mr-2 h-4 w-4" />
                                            Tambah Klien
                                        </Button>
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
                    Menampilkan <span class="text-foreground font-bold">{{ clients.length }}</span> data klien
                </p>
                <div class="flex items-center gap-2">
                    <Button variant="outline" size="sm" class="h-10 px-4 rounded-xl border-0 bg-card shadow-sm disabled:opacity-50" disabled>Sebelumnya</Button>
                    <Button variant="outline" size="sm" class="h-10 px-4 rounded-xl border-0 bg-card shadow-sm disabled:opacity-50" disabled>Selanjutnya</Button>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
