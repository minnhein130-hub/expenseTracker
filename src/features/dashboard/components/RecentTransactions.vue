<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue'

import type { Transaction } from '@/features/transactions/types/transaction.types'

defineProps<{
  transactions: Transaction[]
}>()
</script>

<template>
  <BaseCard class="p-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-slate-900">Recent Transactions</h2>

      <RouterLink
        to="/"
        class="text-sm font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        All
      </RouterLink>
    </div>

    <ul v-if="transactions.length > 0" class="mt-4">
      <li
        v-for="transaction in transactions"
        :key="transaction.id"
        class="flex items-center justify-between gap-3 border-b border-slate-100 py-3 last:border-0"
      >
        <div class="min-w-0">
          <p class="truncate text-sm font-medium text-slate-900">
            {{ transaction.category }}
          </p>

          <p class="mt-0.5 text-xs text-slate-500">
            {{ transaction.date }}
          </p>
        </div>

        <div class="flex items-center gap-3">
          <span
            class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
            :class="
              transaction.type === 'income'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-rose-100 text-rose-700'
            "
          >
            {{ transaction.type === 'income' ? 'Income' : 'Expense' }}
          </span>

          <span
            class="text-sm font-semibold"
            :class="transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'"
          >
            {{ transaction.type === 'income' ? '+' : '-' }}{{ transaction.amount.toFixed(2) }}
          </span>
        </div>
      </li>
    </ul>

    <p
      v-else
      class="mt-4 rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500"
    >
      No transactions yet.
    </p>
  </BaseCard>
</template>
