<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { LayoutGrid, Users, FileText, CreditCard, Wallet, BarChart3, Settings } from 'lucide-vue-next';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import AppLogo from './AppLogo.vue';
import { dashboard } from '@/routes';

const mainNavItems: NavItem[] = [
    {
        title: 'Beranda',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Klien',
        href: '/clients',
        icon: Users,
    },
    {
        title: 'Invoice',
        href: '/invoices',
        icon: FileText,
    },
    {
        title: 'Pembayaran',
        href: '/payments',
        icon: CreditCard,
    },
    {
        title: 'Deposit',
        href: '/deposits',
        icon: Wallet,
    },
    {
        title: 'Laporan',
        href: '/reports',
        icon: BarChart3,
    },
    {
        title: 'Pengaturan',
        href: '/settings/company',
        icon: Settings,
    },
];

</script>

<template>
    <Sidebar collapsible="icon" variant="default" class="border-r-0 shadow-xl shadow-foreground/5">
        <SidebarHeader class="h-20 flex justify-center px-3">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child class="hover:bg-transparent">
                        <Link :href="dashboard()">
                            <AppLogo />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent class="px-0">
            <NavMain :items="mainNavItems" />
        </SidebarContent>

        <SidebarFooter class="px-3 py-4 border-t border-border/50">
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>

