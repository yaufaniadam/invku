<script setup lang="ts">
import { Link, router } from '@inertiajs/vue3';
import { LogOut, Settings } from 'lucide-vue-next';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import UserInfo from '@/components/UserInfo.vue';
import type { User } from '@/types';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';

type Props = {
    user: User;
};

const handleLogout = () => {
    router.flushAll();
};

defineProps<Props>();
</script>

<template>
    <DropdownMenuLabel class="p-4 font-normal">
        <div class="flex items-center gap-3 text-left">
            <UserInfo :user="user" :show-email="true" />
        </div>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup class="p-1">
        <DropdownMenuItem :as-child="true" class="rounded-lg px-3 py-2 cursor-pointer hover:bg-secondary transition-colors">
            <Link class="flex items-center w-full" :href="edit()" prefetch>
                <Settings class="mr-3 h-4 w-4 text-muted-foreground" />
                <span class="font-medium">Settings</span>
            </Link>
        </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup class="p-1">
        <DropdownMenuItem :as-child="true" class="rounded-lg px-3 py-2 cursor-pointer hover:bg-destructive/10 text-destructive transition-colors">
            <Link
                class="flex items-center w-full"
                :href="logout()"
                @click="handleLogout"
                as="button"
                data-test="logout-button"
            >
                <LogOut class="mr-3 h-4 w-4" />
                <span class="font-medium">Log out</span>
            </Link>
        </DropdownMenuItem>
    </DropdownMenuGroup>
</template>
