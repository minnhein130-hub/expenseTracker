<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'

import AddTransactionModal from '@/features/transactions/components/AddTransactionModal.vue'

import DashboardStats from '@/features/dashboard/components/DashboardStats.vue'
import CategoryBreakdown from '@/features/dashboard/components/CategoryBreakdown.vue'
import RecentTransactions from '@/features/dashboard/components/RecentTransactions.vue'

import { useTransactions } from '@/features/transactions/composables/useTransactions'
import { useDashboard } from '@/features/dashboard/composables/useDashboard'

import type { Transaction } from '@/features/transactions/types/transaction.types'

const { transactions } = useTransactions()

const { stats, expenseByCategory, incomeByCategory, recentTransactions } = useDashboard()

const isAddModalOpen = ref(false)

function handleAdd(transaction: Transaction) {
  transactions.value.push(transaction)
}
</script>

<template>
  <div>
    <!-- Dashboard Header -->
    <header class="border-b border-slate-200 bg-white">
      <div
        class="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-5 lg:px-8"
      >
        <div>
          <h1 class="text-xl font-semibold text-slate-900">Dashboard</h1>

          <p class="mt-0.5 text-sm text-slate-500">
            {{ transactions.length }}
            {{ transactions.length === 1 ? 'transaction' : 'transactions' }}
            tracked
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

    <!-- Dashboard Content -->
    <section class="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 lg:px-8">
      <!-- Summary Statistics -->
      <DashboardStats :stats="stats" />

      <!-- Category Breakdown -->
      <div class="grid items-start gap-4 lg:grid-cols-2">
        <CategoryBreakdown
          title="Expense by Category"
          :categories="expenseByCategory"
          bar-color="bg-rose-600"
          empty-message="No expenses yet."
        />

        <CategoryBreakdown
          title="Income by Category"
          :categories="incomeByCategory"
          bar-color="bg-emerald-600"
          empty-message="No income yet."
        />
      </div>

      <!-- Recent Transactions -->
      <RecentTransactions :transactions="recentTransactions" />
    </section>

    <!-- Add Transaction Modal -->
    <AddTransactionModal
      :open="isAddModalOpen"
      @close="isAddModalOpen = false"
      @submit="handleAdd"
    />
  </div>
</template>
