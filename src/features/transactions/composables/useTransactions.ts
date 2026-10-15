import { ref } from 'vue'

import type { Transaction } from '@/features/transactions/types/transaction.types'

const transactions = ref<Transaction[]>([])

export function useTransactions() {
  return { transactions }
}
