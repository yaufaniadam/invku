<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue';
</script>

<template>
    <div
        class="flex aspect-square size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200"
    >
        <AppLogoIcon class="size-5 fill-current text-white" />
    </div>
    <div class="ml-3 grid flex-1 text-left">
        <span class="truncate leading-tight font-bold text-lg text-foreground tracking-tight"
            >Invku</span
        >
        <span class="truncate text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5">SaaS Billing</span>
    </div>
</template>
