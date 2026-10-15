import { z } from 'zod'

import type { TransactionType } from '@/features/transactions/types/transaction.types'

const transactionTypes = ['income', 'expense'] as const satisfies readonly TransactionType[]

export const transactionSchema = z.object({
  type: z.enum(transactionTypes),
  amount: z.coerce
    .number({ invalid_type_error: 'Amount must be a number' })
    .finite('Amount must be a finite number')
    .positive('Amount must be greater than zero'),
  category: z.string().trim().min(1, 'Category is required'),
  date: z.string().trim().min(1, 'Date is required'),
  note: z
    .string()
    .trim()
    .nullish()
    .transform((value) => value || null),
})

export type TransactionFormOutput = z.infer<typeof transactionSchema>
