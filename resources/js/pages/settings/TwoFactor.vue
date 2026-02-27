<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import { ShieldBan, ShieldCheck } from 'lucide-vue-next';
import { onUnmounted, ref } from 'vue';
import Heading from '@/components/Heading.vue';
import TwoFactorRecoveryCodes from '@/components/TwoFactorRecoveryCodes.vue';
import TwoFactorSetupModal from '@/components/TwoFactorSetupModal.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/composables/useTwoFactorAuth';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import type { BreadcrumbItem } from '@/types';
import { disable, enable, show } from '@/routes/two-factor';

type Props = {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

withDefaults(defineProps<Props>(), {
    requiresConfirmation: false,
    twoFactorEnabled: false,
});

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Two-Factor Authentication',
        href: show.url(),
    },
];

const { hasSetupData, clearTwoFactorAuthData } = useTwoFactorAuth();
const showSetupModal = ref<boolean>(false);

onUnmounted(() => {
    clearTwoFactorAuthData();
});
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Two-Factor Authentication" />

        <h1 class="sr-only">Two-Factor Authentication Settings</h1>

        <SettingsLayout>
            <div class="flex flex-col space-y-8">
                <div>
                    <h2 class="text-xl font-bold flex items-center gap-2">Autentikasi Dua Faktor</h2>
                    <p class="text-sm text-muted-foreground mt-1 text-base">Kelola pengaturan autentikasi dua faktor Anda.</p>
                </div>

                <div class="h-px w-full bg-border/40"></div>

                <div
                    v-if="!twoFactorEnabled"
                    class="flex flex-col items-start justify-start space-y-4"
                >
                    <Badge variant="destructive">Disabled</Badge>

                    <p class="text-muted-foreground mt-2 leading-relaxed">
                        Jika Anda mengaktifkan autentikasi dua faktor, Anda akan diminta untuk memasukkan pin acak yang aman selama proses masuk. Anda bisa mendapatkan pin dari aplikasi yang mendukung TOTP di telepon seluler Anda.
                    </p>

                    <div>
                        <Button
                            v-if="hasSetupData"
                            @click="showSetupModal = true"
                            class="rounded-xl px-6 h-11"
                        >
                            <ShieldCheck class="mr-2 h-4 w-4" />Lanjutkan Pengaturan
                        </Button>
                        <Form
                            v-else
                            v-bind="enable.form()"
                            @success="showSetupModal = true"
                            #default="{ processing }"
                        >
                            <Button type="submit" :disabled="processing" class="rounded-xl px-6 h-11">
                                <ShieldCheck class="mr-2 h-4 w-4" />Aktifkan 2FA</Button
                            ></Form
                        >
                    </div>
                </div>

                <div
                    v-else
                    class="flex flex-col items-start justify-start space-y-4"
                >
                    <Badge variant="default">Enabled</Badge>

                    <p class="text-muted-foreground mt-2 leading-relaxed">
                        Saat autentikasi dua faktor diaktifkan, Anda akan diminta memasukkan token acak saat masuk. Anda mungkin mendapatkan token ini dari aplikasi pembuat kode verifikasi seluler Anda.
                    </p>

                    <TwoFactorRecoveryCodes />

                    <div class="relative inline">
                        <Form v-bind="disable.form()" #default="{ processing }">
                            <Button
                                variant="destructive"
                                type="submit"
                                :disabled="processing"
                                class="rounded-xl px-6 h-11"
                            >
                                <ShieldBan class="mr-2 h-4 w-4" />
                                Nonaktifkan 2FA
                            </Button>
                        </Form>
                    </div>
                </div>

                <TwoFactorSetupModal
                    v-model:isOpen="showSetupModal"
                    :requiresConfirmation="requiresConfirmation"
                    :twoFactorEnabled="twoFactorEnabled"
                />
            </div>
        </SettingsLayout>
    </AppLayout>
</template>
