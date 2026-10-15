export type TransactionType = 'income' | 'expense'

export type TypeFilter = 'all' | TransactionType

export interface Transaction {
  id: number
  type: TransactionType
  amount: number
  category: string
  date: string
  note: string | null
}

export interface TransactionFilters {
  query: string
  type: TypeFilter
  dateFrom: string
  dateTo: string
}
