<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import TransactionForm from '@/features/transactions/components/TransactionForm.vue'
import TransactionList from '@/features/transactions/components/TransactionList.vue'
import type { Transaction } from '@/features/transactions/types/transaction.types'

const transactions = ref<Transaction[]>([])
const editingTransaction = ref<Transaction | null>(null)

const currentPage = ref(1)
const pageSize = ref(5)
const selectedIds = ref<number[]>([])

const totalPages = computed(() =>
  Math.max(1, Math.ceil(transactions.value.length / pageSize.value)),
)

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return transactions.value.slice(start, start + pageSize.value)
})

watch(
  () => transactions.value.length,
  () => {
    const maxPage = Math.max(1, Math.ceil(transactions.value.length / pageSize.value))
    if (currentPage.value > maxPage) {
      currentPage.value = maxPage
    }
  },
)

function handleSubmit(transaction: Transaction) {
  transactions.value.push(transaction)
}

function handleEdit(transaction: Transaction) {
  editingTransaction.value = transaction
}

function handleCancel() {
  editingTransaction.value = null
}

function handleUpdate(updatedTransaction: Transaction) {
  const index = transactions.value.findIndex((item) => item.id === updatedTransaction.id)

  if (index !== -1) {
    transactions.value[index] = updatedTransaction
  }

  editingTransaction.value = null
}

function handleDelete(id: number) {
  transactions.value = transactions.value.filter((item) => item.id !== id)
  selectedIds.value = selectedIds.value.filter((selectedId) => selectedId !== id)

  if (editingTransaction.value?.id === id) {
    editingTransaction.value = null
  }
}

function handleBulkDelete(ids: number[]) {
  const idsToDelete = new Set(ids)

  transactions.value = transactions.value.filter((item) => !idsToDelete.has(item.id))
  selectedIds.value = selectedIds.value.filter((selectedId) => !idsToDelete.has(selectedId))

  if (editingTransaction.value && idsToDelete.has(editingTransaction.value.id)) {
    editingTransaction.value = null
  }
}

function handleToggleSelect(id: number) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((selectedId) => selectedId !== id)
  } else {
    selectedIds.value = [...selectedIds.value, id]
  }
}

function handleToggleSelectAll() {
  const allSelected =
    transactions.value.length > 0 && selectedIds.value.length === transactions.value.length

  selectedIds.value = allSelected ? [] : transactions.value.map((item) => item.id)
}

function handleClearSelection() {
  selectedIds.value = []
}

function handlePageChange(page: number) {
  currentPage.value = page
}

function handlePageSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
}
</script>

<template>
  <section class="mx-auto w-full max-w-5xl px-4 py-10">
    <h1 class="text-2xl font-semibold text-slate-900">Expense Tracker</h1>
    <p class="mt-2 text-slate-600"></p>

    <div class="mt-6">
      <TransactionForm
        :transaction="editingTransaction"
        @submit="handleSubmit"
        @update="handleUpdate"
        @cancel="handleCancel"
      />
    </div>

    <div class="mt-6">
      <TransactionList
        :transactions="paginatedTransactions"
        :total-count="transactions.length"
        :selected-ids="selectedIds"
        :current-page="currentPage"
        :page-size="pageSize"
        :total-pages="totalPages"
        @edit="handleEdit"
        @delete="handleDelete"
        @bulk-delete="handleBulkDelete"
        @select-toggle="handleToggleSelect"
        @select-all-toggle="handleToggleSelectAll"
        @clear-selection="handleClearSelection"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>
  </section>
</template>
