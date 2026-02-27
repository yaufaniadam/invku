<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import Heading from '@/components/Heading.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { type BreadcrumbItem } from '@/types';
import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import { edit } from '@/routes/user-password';

const breadcrumbItems: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: edit().url,
    },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head title="Password settings" />

        <h1 class="sr-only">Password Settings</h1>

        <SettingsLayout>
            <div class="flex flex-col space-y-8">
                <div>
                    <h2 class="text-xl font-bold flex items-center gap-2">Perbarui Kata Sandi</h2>
                    <p class="text-sm text-muted-foreground mt-1 text-base">Pastikan akun Anda menggunakan kata sandi acak yang panjang untuk tetap aman.</p>
                </div>

                <div class="h-px w-full bg-border/40"></div>

                <Form
                    v-bind="PasswordController.update.form()"
                    :options="{
                        preserveScroll: true,
                    }"
                    reset-on-success
                    :reset-on-error="[
                        'password',
                        'password_confirmation',
                        'current_password',
                    ]"
                    class="space-y-6"
                    v-slot="{ errors, processing, recentlySuccessful }"
                >
                    <div class="grid gap-2">
                        <Label for="current_password" class="font-medium text-foreground">Kata Sandi Saat Ini</Label>
                        <Input
                            id="current_password"
                            name="current_password"
                            type="password"
                            class="h-11 bg-secondary/50 border-0 focus-visible:ring-primary/20 rounded-xl"
                            autocomplete="current-password"
                            placeholder="Kata sandi saat ini"
                        />
                        <InputError :message="errors.current_password" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="password" class="font-medium text-foreground">Kata Sandi Baru</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            class="h-11 bg-secondary/50 border-0 focus-visible:ring-primary/20 rounded-xl"
                            autocomplete="new-password"
                            placeholder="Kata sandi baru"
                        />
                        <InputError :message="errors.password" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="password_confirmation" class="font-medium text-foreground">Konfirmasi Kata Sandi</Label>
                        <Input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            class="h-11 bg-secondary/50 border-0 focus-visible:ring-primary/20 rounded-xl"
                            autocomplete="new-password"
                            placeholder="Konfirmasi kata sandi"
                        />
                        <InputError :message="errors.password_confirmation" />
                    </div>

                    <div class="flex items-center gap-4 pt-2">
                        <Button
                            :disabled="processing"
                            data-test="update-password-button"
                            class="rounded-xl px-6 h-11"
                            >Simpan Kata Sandi</Button
                        >

                        <Transition
                            enter-active-class="transition ease-in-out"
                            enter-from-class="opacity-0"
                            leave-active-class="transition ease-in-out"
                            leave-to-class="opacity-0"
                        >
                            <p
                                v-show="recentlySuccessful"
                                class="text-sm text-neutral-600"
                            >
                                Saved.
                            </p>
                        </Transition>
                    </div>
                </Form>
            </div>
        </SettingsLayout>
    </AppLayout>
</template>
