<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search, Trash2, Pencil, Repeat, CalendarIcon, CheckCircle2, XCircle, X } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { toast } from 'vue-sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const props = defineProps<{
    subscriptions: any[];
    totalMonthlyCost: number;
}>();

const showForm = ref(false);
const isEditing = ref(false);

const form = ref({
    id: null,
    name: '',
    amount: '',
    billing_cycle: 'monthly',
    next_billing_date: '',
    status: 'active',
    notes: ''
});

const billingCycles = {
    monthly: 'Bulanan',
    yearly: 'Tahunan',
    weekly: 'Mingguan',
    daily: 'Harian'
};

const searchQuery = ref('');

const filteredData = computed(() => {
    let result = props.subscriptions;
    if (searchQuery.value) {
        result = result.filter((item: any) => 
            item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    }
    return result;
});

const startEdit = (item: any) => {
    isEditing.value = true;
    form.value = {
        id: item.id,
        name: item.name,
        amount: item.amount,
        billing_cycle: item.billing_cycle,
        next_billing_date: item.next_billing_date,
        status: item.status,
        notes: item.notes
    };
    showForm.value = true;
};

const cancelForm = () => {
    showForm.value = false;
    isEditing.value = false;
    form.value = { id: null, name: '', amount: '', billing_cycle: 'monthly', next_billing_date: '', status: 'active', notes: '' };
};

const resetForm = () => {
    form.value = { id: null, name: '', amount: '', billing_cycle: 'monthly', next_billing_date: '', status: 'active', notes: '' };
    isEditing.value = false;
};

const submit = () => {
    if (isEditing.value) {
        router.put(`/subscriptions/${form.value.id}`, form.value, {
            preserveScroll: true,
            onSuccess: () => {
                cancelForm();
                toast.success('Langganan berhasil diperbarui');
            },
            onError: (errors) => {
                toast.error('Gagal memperbarui langganan');
            }
        });
    } else {
        router.post('/subscriptions', form.value, {
            preserveScroll: true,
            onSuccess: () => {
                cancelForm();
                toast.success('Langganan baru berhasil ditambahkan');
            },
            onError: (errors) => {
                toast.error('Gagal menambahkan langganan');
            }
        });
    }
};

const deleteSubscription = (id: number) => {
    if (confirm('Yakin ingin menghapus langganan ini?')) {
        router.delete(`/subscriptions/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Langganan berhasil dihapus');
            },
        });
    }
};

const fmt = (num: number | string) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(num));
};

const fmtDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateString));
};

const getCycleColor = (cycle: string) => {
    const colors: Record<string, string> = {
        monthly: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        yearly: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        weekly: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        daily: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
    };
    return colors[cycle] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
};
</script>

<template>
    <Head title="Langganan & Pengeluaran Rutin" />
    <AppLayout>
        <div class="flex h-full flex-1 flex-col gap-4 sm:gap-8 p-4 sm:p-6 md:p-8 text-foreground">
            <!-- Header section -->
            <div class="flex items-center justify-between gap-3 mb-2 sm:mb-4">
                <div class="min-w-0">
                    <h1 class="text-2xl sm:text-3xl font-bold tracking-tight tracking-tighter">Langganan</h1>
                    <p class="text-muted-foreground mt-1 text-sm sm:text-base">Kelola biaya rutin bulanan seperti internet, listrik, dan software.</p>
                </div>
                <Button @click="showForm ? cancelForm() : (showForm = true)" class="h-10 sm:h-12 px-3 sm:px-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base shrink-0" :variant="showForm ? 'outline' : 'default'">
                    <Plus v-if="!showForm" class="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <X v-else class="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span class="hidden sm:inline">{{ showForm ? 'Batal' : 'Tambah Langganan' }}</span>
                    <span class="sm:hidden">{{ showForm ? 'Batal' : 'Tambah' }}</span>
                </Button>
            </div>

            <!-- Form -->
            <div v-show="showForm" class="rounded-xl border bg-card p-6 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 mb-4 sm:mb-8">
                <h2 class="text-lg font-semibold mb-4">{{ isEditing ? 'Edit Langganan' : 'Catat Langganan Baru' }}</h2>
                <form @submit.prevent="submit" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                    <div class="sm:col-span-2 lg:col-span-3">
                        <label class="mb-1 block text-sm font-medium">Nama Layanan / Provider *</label>
                        <Input id="name" v-model="form.name" required class="h-11 rounded-xl border-input shadow-sm" placeholder="Contoh: Indihome, AWS, Listrik" />
                    </div>

                    <div class="sm:col-span-2 lg:col-span-3">
                        <label class="mb-1 block text-sm font-medium">Nominal Biaya *</label>
                        <div class="relative">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">Rp</span>
                            <Input id="amount" v-model="form.amount" type="number" required class="h-11 pl-12 rounded-xl border-input shadow-sm" placeholder="0" />
                        </div>
                    </div>

                    <div class="sm:col-span-1 lg:col-span-2">
                        <label class="mb-1 block text-sm font-medium">Siklus *</label>
                        <select v-model="form.billing_cycle" required class="w-full h-11 rounded-xl border-input bg-background px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-primary shadow-sm border">
                            <option v-for="(label, key) in billingCycles" :key="key" :value="key">{{ label }}</option>
                        </select>
                    </div>
                    
                    <div class="sm:col-span-1 lg:col-span-2">
                        <label class="mb-1 block text-sm font-medium">Tanggal Berikutnya</label>
                        <Input id="next_billing_date" type="date" v-model="form.next_billing_date" class="h-11 rounded-xl border-input shadow-sm w-full" />
                    </div>

                    <div class="sm:col-span-1 lg:col-span-2">
                        <label class="mb-1 block text-sm font-medium">Status *</label>
                        <select v-model="form.status" required class="w-full h-11 rounded-xl border-input bg-background px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-primary shadow-sm border">
                            <option value="active">Aktif</option>
                            <option value="inactive">Tidak Aktif</option>
                        </select>
                    </div>

                    <div class="sm:col-span-2 lg:col-span-6">
                        <label class="mb-1 block text-sm font-medium">Catatan Tambahan</label>
                        <textarea id="notes" v-model="form.notes" rows="2" class="w-full rounded-xl border-input bg-background px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-primary shadow-sm border resize-none" placeholder="Informasi opsional..."></textarea>
                    </div>
                    
                    <div class="sm:col-span-2 lg:col-span-6 pt-2 flex justify-end gap-2">
                        <Button type="submit" class="h-11 px-8 rounded-xl font-bold shadow-sm">
                            {{ isEditing ? 'Simpan Perubahan' : 'Simpan' }}
                        </Button>
                    </div>
                </form>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-8">
                <div class="card border border-border/40 bg-card rounded-[16px] xl:rounded-[24px] p-4 sm:p-6 shadow-sm">
                    <div class="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div class="p-2.5 sm:p-3 bg-red-100/50 dark:bg-red-500/10 rounded-xl sm:rounded-2xl">
                            <Repeat class="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                        </div>
                        <h3 class="font-semibold text-muted-foreground text-sm sm:text-base">Total Biaya Bulanan</h3>
                    </div>
                    <div>
                        <div class="text-2xl sm:text-4xl font-black tracking-tighter text-red-500">{{ fmt(totalMonthlyCost) }}</div>
                        <p class="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 font-medium">Estimasi pengeluaran rutin tiap bulan</p>
                    </div>
                </div>

                <div class="card border border-border/40 bg-card rounded-[16px] xl:rounded-[24px] p-4 sm:p-6 shadow-sm">
                    <div class="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div class="p-2.5 sm:p-3 bg-primary/10 rounded-xl sm:rounded-2xl">
                            <CheckCircle2 class="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <h3 class="font-semibold text-muted-foreground text-sm sm:text-base">Langganan Aktif</h3>
                    </div>
                    <div>
                        <div class="text-2xl sm:text-4xl font-black tracking-tighter text-foreground">{{ subscriptions.filter(s => s.status === 'active').length }}</div>
                        <p class="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 font-medium">Layanan yang saat ini aktif</p>
                    </div>
                </div>
            </div>

            <!-- Filters -->
            <div class="flex items-center gap-2 sm:gap-4 mb-2">
                <div class="relative flex-1 min-w-0">
                    <Search class="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        v-model="searchQuery" 
                        placeholder="Cari langganan..." 
                        class="pl-9 sm:pl-11 h-10 sm:h-12 bg-card border-0 shadow-sm rounded-xl focus-visible:ring-primary/10 text-sm" 
                    />
                    <button 
                        v-if="searchQuery" 
                        @click="searchQuery = ''" 
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <XCircle class="h-4 w-4" />
                    </button>
                </div>
            </div>

            <!-- Table -->
            <div class="card border-0 bg-card shadow-card rounded-[16px] sm:rounded-[24px] overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm sm:text-base">
                        <thead>
                            <tr class="border-b bg-muted/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                                <th class="px-3 sm:px-6 py-3 sm:py-5 min-w-[120px]">Layanan</th>
                                <th class="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-5">Siklus</th>
                                <th class="hidden md:table-cell px-4 sm:px-6 py-3 sm:py-5">Tagihan Berikutnya</th>
                                <th class="hidden lg:table-cell px-4 sm:px-6 py-3 sm:py-5 text-center">Status</th>
                                <th class="px-3 sm:px-6 py-3 sm:py-5 text-right whitespace-nowrap">Nominal</th>
                                <th class="px-2 sm:px-6 py-3 sm:py-5 text-center w-[60px] sm:w-[100px]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border/40">
                            <tr v-for="s in filteredData" :key="s.id" :class="['group transition-colors', s.status === 'inactive' ? 'bg-muted/30 opacity-70' : 'hover:bg-slate-50/50 dark:hover:bg-muted/10']">
                                <td class="px-3 sm:px-6 py-3 sm:py-6">
                                    <div class="flex flex-col">
                                        <span class="font-bold text-foreground leading-tight text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">{{ s.name }}</span>
                                        <div class="sm:hidden mt-1 flex flex-col gap-0.5">
                                            <span class="text-[10px] text-muted-foreground">
                                                {{ (billingCycles as any)[s.billing_cycle] }} <span v-if="s.next_billing_date">&bull; {{ fmtDate(s.next_billing_date) }}</span>
                                            </span>
                                            <span class="text-[10px] mt-0.5">
                                                <span v-if="s.status === 'active'" class="text-green-500 font-medium">Aktif</span>
                                                <span v-else class="text-muted-foreground font-medium">Tidak Aktif</span>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td class="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-6 whitespace-nowrap">
                                    <span :class="['inline-block px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold', getCycleColor(s.billing_cycle)]">
                                        {{ (billingCycles as any)[s.billing_cycle] }}
                                    </span>
                                </td>
                                <td class="hidden md:table-cell px-4 sm:px-6 py-6 text-[12px] sm:text-[14px] text-muted-foreground whitespace-nowrap">
                                    <div class="flex items-center gap-1.5" v-if="s.next_billing_date">
                                        <CalendarIcon class="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground/60" /> {{ fmtDate(s.next_billing_date) }}
                                    </div>
                                    <span v-else>-</span>
                                </td>
                                <td class="hidden lg:table-cell px-4 sm:px-6 py-6 text-center">
                                    <div class="inline-flex py-1 px-2.5 rounded-full items-center gap-1.5" :class="s.status === 'active' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-slate-500/10 text-slate-600 dark:text-slate-400'">
                                        <CheckCircle2 v-if="s.status === 'active'" class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        <XCircle v-else class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        <span class="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                            {{ s.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-3 sm:px-6 py-3 sm:py-6 font-bold text-foreground text-xs sm:text-base leading-none text-right whitespace-nowrap">
                                    {{ fmt(s.amount) }}
                                </td>
                                <td class="px-2 sm:px-6 py-3 sm:py-6 text-right sm:text-center">
                                    <div class="flex items-center justify-end sm:justify-center gap-1 sm:gap-2">
                                        <Button @click="startEdit(s)" variant="ghost" size="icon" class="rounded-xl h-8 w-8 sm:h-10 sm:w-10 hover:bg-blue-500/10 hover:text-blue-600 transition-all" title="Edit">
                                            <Pencil class="h-4 w-4 sm:h-5 sm:w-5" />
                                        </Button>
                                        <Button @click="deleteSubscription(s.id)" variant="ghost" size="icon" class="rounded-xl h-8 w-8 sm:h-10 sm:w-10 hover:bg-red-500/10 hover:text-red-600 transition-all" title="Hapus">
                                            <Trash2 class="h-4 w-4 sm:h-5 sm:w-5" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="filteredData.length === 0">
                                <td colspan="6" class="px-4 py-16 text-center">
                                    <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                                        <div class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-secondary flex items-center justify-center mb-2">
                                            <Repeat class="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/30" />
                                        </div>
                                        <div>
                                            <p class="text-lg sm:text-xl font-bold text-foreground">Kosong</p>
                                            <p class="text-muted-foreground mt-1 text-sm">Belum ada data langganan.</p>
                                        </div>
                                        <Button v-if="!showForm" @click="showForm = true" variant="secondary" class="mt-2 rounded-xl px-6">
                                            <Plus class="mr-2 h-4 w-4" />
                                            Tambah Langganan
                                        </Button>
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
                    Menampilkan <span class="text-foreground font-bold">{{ filteredData.length }}</span> hasil
                </p>
            </div>
        </div>
    </AppLayout>
</template>
