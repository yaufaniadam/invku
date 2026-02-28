<script setup lang="ts">
import { Head, Link, useForm, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Plus, Pencil, Trash2, X, Search, Building2, Mail, Phone, User, Users } from 'lucide-vue-next';
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

interface Vendor {
    id: string;
    name: string;
    type: 'vendor' | 'person' | 'partner';
    email: string | null;
    phone: string | null;
    address: string | null;
    created_at: string;
}

const props = defineProps<{
    vendors: Vendor[];
    filters?: { search?: string; sort?: string };
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Beranda', href: '/dashboard' },
    { title: 'Vendor', href: '/vendors' },
];

const showForm = ref(false);
const editingVendor = ref<Vendor | null>(null);

const search = ref(props.filters?.search ?? '');
const sort = ref(props.filters?.sort ?? 'all');
const debouncedSearch = refDebounced(search, 500);

watch([debouncedSearch, sort], ([newSearch, newSort]) => {
    const query: any = {};
    if (newSearch) query.search = newSearch;
    if (newSort && newSort !== 'all') query.sort = newSort;

    router.get('/vendors', query, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
});

const form = useForm({
    name: '',
    type: 'vendor',
    email: '',
    phone: '',
    address: '',
});

function openCreate() {
    editingVendor.value = null;
    form.reset();
    showForm.value = true;
}

function openEdit(vendor: Vendor) {
    editingVendor.value = vendor;
    form.name = vendor.name;
    form.type = vendor.type as any;
    form.email = vendor.email ?? '';
    form.phone = vendor.phone ?? '';
    form.address = vendor.address ?? '';
    showForm.value = true;
}

function closeForm() {
    showForm.value = false;
    editingVendor.value = null;
    form.reset();
}

function submit() {
    if (editingVendor.value) {
        form.put(`/vendors/${editingVendor.value.id}`, {
            onSuccess: () => closeForm(),
        });
    } else {
        form.post('/vendors', {
            onSuccess: () => closeForm(),
        });
    }
}

function deleteVendor(vendor: Vendor) {
    if (confirm(`Hapus vendor "${vendor.name}"?`)) {
        router.delete(`/vendors/${vendor.id}`);
    }
}
</script>

<template>
    <Head title="Vendor" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 sm:gap-8 p-4 sm:p-6 md:p-8 text-foreground">
            <!-- Header section -->
            <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                    <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">Vendor</h1>
                    <p class="text-muted-foreground mt-1 text-sm sm:text-base">Kelola daftar vendor, kawan, dan partner bisnis.</p>
                </div>
                <Button @click="showForm ? closeForm() : openCreate()" class="h-10 sm:h-12 px-3 sm:px-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 shrink-0 text-sm sm:text-base" :variant="showForm ? 'outline' : 'default'">
                    <Plus v-if="!showForm" class="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <X v-else class="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span class="hidden sm:inline">{{ showForm ? 'Batal' : 'Tambah Vendor' }}</span>
                    <span class="sm:hidden">{{ showForm ? 'Batal' : 'Tambah' }}</span>
                </Button>
            </div>

            <!-- Form Dialog -->
            <div v-show="showForm" class="rounded-xl border bg-card p-6 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 mb-4 sm:mb-8 mt-4 sm:mt-6">
                <h2 class="text-lg font-semibold mb-4">{{ editingVendor ? 'Edit Vendor' : 'Tambah Vendor Baru' }}</h2>
                <form @submit.prevent="submit" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                    <div class="sm:col-span-2 lg:col-span-3">
                        <label class="mb-1 block text-sm font-medium">Nama *</label>
                        <Input v-model="form.name" required class="h-11 w-full rounded-xl border-input shadow-sm" />
                        <p v-if="form.errors.name" class="mt-1 text-xs text-red-500">{{ form.errors.name }}</p>
                    </div>

                    <div class="sm:col-span-1 lg:col-span-3">
                        <label class="mb-1 block text-sm font-medium">Tipe *</label>
                        <select v-model="form.type" required class="h-11 w-full rounded-xl border-input bg-background shadow-sm px-3 border border-border">
                            <option value="vendor">Vendor</option>
                            <option value="partner">Partner</option>
                            <option value="person">Orang Pribadi</option>
                        </select>
                    </div>
                    
                    <div class="sm:col-span-2 lg:col-span-3">
                        <label class="mb-1 block text-sm font-medium">Email</label>
                        <Input v-model="form.email" type="email" class="h-11 w-full rounded-xl border-input shadow-sm" />
                    </div>
                    
                    <div class="sm:col-span-1 lg:col-span-3">
                        <label class="mb-1 block text-sm font-medium">Telepon</label>
                        <Input v-model="form.phone" type="text" class="h-11 w-full rounded-xl border-input shadow-sm" />
                    </div>
                    
                    <div class="sm:col-span-2 lg:col-span-6">
                        <label class="mb-1 block text-sm font-medium">Alamat</label>
                        <textarea v-model="form.address" rows="2" class="w-full rounded-xl border-input bg-background px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-primary shadow-sm border resize-none"></textarea>
                    </div>
                    
                    <div class="sm:col-span-2 lg:col-span-6 pt-2 flex justify-end gap-2">
                        <Button type="submit" :disabled="form.processing" class="h-11 px-8 rounded-xl font-bold shadow-sm">
                            {{ form.processing ? 'Menyimpan...' : (editingVendor ? 'Perbarui' : 'Simpan') }}
                        </Button>
                    </div>
                </form>
            </div>

            <!-- Search and Filters -->
            <div class="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 mt-4 sm:mt-0">
                <div class="relative flex-1 min-w-0">
                    <Search class="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        v-model="search" 
                        placeholder="Cari vendor, teman, partner..." 
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
                <Select v-model="sort">
                    <SelectTrigger class="h-10 sm:h-12 w-[130px] sm:w-[180px] rounded-xl border-0 bg-card shadow-sm hover:bg-secondary transition-all shrink-0 text-sm">
                        <SelectValue placeholder="Urutkan" />
                    </SelectTrigger>
                    <SelectContent class="rounded-xl border-border/40 shadow-xl">
                        <SelectItem value="all" class="rounded-lg">Terbaru</SelectItem>
                        <SelectItem value="oldest" class="rounded-lg">Terlama</SelectItem>
                        <SelectItem value="name_asc" class="rounded-lg">Nama (A-Z)</SelectItem>
                        <SelectItem value="name_desc" class="rounded-lg">Nama (Z-A)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <!-- Vendor Table -->
            <div class="card border-0 bg-card shadow-card rounded-[16px] sm:rounded-[24px] overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm sm:text-base">
                        <thead>
                            <tr class="border-b bg-muted/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                                <th class="px-3 sm:px-8 py-3 sm:py-5">Nama Vendor</th>
                                <th class="hidden sm:table-cell px-6 py-5">Tipe</th>
                                <th class="hidden md:table-cell px-6 py-5">Kontak</th>
                                <th class="px-2 sm:px-8 py-3 sm:py-5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border/40">
                            <tr 
                                v-for="vendor in vendors" 
                                :key="vendor.id" 
                                class="group transition-colors hover:bg-slate-50/50 dark:hover:bg-muted/10"
                            >
                                <td class="px-3 sm:px-8 py-3 sm:py-6">
                                    <span class="font-bold text-foreground text-xs sm:text-sm">{{ vendor.name }}</span>
                                    <div class="sm:hidden mt-1 flex flex-col gap-0.5">
                                        <span class="text-[11px] text-muted-foreground flex items-center gap-1 uppercase tracking-wider font-semibold">{{ vendor.type }}</span>
                                        <span v-if="vendor.email" class="text-[11px] text-muted-foreground flex items-center gap-1 truncate"><Mail class="h-2.5 w-2.5 shrink-0" /> {{ vendor.email }}</span>
                                        <span v-if="vendor.phone" class="text-[11px] text-muted-foreground flex items-center gap-1"><Phone class="h-2.5 w-2.5 shrink-0" /> {{ vendor.phone }}</span>
                                    </div>
                                </td>
                                <td class="hidden sm:table-cell px-6 py-6 text-[14px] text-muted-foreground">
                                    <span class="flex items-center gap-2 uppercase text-xs tracking-wider font-semibold">
                                        <Building2 v-if="vendor.type === 'vendor'" class="h-3 w-3" />
                                        <Users v-else-if="vendor.type === 'partner'" class="h-3 w-3" />
                                        <User v-else class="h-3 w-3" />
                                        {{ vendor.type }}
                                    </span>
                                </td>
                                <td class="hidden md:table-cell px-6 py-6">
                                    <div class="flex flex-col gap-1">
                                        <span v-if="vendor.email" class="text-[13px] text-muted-foreground flex items-center gap-2"><Mail class="h-3 w-3" /> {{ vendor.email }}</span>
                                        <span v-if="vendor.phone" class="text-[13px] text-muted-foreground flex items-center gap-2"><Phone class="h-3 w-3" /> {{ vendor.phone }}</span>
                                        <span v-if="!vendor.email && !vendor.phone" class="text-[13px] text-muted-foreground">-</span>
                                    </div>
                                </td>
                                <td class="px-2 sm:px-8 py-3 sm:py-6 text-right">
                                    <div class="flex items-center justify-end gap-1 sm:gap-2">
                                        <Button @click="openEdit(vendor)" variant="ghost" size="icon" class="rounded-xl h-8 w-8 sm:h-10 sm:w-10 hover:bg-primary/10 hover:text-primary transition-all" title="Edit Vendor">
                                            <Pencil class="h-4 w-4 sm:h-5 sm:w-5" />
                                        </Button>
                                        <Button @click="deleteVendor(vendor)" variant="ghost" size="icon" class="rounded-xl h-8 w-8 sm:h-10 sm:w-10 hover:bg-red-500/10 hover:text-red-600 transition-all" title="Hapus Vendor">
                                            <Trash2 class="h-4 w-4 sm:h-5 sm:w-5" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="vendors.length === 0">
                                <td colspan="4" class="px-8 py-24 text-center">
                                    <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                                        <div class="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-2">
                                            <Building2 class="h-10 w-10 text-muted-foreground/30" />
                                        </div>
                                        <div>
                                            <p class="text-xl font-bold text-foreground">Vendor tidak ditemukan</p>
                                            <p class="text-muted-foreground mt-1">Coba sesuaikan kata kunci pencarian atau tambah vendor baru.</p>
                                        </div>
                                        <Button @click="openCreate" variant="secondary" class="mt-2 rounded-xl px-6">
                                            <Plus class="mr-2 h-4 w-4" />
                                            Tambah Vendor
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1 sm:px-2 pt-2">
                <p class="text-xs sm:text-sm text-muted-foreground font-medium">
                    Menampilkan <span class="text-foreground font-bold">{{ vendors.length }}</span> data vendor
                </p>
            </div>
        </div>
    </AppLayout>
</template>
