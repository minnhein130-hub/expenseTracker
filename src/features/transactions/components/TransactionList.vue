<script setup lang="ts">
import type { Transaction } from '@/types/transaction'

defineProps<{
  transactions: Transaction[]
}>()

const emit = defineEmits<{
  edit: [transaction: Transaction]
}>()
</script>

<template>
  <section>
    <h2 class="text-xl font-semibold text-slate-900">Transactions</h2>

    <p
      v-if="transactions.length === 0"
      class="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500"
    >
      No transactions yet. Submit the form above to add your first one.
    </p>

    <ul v-else class="mt-4 space-y-3">
      <li
        v-for="transaction in transactions"
        :key="transaction.id"
        class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
      >
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <span
              class="rounded-full px-2.5 py-0.5 text-xs font-medium"
              :class="
                transaction.type === 'income'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-100 text-rose-700'
              "
            >
              {{ transaction.type === 'income' ? 'Income' : 'Expense' }}
            </span>
            <span class="text-sm font-medium text-slate-900">{{ transaction.category }}</span>
          </div>

          <span
            class="text-lg font-semibold"
            :class="transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'"
          >
            {{ transaction.type === 'income' ? '+' : '-' }}{{ transaction.amount.toFixed(2) }}
          </span>
        </div>

        <div class="mt-2 flex flex-col gap-1 text-sm text-slate-600 sm:flex-row sm:gap-6">
          <span>Date: {{ transaction.date }}</span>
          <span>Note: {{ transaction.note ?? '—' }}</span>
        </div>

        <div class="mt-3 flex justify-end border-t border-slate-100 pt-3">
          <button
            type="button"
            class="rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @click="emit('edit', transaction)"
          >
            Edit
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>
