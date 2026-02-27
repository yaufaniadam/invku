<script setup lang="ts">
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem } from '@/types';

withDefaults(
    defineProps<{
        breadcrumbs?: BreadcrumbItem[];
    }>(),
    {
        breadcrumbs: () => [],
    },
);
</script>

<template>
    <header
        class="flex h-20 shrink-0 items-center justify-between border-b border-sidebar-border/50 bg-white dark:bg-slate-900 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-8"
    >
        <div class="flex items-center gap-4">
            <SidebarTrigger class="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
            
            <!-- Search -->
            <div class="relative hidden sm:block">
                <i class="lucide-search absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search h-4 w-4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </i>
                <input type="search" placeholder="Search anything..." class="h-10 w-64 rounded-full bg-secondary border-0 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none">
            </div>

            <template v-if="breadcrumbs && breadcrumbs.length > 0">
                <div class="h-4 w-[1px] bg-border mx-2 hidden md:block"></div>
                <Breadcrumbs :breadcrumbs="breadcrumbs" />
            </template>
        </div>

        <!-- Right Side Icons -->
        <div class="flex items-center gap-2">
            <button class="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-all relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell h-5 w-5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                <span class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
            </button>
        </div>
    </header>
</template>
