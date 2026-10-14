<script setup lang="ts">
import { ref } from 'vue'

import TransactionForm from '@/features/transactions/components/TransactionForm.vue'
import TransactionList from '@/features/transactions/components/TransactionList.vue'
import type { Transaction } from '@/types/transaction'

const transactions = ref<Transaction[]>([])
const editingTransaction = ref<Transaction | null>(null)

function handleSubmit(transaction: Transaction) {
  transactions.value.push(transaction)
}

function handleEdit(transaction: Transaction) {
  editingTransaction.value = transaction
}

function handleUpdate(updatedTransaction: Transaction) {
  const index = transactions.value.findIndex((item) => item.id === updatedTransaction.id)

  if (index !== -1) {
    transactions.value[index] = updatedTransaction
  }

  editingTransaction.value = null
}
</script>

<template>
  <section class="mx-auto w-full max-w-3xl px-4 py-10">
    <h1 class="text-2xl font-semibold text-slate-900">Expense Tracker</h1>
    <p class="mt-2 text-slate-600"></p>

    <div class="mt-6">
      <TransactionForm
        :transaction="editingTransaction"
        @submit="handleSubmit"
        @update="handleUpdate"
      />
    </div>

    <div class="mt-6">
      <TransactionList :transactions="transactions" @edit="handleEdit" />
    </div>
  </section>
</template>
