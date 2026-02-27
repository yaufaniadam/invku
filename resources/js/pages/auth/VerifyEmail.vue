<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

defineProps<{
    status?: string;
}>();
</script>

<template>
    <AuthLayout
        title="Verify email"
        description="Please verify your email address by clicking on the link we just emailed to you."
    >
        <Head title="Email verification" />

        <div
            v-if="status === 'verification-link-sent'"
            class="mb-4 text-center text-sm font-medium text-green-600"
        >
            A new verification link has been sent to the email address you
            provided during registration.
        </div>

        <Form
            v-bind="send.form()"
            class="space-y-6 text-center"
            v-slot="{ processing }"
        >
            <Button :disabled="processing" class="w-full h-12 shadow-lg shadow-primary/20 font-bold">
                <Spinner v-if="processing" />
                Resend Verification Email
            </Button>

            <div class="flex flex-col items-center gap-4 pt-4 border-t border-border/50">
                <p class="text-xs text-muted-foreground italic">Wrong email address or signed up by mistake?</p>
                <TextLink
                    :href="logout()"
                    as="button"
                    class="font-bold text-primary hover:underline underline-offset-4"
                >
                    Sign out
                </TextLink>
            </div>
        </Form>
    </AuthLayout>
</template>
