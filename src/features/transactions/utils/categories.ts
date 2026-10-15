import type { TransactionType } from '@/features/transactions/types/transaction.types'

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Health',
  'Shopping',
  'Travel',
  'Fitness',
  'Bills & Fees',
  'Other Expense',
] as const

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Other Income',
] as const

export function categoriesForType(type: TransactionType): readonly string[] {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}
