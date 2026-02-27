<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { toUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { edit as editAppearance } from '@/routes/appearance';
import { edit as editProfile } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: editProfile(),
    },
    {
        title: 'Password',
        href: editPassword(),
    },
    {
        title: 'Two-Factor Auth',
        href: show(),
    },
    {
        title: 'Appearance',
        href: editAppearance(),
    },
];

const { isCurrentUrl } = useCurrentUrl();
</script>

<template>
    <div class="flex h-full flex-col gap-8 p-6 md:p-8 text-foreground">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">Pengaturan Akun</h1>
            <p class="text-muted-foreground mt-1 text-base">Kelola profil, keamanan, dan pengaturan tampilan akun Anda.</p>
        </div>

        <div class="card border-0 bg-card shadow-card rounded-[24px] p-6 lg:p-8 flex flex-col md:flex-row gap-8">
            <aside class="w-full md:w-64 flex-shrink-0">
                <nav
                    class="flex flex-col space-y-2 max-w-sm"
                    aria-label="Settings"
                >
                    <Button
                        v-for="item in sidebarNavItems"
                        :key="toUrl(item.href)"
                        variant="ghost"
                        :class="[
                            'w-full justify-start rounded-xl h-11 px-4 font-medium transition-colors hover:bg-muted',
                            { 'bg-primary/10 text-primary hover:bg-primary/15': isCurrentUrl(item.href) },
                            { 'text-muted-foreground': !isCurrentUrl(item.href) }
                        ]"
                        as-child
                    >
                        <Link :href="item.href" class="flex items-center gap-3">
                            <span class="truncate">{{ item.title }}</span>
                        </Link>
                    </Button>
                </nav>
            </aside>

            <Separator class="my-6 block md:hidden" />

            <div class="flex-1 w-full max-w-2xl">
                <section class="space-y-12">
                    <slot />
                </section>
            </div>
        </div>
    </div>
</template>
