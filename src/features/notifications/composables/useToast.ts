import { ref } from 'vue'

import type { Toast, ToastType } from '@/features/notifications/types/toast.types'

const toasts = ref<Toast[]>([])

const TOAST_DURATION_MS = 3000

let nextId = 1

function dismissToast(id: number): void {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}

function showToast(type: ToastType, message: string): number {
  const id = nextId++

  toasts.value.push({ id, type, message })

  window.setTimeout(() => {
    dismissToast(id)
  }, TOAST_DURATION_MS)

  return id
}

export function useToast() {
  return {
    toasts,
    success: (message: string) => showToast('success', message),
    error: (message: string) => showToast('error', message),
    dismiss: dismissToast,
  }
}
