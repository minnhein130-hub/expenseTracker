<script setup lang="ts">
import { CircleAlert, CircleCheck, X } from 'lucide-vue-next'

import { useToast } from '@/features/notifications/composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div
    class="pointer-events-none fixed top-4 right-4 z-[60] w-[calc(100%_-_2rem)] max-w-sm sm:top-6 sm:right-6"
    role="region"
    aria-label="Notifications"
  >
    <TransitionGroup name="toast" tag="div" class="flex flex-col gap-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-start gap-3 rounded-xl border bg-white p-4 shadow-sm"
        :class="toast.type === 'success' ? 'border-emerald-200' : 'border-rose-200'"
        role="status"
        aria-live="polite"
      >
        <CircleCheck
          v-if="toast.type === 'success'"
          class="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
          :stroke-width="2"
        />
        <CircleAlert
          v-else
          class="mt-0.5 h-5 w-5 shrink-0 text-rose-600"
          :stroke-width="2"
        />

        <p class="flex-1 text-sm font-medium text-slate-900">{{ toast.message }}</p>

        <button
          type="button"
          aria-label="Dismiss notification"
          class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          @click="dismiss(toast.id)"
        >
          <X class="h-4 w-4" :stroke-width="1.75" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}
</style>
