<script setup lang="ts">
import { useToast } from '@/composables/useToast';
import { CheckCircle, XCircle, X, Info, AlertTriangle } from 'lucide-vue-next';

const { toasts, removeToast } = useToast();
</script>

<template>
  <div aria-live="assertive" class="pointer-events-none fixed inset-0 flex items-start px-4 py-6 sm:p-6 z-[100]">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <transition-group
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-for="toast in toasts" :key="toast.id" class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
          <div class="p-4">
            <div class="flex items-start">
              <div class="shrink-0">
                <CheckCircle v-if="toast.type === 'success'" class="size-6 text-green-500" aria-hidden="true" />
                <XCircle v-else-if="toast.type === 'error'" class="size-6 text-red-500" aria-hidden="true" />
                <AlertTriangle v-else-if="toast.type === 'warning'" class="size-6 text-yellow-500" aria-hidden="true" />
                <Info v-else class="size-6 text-blue-500" aria-hidden="true" />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ toast.title }}</p>
                <p v-if="toast.description" class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ toast.description }}</p>
              </div>
              <div class="ml-4 flex shrink-0">
                <button type="button" @click="removeToast(toast.id)" class="inline-flex rounded-md bg-white dark:bg-zinc-900 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  <span class="sr-only">Tutup</span>
                  <X class="size-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>
