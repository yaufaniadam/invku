<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next';
import { useAppearance } from '@/composables/useAppearance';

const { resolvedAppearance, updateAppearance } = useAppearance();

function toggle() {
    updateAppearance(resolvedAppearance.value === 'dark' ? 'light' : 'dark');
}
</script>

<template>
    <button
        @click="toggle"
        class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        :title="resolvedAppearance === 'dark' ? 'Mode Terang' : 'Mode Gelap'"
    >
        <Sun v-if="resolvedAppearance === 'dark'" class="h-4 w-4" />
        <Moon v-else class="h-4 w-4" />
    </button>
</template>
