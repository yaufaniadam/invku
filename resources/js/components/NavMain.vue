<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { type NavItem } from '@/types';

defineProps<{
    items: NavItem[];
}>();

const { isCurrentUrl } = useCurrentUrl();
</script>

<template>
    <SidebarGroup class="px-3 py-4">
        <SidebarGroupLabel class="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">Platform</SidebarGroupLabel>
        <SidebarMenu class="space-y-1">
            <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton
                    as-child
                    :is-active="isCurrentUrl(item.href)"
                    :tooltip="item.title"
                    class="sidebar-menu-item h-11 w-full gap-3 px-3 rounded-xl transition-all duration-200"
                    :class="[
                        isCurrentUrl(item.href) 
                        ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20' 
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    ]"
                >
                    <Link :href="item.href" class="flex items-center w-full">
                        <component :is="item.icon" class="h-5 w-5 shrink-0" />
                        <span class="font-medium">{{ item.title }}</span>
                        <span v-if="isCurrentUrl(item.href)" class="ml-auto h-2 w-2 rounded-full bg-primary-foreground"></span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    </SidebarGroup>
</template>
