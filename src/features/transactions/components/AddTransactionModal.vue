<script setup lang="ts">
import { X } from 'lucide-vue-next'

import TransactionForm from '@/features/transactions/components/TransactionForm.vue'
import type { Transaction } from '@/features/transactions/types/transaction.types'

const props = defineProps<{
  open: boolean
  transaction?: Transaction | null
}>()

const emit = defineEmits<{
  close: []
  submit: [transaction: Transaction]
  update: [transaction: Transaction]
}>()

function handleSubmit(transaction: Transaction) {
  emit('submit', transaction)
  emit('close')
}

function handleUpdate(transaction: Transaction) {
  emit('update', transaction)
  emit('close')
}
</script>

<template>
  <div
    v-if="props.open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="transaction-modal-title"
    @click.self="emit('close')"
  >
    <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
      <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <h2 id="transaction-modal-title" class="text-lg font-semibold text-slate-900">
          {{ props.transaction ? 'Edit transaction' : 'Add transaction' }}
        </h2>
        <button
          type="button"
          aria-label="Close"
          class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          @click="emit('close')"
        >
          <X class="h-5 w-5" :stroke-width="1.5" />
        </button>
      </div>

      <div class="px-6 py-5">
        <TransactionForm
          variant="modal"
          :transaction="props.transaction ?? null"
          @submit="handleSubmit"
          @update="handleUpdate"
          @cancel="emit('close')"
        />
      </div>
    </div>
  </div>
</template>
