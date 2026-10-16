<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'

import AddTransactionModal from '@/features/transactions/components/AddTransactionModal.vue'

import { useTransactions } from '@/features/transactions/composables/useTransactions'
import { useDashboard } from '@/features/dashboard/composables/useDashboard'

import type { Transaction } from '@/features/transactions/types/transaction.types'

const { transactions } = useTransactions()

const { stats, expenseByCategory, incomeByCategory, recentTransactions } = useDashboard()

const isAddModalOpen = ref(false)

function handleAdd(transaction: Transaction) {
  transactions.value.push(transaction)
}

function percent(share: number): string {
  return `${(share * 100).toFixed(1)}%`
}
</script>

<template>
  <div>
    <header class="border-b border-slate-200 bg-white">
      <div
        class="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-5 lg:px-8"
      >
        <div>
          <h1 class="text-xl font-semibold text-slate-900">Dashboard</h1>
          <p class="mt-0.5 text-sm text-slate-500">
            {{ transactions.length }}
            {{ transactions.length === 1 ? 'transaction' : 'transactions' }} tracked
          </p>
        </div>
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          @click="isAddModalOpen = true"
        >
          <Plus class="h-4 w-4" :stroke-width="2" />
          Add Transaction
        </button>
      </div>
    </header>

    <section class="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 lg:px-8">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Balance</p>
          <p class="mt-2 text-2xl font-semibold text-slate-900">{{ stats.balance.toFixed(2) }}</p>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Total Income</p>
          <p class="mt-2 text-2xl font-semibold text-emerald-600">
            {{ stats.totalIncome.toFixed(2) }}
          </p>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Total Expense</p>
          <p class="mt-2 text-2xl font-semibold text-rose-600">
            {{ stats.totalExpense.toFixed(2) }}
          </p>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Categories Used</p>
          <p class="mt-2 text-2xl font-semibold text-slate-900">{{ stats.categoriesUsed }}</p>
        </div>
      </div>

      <div class="grid items-start gap-4 lg:grid-cols-2">
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-slate-900">Expense by Category</h2>

          <div v-if="expenseByCategory.length > 0" class="mt-4 space-y-4">
            <div v-for="entry in expenseByCategory" :key="entry.category">
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-slate-700">{{ entry.category }}</span>
                <span class="font-semibold text-slate-900">{{ entry.total.toFixed(2) }}</span>
              </div>
              <div class="mt-1.5 flex items-center gap-2">
                <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    class="h-full rounded-full bg-rose-600"
                    :style="{ width: percent(entry.share) }"
                  ></div>
                </div>
                <span class="w-14 text-right text-xs tabular-nums text-slate-500">
                  {{ percent(entry.share) }}
                </span>
              </div>
            </div>
          </div>
          <p
            v-else
            class="mt-4 rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500"
          >
            No expenses yet.
          </p>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-slate-900">Income by Category</h2>

          <div v-if="incomeByCategory.length > 0" class="mt-4 space-y-4">
            <div v-for="entry in incomeByCategory" :key="entry.category">
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-slate-700">{{ entry.category }}</span>
                <span class="font-semibold text-slate-900">{{ entry.total.toFixed(2) }}</span>
              </div>
              <div class="mt-1.5 flex items-center gap-2">
                <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    class="h-full rounded-full bg-emerald-600"
                    :style="{ width: percent(entry.share) }"
                  ></div>
                </div>
                <span class="w-14 text-right text-xs tabular-nums text-slate-500">
                  {{ percent(entry.share) }}
                </span>
              </div>
            </div>
          </div>
          <p
            v-else
            class="mt-4 rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500"
          >
            No income yet.
          </p>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-slate-900">Recent Transactions</h2>
          <RouterLink
            to="/"
            class="text-sm font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            All
          </RouterLink>
        </div>

        <ul v-if="recentTransactions.length > 0" class="mt-4">
          <li
            v-for="transaction in recentTransactions"
            :key="transaction.id"
            class="flex items-center justify-between gap-3 border-b border-slate-100 py-3 last:border-0"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-slate-900">
                {{ transaction.category }}
              </p>
              <p class="mt-0.5 text-xs text-slate-500">{{ transaction.date }}</p>
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
      </div>
    </section>

    <AddTransactionModal
      :open="isAddModalOpen"
      @close="isAddModalOpen = false"
      @submit="handleAdd"
    />
  </div>
</template>
