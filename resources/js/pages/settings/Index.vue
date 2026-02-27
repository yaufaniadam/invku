<script setup lang="ts">
import { ref } from 'vue';
import { Head, useForm, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Building2, Save, UploadCloud, X } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/composables/useToast';

const { success, error } = useToast();

interface Profile {
    id: string;
    company_name: string | null;
    company_address: string | null;
    company_phone: string | null;
    company_email: string | null;
    company_website: string | null;
    tax_id: string | null;
    logo_url: string | null;
    bank_name: string | null;
    bank_account_number: string | null;
    bank_account_name: string | null;
    default_invoice_notes: string | null;
}

const props = defineProps<{
    profile: Profile;
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengaturan', href: '/settings/company' },
];

const form = useForm({
    company_name: props.profile.company_name || '',
    company_address: props.profile.company_address || '',
    company_phone: props.profile.company_phone || '',
    company_email: props.profile.company_email || '',
    company_website: props.profile.company_website || '',
    tax_id: props.profile.tax_id || '',
    bank_name: props.profile.bank_name || '',
    bank_account_number: props.profile.bank_account_number || '',
    bank_account_name: props.profile.bank_account_name || '',
    default_invoice_notes: props.profile.default_invoice_notes || '',
    logo: null as File | null,
});

const logoPreview = ref<string | null>(props.profile.logo_url);
const fileInput = ref<HTMLInputElement | null>(null);

function triggerFileInput() {
    fileInput.value?.click();
}

function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        const file = target.files[0];
        if (file.size > 2 * 1024 * 1024) {
            alert('File size should not exceed 2MB');
            return;
        }
        form.logo = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                logoPreview.value = e.target.result as string;
            }
        };
        reader.readAsDataURL(file);
    }
}

function removeLogo() {
    form.logo = null;
    logoPreview.value = null; // Visually remove it
    // Note: To actually delete from server, we might need a separate endpoint or send a flag in update. 
    // For now, this just clears the current selection if they are changing it.
}

function submit() {
    form.post('/settings/company', {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => {
            success('Berhasil!', 'Pengaturan perusahaan telah disimpan.');
        },
        onError: (errors) => {
            error('Gagal menyimpan pengaturan', 'Silakan periksa kembali input Anda.');
            console.error(errors);
        }
    });
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Pengaturan Perusahaan" />

        <div class="flex h-full flex-col gap-8 p-6 md:p-8 text-foreground">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight">Pengaturan Perusahaan</h1>
                    <p class="text-muted-foreground mt-1 text-base">Kelola informasi profil dan branding perusahaan Anda.</p>
                </div>
            </div>

            <form @submit.prevent="submit" class="grid gap-8">
                <div class="card border-0 bg-card rounded-[24px] shadow-card overflow-hidden">
                    <div class="border-b border-border/40 bg-muted/10 px-8 py-6">
                        <h2 class="text-xl font-bold flex items-center gap-2">
                            <Building2 class="h-5 w-5 text-muted-foreground" />
                            Informasi Perusahaan
                        </h2>
                    </div>

                    <div class="space-y-6 p-6 lg:p-8">
                        <div class="grid gap-6 sm:grid-cols-2">
                            <!-- Company Name -->
                            <div class="space-y-2">
                                <Label for="company_name" class="font-medium text-foreground">Nama Perusahaan <span class="text-destructive">*</span></Label>
                                <Input id="company_name" v-model="form.company_name" placeholder="PT Solusi Desain" class="h-12 bg-secondary/50 border-0 focus-visible:ring-primary/20 rounded-xl" required />
                                <span v-if="form.errors.company_name" class="text-sm text-destructive">{{ form.errors.company_name }}</span>
                            </div>

                            <!-- Email -->
                            <div class="space-y-2">
                                <Label for="company_email" class="font-medium text-foreground">Email Perusahaan</Label>
                                <Input id="company_email" type="email" v-model="form.company_email" placeholder="halo@solusidesain.net" class="h-12 bg-secondary/50 border-0 focus-visible:ring-primary/20 rounded-xl" />
                                <span v-if="form.errors.company_email" class="text-sm text-destructive">{{ form.errors.company_email }}</span>
                            </div>

                            <!-- Phone -->
                            <div class="space-y-2">
                                <Label for="company_phone" class="font-medium text-foreground">Nomor Telepon</Label>
                                <Input id="company_phone" v-model="form.company_phone" placeholder="08123456789" class="h-12 bg-secondary/50 border-0 focus-visible:ring-primary/20 rounded-xl" />
                                <span v-if="form.errors.company_phone" class="text-sm text-destructive">{{ form.errors.company_phone }}</span>
                            </div>

                            <!-- Website -->
                            <div class="space-y-2">
                                <Label for="company_website" class="font-medium text-foreground">Website</Label>
                                <Input id="company_website" type="url" v-model="form.company_website" placeholder="https://solusidesain.net" class="h-12 bg-secondary/50 border-0 focus-visible:ring-primary/20 rounded-xl" />
                                <span v-if="form.errors.company_website" class="text-sm text-destructive">{{ form.errors.company_website }}</span>
                            </div>

                             <!-- Tax ID -->
                             <div class="space-y-2">
                                <Label for="tax_id" class="font-medium text-foreground">NPWP / Tax ID</Label>
                                <Input id="tax_id" v-model="form.tax_id" placeholder="01.234.567.8-901.234" class="h-12 bg-secondary/50 border-0 focus-visible:ring-primary/20 rounded-xl" />
                                <span v-if="form.errors.tax_id" class="text-sm text-destructive">{{ form.errors.tax_id }}</span>
                            </div>
                        </div>

                        <!-- Address -->
                        <div class="space-y-2 mt-2">
                            <Label for="company_address" class="font-medium text-foreground">Alamat Lengkap</Label>
                            <Textarea id="company_address" v-model="form.company_address" placeholder="Jl. Brawijaya Yogyakarta" rows="3" class="bg-secondary/50 border-0 focus-visible:ring-primary/20 rounded-xl resize-none" />
                            <span v-if="form.errors.company_address" class="text-sm text-destructive">{{ form.errors.company_address }}</span>
                        </div>

                        <!-- Logo Upload -->
                        <div class="space-y-2 mt-4">
                            <Label class="font-medium text-foreground">Logo Perusahaan</Label>
                            <div class="flex items-start gap-6 mt-2">
                                <div class="relative group">
                                    <div 
                                        class="h-24 w-24 rounded-[20px] border-2 border-dashed flex items-center justify-center overflow-hidden bg-muted/50"
                                        :class="{'border-primary bg-primary/5': logoPreview}"
                                    >
                                        <img v-if="logoPreview" :src="logoPreview" alt="Logo" class="h-full w-full object-cover" />
                                        <Building2 v-else class="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                    <button 
                                        v-if="logoPreview" 
                                        type="button" 
                                        @click="removeLogo"
                                        class="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-sm hover:bg-destructive/90 transition-colors"
                                    >
                                        <X class="h-3 w-3" />
                                    </button>
                                </div>
                                <div class="space-y-3">
                                    <input 
                                        type="file" 
                                        ref="fileInput" 
                                        class="hidden" 
                                        accept="image/jpeg,image/png,image/jpg" 
                                        @change="handleFileChange"
                                    />
                                    <Button type="button" variant="outline" size="sm" @click="triggerFileInput" class="gap-2 rounded-xl text-primary bg-primary/5 border-primary/20 hover:bg-primary/10">
                                        <UploadCloud class="h-4 w-4" />
                                        Pilih Logo
                                    </Button>
                                    <p class="text-[13px] text-muted-foreground leading-relaxed max-w-sm">
                                        Rekomendasi: 200x200px, Max 2MB (PNG, JPG).<br>
                                        Logo akan ditampilkan di invoice dan PDF yang Anda cetak.
                                    </p>
                                    <span v-if="form.errors.logo" class="text-sm text-destructive block mt-1">{{ form.errors.logo }}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- NEW CARD: Pengaturan Pembayaran -->
                <div class="card border-0 bg-card rounded-[24px] shadow-card overflow-hidden">
                    <div class="border-b border-border/40 bg-muted/10 px-8 py-6">
                        <h2 class="text-xl font-bold flex items-center gap-2">
                            <Save class="h-5 w-5 text-muted-foreground" />
                            Informasi Pembayaran & Tagihan
                        </h2>
                    </div>

                    <div class="space-y-6 p-6 lg:p-8">
                        <div class="grid gap-6 sm:grid-cols-2">
                            <div class="space-y-2">
                                <Label for="bank_name" class="font-medium text-foreground">Nama Bank</Label>
                                <Input id="bank_name" v-model="form.bank_name" placeholder="Misal: BCA" class="h-12 bg-secondary/50 border-0 focus-visible:ring-primary/20 rounded-xl" />
                                <span v-if="form.errors.bank_name" class="text-sm text-destructive">{{ form.errors.bank_name }}</span>
                            </div>

                            <div class="space-y-2">
                                <Label for="bank_account_number" class="font-medium text-foreground">Nomor Rekening</Label>
                                <Input id="bank_account_number" v-model="form.bank_account_number" placeholder="1234567890" class="h-12 bg-secondary/50 border-0 focus-visible:ring-primary/20 rounded-xl" />
                                <span v-if="form.errors.bank_account_number" class="text-sm text-destructive">{{ form.errors.bank_account_number }}</span>
                            </div>

                            <div class="space-y-2 sm:col-span-2">
                                <Label for="bank_account_name" class="font-medium text-foreground">Atas Nama (Pemilik Rekening)</Label>
                                <Input id="bank_account_name" v-model="form.bank_account_name" placeholder="PT Solusi Desain" class="h-12 bg-secondary/50 border-0 focus-visible:ring-primary/20 rounded-xl" />
                                <span v-if="form.errors.bank_account_name" class="text-sm text-destructive">{{ form.errors.bank_account_name }}</span>
                            </div>
                        </div>

                        <div class="space-y-2 mt-2">
                            <Label for="default_invoice_notes" class="font-medium text-foreground">Catatan Tambahan Default</Label>
                            <p class="text-[13px] text-muted-foreground mb-2">Akan otomatis disertakan pada setiap invoice baru.</p>
                            <Textarea id="default_invoice_notes" v-model="form.default_invoice_notes" placeholder="Terima kasih atas kerja sama Anda." rows="4" class="bg-secondary/50 border-0 focus-visible:ring-primary/20 rounded-xl resize-none" />
                            <span v-if="form.errors.default_invoice_notes" class="text-sm text-destructive">{{ form.errors.default_invoice_notes }}</span>
                        </div>
                    </div>
                </div>

                <!-- Submit Button Container -->
                <div class="flex justify-end pt-4 pb-12">
                    <Button type="submit" size="lg" :disabled="form.processing" class="gap-2 rounded-xl text-base px-8 h-12 shadow-[0_4px_14px_0_hsl(var(--primary)/15%)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] transition-all">
                        <Save class="h-5 w-5" />
                        {{ form.processing ? 'Menyimpan...' : 'Simpan Perubahan' }}
                    </Button>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
