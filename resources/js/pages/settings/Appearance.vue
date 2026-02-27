<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import AppearanceTabs from '@/components/AppearanceTabs.vue';
import Heading from '@/components/Heading.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { type BreadcrumbItem } from '@/types';
import { edit } from '@/routes/appearance';

const breadcrumbItems: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: edit().url,
    },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head title="Appearance settings" />

        <h1 class="sr-only">Appearance Settings</h1>

        <SettingsLayout>
            <div class="flex flex-col space-y-8">
                <div>
                    <h2 class="text-xl font-bold flex items-center gap-2">Tampilan Antarmuka</h2>
                    <p class="text-sm text-muted-foreground mt-1 text-base">Sesuaikan tampilan tema aplikasi sesuai preferensi Anda.</p>
                </div>

                <div class="h-px w-full bg-border/40"></div>
                <AppearanceTabs />
            </div>
        </SettingsLayout>
    </AppLayout>
</template>
