import type { Transaction, TransactionType } from '@/features/transactions/types/transaction.types'

export type DashboardStats = {
  totalIncome: number
  totalExpense: number
  balance: number
  categoriesUsed: number
}

export type CategoryTotal = {
  category: string
  total: number
  share: number
}

export function computeDashboardStats(transactions: Transaction[]): DashboardStats {
  let totalIncome = 0
  let totalExpense = 0
  const categories = new Set<string>()

  for (const transaction of transactions) {
    if (transaction.type === 'income') {
      totalIncome += transaction.amount
    } else {
      totalExpense += transaction.amount
    }

    categories.add(transaction.category)
  }

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    categoriesUsed: categories.size,
  }
}

export function computeCategoryTotals(
  transactions: Transaction[],
  type: TransactionType,
): CategoryTotal[] {
  const totals = new Map<string, number>()
  let typeTotal = 0

  for (const transaction of transactions) {
    if (transaction.type !== type) {
      continue
    }

    totals.set(transaction.category, (totals.get(transaction.category) ?? 0) + transaction.amount)

    typeTotal += transaction.amount
  }

  return [...totals.entries()]
    .map(([category, total]) => ({
      category,
      total,
      share: typeTotal > 0 ? total / typeTotal : 0,
    }))
    .sort((a, b) => b.total - a.total)
}

export function computeRecentTransactions(transactions: Transaction[], limit = 5): Transaction[] {
  return [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    .slice(0, limit)
}
