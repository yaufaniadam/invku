<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner"
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon, XIcon } from "lucide-vue-next"
import { Toaster as Sonner } from "vue-sonner"
import { cn } from "@/lib/utils"

const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner
    :class="cn('toaster group', props.class)"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',
    }"
    :toast-options="{
      unstyled: true,
      classes: {
        toast: 'pointer-events-auto flex w-full sm:w-[380px] rounded-xl bg-card p-4 shadow-xl border border-border right-0 mb-2',
        title: 'text-sm font-semibold text-foreground leading-tight',
        description: 'mt-1 text-sm text-muted-foreground leading-relaxed',
        actionButton: 'mt-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors',
        cancelButton: 'mt-2 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground shadow-sm hover:bg-secondary/80 transition-colors',
        icon: 'size-5 shrink-0 mt-0.5',
        success: 'text-success',
        error: 'text-destructive',
        warning: 'text-warning',
        info: 'text-info',
        content: 'ml-3 w-0 flex-1 flex flex-col',
        closeButton: 'ml-4 flex shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-secondary',
      },
    }"
    close-button
    rich-colors
    v-bind="props"
  >
    <template #success-icon>
      <CircleCheckIcon class="size-4" />
    </template>
    <template #info-icon>
      <InfoIcon class="size-4" />
    </template>
    <template #warning-icon>
      <TriangleAlertIcon class="size-4" />
    </template>
    <template #error-icon>
      <OctagonXIcon class="size-4" />
    </template>
    <template #loading-icon>
      <div>
        <Loader2Icon class="size-4 animate-spin" />
      </div>
    </template>
    <template #close-icon>
      <XIcon class="size-4" />
    </template>
  </Sonner>
</template>
