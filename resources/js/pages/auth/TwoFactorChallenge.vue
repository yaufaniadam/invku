<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import AuthLayout from '@/layouts/AuthLayout.vue';
import type { TwoFactorConfigContent } from '@/types';
import { store } from '@/routes/two-factor/login';

const authConfigContent = computed<TwoFactorConfigContent>(() => {
    if (showRecoveryInput.value) {
        return {
            title: 'Recovery Code',
            description:
                'Please confirm access to your account by entering one of your emergency recovery codes.',
            buttonText: 'login using an authentication code',
        };
    }

    return {
        title: 'Authentication Code',
        description:
            'Enter the authentication code provided by your authenticator application.',
        buttonText: 'login using a recovery code',
    };
});

const showRecoveryInput = ref<boolean>(false);

const toggleRecoveryMode = (clearErrors: () => void): void => {
    showRecoveryInput.value = !showRecoveryInput.value;
    clearErrors();
    code.value = '';
};

const code = ref<string>('');
</script>

<template>
    <AuthLayout
        :title="authConfigContent.title"
        :description="authConfigContent.description"
    >
        <Head title="Two-Factor Authentication" />

        <div class="space-y-6">
            <template v-if="!showRecoveryInput">
                <Form
                    v-bind="store.form()"
                    class="space-y-6"
                    reset-on-error
                    @error="code = ''"
                    #default="{ errors, processing, clearErrors }"
                >
                    <input type="hidden" name="code" :value="code" />
                    <div
                        class="flex flex-col items-center justify-center space-y-4 text-center"
                    >
                        <div class="flex w-full items-center justify-center bg-secondary/20 p-8 rounded-2xl border border-dashed border-primary/20">
                            <InputOTP
                                id="otp"
                                v-model="code"
                                :maxlength="6"
                                :disabled="processing"
                                autofocus
                            >
                                <InputOTPGroup class="gap-2">
                                    <InputOTPSlot
                                        v-for="index in 6"
                                        :key="index"
                                        :index="index - 1"
                                        class="rounded-xl border-primary/20 size-12 text-lg font-bold"
                                    />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                        <InputError :message="errors.code" />
                    </div>
                    <Button type="submit" class="w-full h-12 text-base font-bold shadow-lg shadow-primary/20" :disabled="processing">
                        Verify Code
                    </Button>
                    <div class="text-center text-sm text-muted-foreground pt-2">
                        <span>Trouble with the app? </span>
                        <button
                            type="button"
                            class="font-bold text-primary hover:underline underline-offset-4"
                            @click="() => toggleRecoveryMode(clearErrors)"
                        >
                            {{ authConfigContent.buttonText }}
                        </button>
                    </div>
                </Form>
            </template>

            <template v-else>
                <Form
                    v-bind="store.form()"
                    class="space-y-6"
                    reset-on-error
                    #default="{ errors, processing, clearErrors }"
                >
                    <div class="space-y-2">
                        <Label class="text-sm font-medium">Recovery Code</Label>
                        <Input
                            name="recovery_code"
                            type="text"
                            placeholder="Enter one of your recovery codes"
                            :autofocus="showRecoveryInput"
                            required
                            class="h-12"
                        />
                        <InputError :message="errors.recovery_code" />
                    </div>
                    
                    <Button type="submit" class="w-full h-12 text-base font-bold shadow-lg shadow-primary/20" :disabled="processing">
                        Verify Recovery Code
                    </Button>

                    <div class="text-center text-sm text-muted-foreground pt-2">
                        <span>Found your device? </span>
                        <button
                            type="button"
                            class="font-bold text-primary hover:underline underline-offset-4"
                            @click="() => toggleRecoveryMode(clearErrors)"
                        >
                            {{ authConfigContent.buttonText }}
                        </button>
                    </div>
                </Form>
            </template>
        </div>
    </AuthLayout>
</template>
