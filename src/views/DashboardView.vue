<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'

import BaseButton from '@/components/BaseButton.vue'
import AddTransactionModal from '@/features/transactions/components/AddTransactionModal.vue'

import DashboardStats from '@/features/dashboard/components/DashboardStats.vue'
import CategoryBreakdown from '@/features/dashboard/components/CategoryBreakdown.vue'
import RecentTransactions from '@/features/dashboard/components/RecentTransactions.vue'

import { useToast } from '@/features/notifications/composables/useToast'
import { useTransactions } from '@/features/transactions/composables/useTransactions'
import { useDashboard } from '@/features/dashboard/composables/useDashboard'

import type { Transaction } from '@/features/transactions/types/transaction.types'

const { transactions } = useTransactions()
const toast = useToast()

const { stats, expenseByCategory, incomeByCategory, recentTransactions } = useDashboard()

const isAddModalOpen = ref(false)

function handleAdd(transaction: Transaction) {
  try {
    transactions.value.push(transaction)

    toast.success('Transaction added successfully!')
  } catch {
    toast.error('Failed to add transaction.')
  }
}
</script>

<template>
  <div>
    <!-- Dashboard Header -->
    <header class="sticky top-14 z-20 border-b border-slate-200 bg-white lg:top-0">
      <div
        class="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-6 lg:px-10"
      >
        <div>
          <h1 class="text-xl font-semibold text-slate-900">Dashboard</h1>

          <p class="mt-0.5 text-sm text-slate-500">
            {{ transactions.length }}
            {{ transactions.length === 1 ? 'transaction' : 'transactions' }}
            tracked
          </p>
        </div>

        <BaseButton
          variant="primary"
          class="flex items-center gap-1.5"
          @click="isAddModalOpen = true"
        >
          <Plus class="h-4 w-4" :stroke-width="2" />
          Add Transaction
        </BaseButton>
      </div>
    </header>

    <!-- Dashboard Content -->
    <section class="mx-auto w-full max-w-[1600px] space-y-12 px-5 py-10 sm:px-6 lg:px-10">
      <!-- Summary Statistics -->
      <DashboardStats :stats="stats" />

      <!-- Category Breakdown -->
      <div class="grid items-stretch gap-6 lg:grid-cols-2">
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
