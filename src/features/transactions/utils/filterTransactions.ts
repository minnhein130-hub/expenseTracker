import type {
  Transaction,
  TransactionFilters,
} from '@/features/transactions/types/transaction.types'

export function filterTransactions(
  transactions: Transaction[],
  filters: TransactionFilters,
): Transaction[] {
  const query = filters.query.trim().toLowerCase()

  return transactions.filter((transaction) => {
    if (query) {
      const matchesCategory = transaction.category.toLowerCase().includes(query)
      const matchesNote = (transaction.note ?? '').toLowerCase().includes(query)
      if (!matchesCategory && !matchesNote) {
        return false
      }
    }

    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false
    }

    if (filters.dateFrom && transaction.date < filters.dateFrom) {
      return false
    }

    if (filters.dateTo && transaction.date > filters.dateTo) {
      return false
    }

    return true
  })
}
