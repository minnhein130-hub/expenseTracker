<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { Plus } from 'lucide-vue-next'

import AddTransactionModal from '@/features/transactions/components/AddTransactionModal.vue'
import TransactionFilters from '@/features/transactions/components/TransactionFilters.vue'
import TransactionList from '@/features/transactions/components/TransactionList.vue'
import { useTransactions } from '@/features/transactions/composables/useTransactions'
import { filterTransactions } from '@/features/transactions/utils/filterTransactions'
import type { Transaction, TypeFilter } from '@/features/transactions/types/transaction.types'

const { transactions } = useTransactions()
const editingTransaction = ref<Transaction | null>(null)
const isAddModalOpen = ref(false)

const currentPage = ref(1)
const pageSize = ref(5)
const selectedIds = ref<number[]>([])

const searchQuery = ref('')
const typeFilter = ref<TypeFilter>('all')
const dateFrom = ref('')
const dateTo = ref('')

const filters = computed(() => ({
  query: searchQuery.value,
  type: typeFilter.value,
  dateFrom: dateFrom.value,
  dateTo: dateTo.value,
}))

const filteredTransactions = computed(() => filterTransactions(transactions.value, filters.value))

const isFilterEmpty = computed(
  () => transactions.value.length > 0 && filteredTransactions.value.length === 0,
)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredTransactions.value.length / pageSize.value)),
)

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredTransactions.value.slice(start, start + pageSize.value)
})

watch(
  () => filteredTransactions.value.length,
  () => {
    const maxPage = Math.max(1, Math.ceil(filteredTransactions.value.length / pageSize.value))
    if (currentPage.value > maxPage) {
      currentPage.value = maxPage
    }
  },
)

watch([searchQuery, typeFilter, dateFrom, dateTo], () => {
  currentPage.value = 1
  selectedIds.value = []
})

watch(filteredTransactions, (list) => {
  const visibleIds = new Set(list.map((item) => item.id))
  selectedIds.value = selectedIds.value.filter((id) => visibleIds.has(id))
})

function handleClearFilters() {
  searchQuery.value = ''
  typeFilter.value = 'all'
  dateFrom.value = ''
  dateTo.value = ''
}

function handleSubmit(transaction: Transaction) {
  transactions.value.push(transaction)
}

function handleEdit(transaction: Transaction) {
  editingTransaction.value = transaction
  isAddModalOpen.value = true
}

function closeModal() {
  isAddModalOpen.value = false
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
    filteredTransactions.value.length > 0 &&
    selectedIds.value.length === filteredTransactions.value.length

  selectedIds.value = allSelected ? [] : filteredTransactions.value.map((item) => item.id)
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
  <div>
    <header class="border-b border-slate-200 bg-white">
      <div
        class="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-5 lg:px-8"
      >
        <div>
          <h1 class="text-xl font-semibold text-slate-900">Transactions</h1>
          <p class="mt-0.5 text-sm text-slate-500">
            {{ filteredTransactions.length }} of {{ transactions.length }} entries
          </p>
        </div>
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          @click="isAddModalOpen = true"
        >
          <Plus class="h-4 w-4" :stroke-width="2" />
          Add Transaction
        </button>
      </div>
    </header>

    <section class="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8">
      <TransactionFilters
        v-model:query="searchQuery"
        v-model:type="typeFilter"
        v-model:dateFrom="dateFrom"
        v-model:dateTo="dateTo"
        @clear="handleClearFilters"
      />

      <div class="mt-6">
        <TransactionList
          :transactions="paginatedTransactions"
          :total-count="filteredTransactions.length"
          :is-filter-empty="isFilterEmpty"
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

    <AddTransactionModal
      :open="isAddModalOpen"
      :transaction="editingTransaction"
      @close="closeModal"
      @submit="handleSubmit"
      @update="handleUpdate"
    />
  </div>
</template>
