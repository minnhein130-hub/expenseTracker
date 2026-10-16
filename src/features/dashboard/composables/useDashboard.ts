import { computed } from 'vue'

import { useTransactions } from '@/features/transactions/composables/useTransactions'

// import {
//   computeCategoryTotals,
//   computeDashboardStats,
//   computeRecentTransactions,
// } from '@/features/transactions/utils/dashboardStats'

import {
  computeCategoryTotals,
  computeDashboardStats,
  computeRecentTransactions,
} from '@/features/dashboard/utils/dashboard.utils'

export function useDashboard() {
  // Get the shared transaction data.
  const { transactions } = useTransactions()

  // Calculate the Dashboard statistics.
  const stats = computed(() => computeDashboardStats(transactions.value))

  // Calculate expenses grouped by category.
  const expenseByCategory = computed(() => computeCategoryTotals(transactions.value, 'expense'))

  // Calculate income grouped by category.
  const incomeByCategory = computed(() => computeCategoryTotals(transactions.value, 'income'))

  // Get the most recent transactions.
  const recentTransactions = computed(() => computeRecentTransactions(transactions.value))

  return {
    stats,
    expenseByCategory,
    incomeByCategory,
    recentTransactions,
  }
}
