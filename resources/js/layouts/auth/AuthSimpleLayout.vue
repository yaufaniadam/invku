<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { home } from '@/routes';

defineProps<{
    title?: string;
    description?: string;
}>();
</script>

<template>
    <div
        class="flex min-h-svh flex-col items-center justify-center bg-slate-50/50 p-6 md:p-10 dark:bg-background"
    >
        <div class="w-full max-w-[400px]">
            <!-- Logo area -->
            <div class="flex flex-col items-center mb-8">
                <Link
                    :href="home()"
                    class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 transition-all hover:scale-105"
                >
                    <AppLogoIcon class="size-6 fill-current text-primary-foreground" />
                </Link>
            </div>

            <!-- Card -->
            <div class="card border-0 bg-card p-8 shadow-card rounded-[24px] md:p-10">
                <div class="mb-8 space-y-2 text-center">
                    <h1 class="text-2xl font-bold tracking-tight text-foreground">{{ title }}</h1>
                    <p class="text-sm text-muted-foreground leading-relaxed">
                        {{ description }}
                    </p>
                </div>
                
                <slot />
            </div>

            <!-- Footer info -->
            <div class="mt-8 text-center text-xs text-muted-foreground">
                &copy; {{ new Date().getFullYear() }} Invku. All rights reserved.
            </div>
        </div>
    </div>
</template>
