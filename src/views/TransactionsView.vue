<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { Plus } from 'lucide-vue-next'

import BaseButton from '@/components/BaseButton.vue'
import AddTransactionModal from '@/features/transactions/components/AddTransactionModal.vue'
import TransactionFilters from '@/features/transactions/components/TransactionFilters.vue'
import TransactionList from '@/features/transactions/components/TransactionList.vue'

import { useDebounce } from '@/composables/useDebounce'
import { useToast } from '@/features/notifications/composables/useToast'
import { useTransactions } from '@/features/transactions/composables/useTransactions'
import { filterTransactions } from '@/features/transactions/utils/filterTransactions'

import type { Transaction, TypeFilter } from '@/features/transactions/types/transaction.types'

const { transactions } = useTransactions()
const toast = useToast()

const editingTransaction = ref<Transaction | null>(null)
const isAddModalOpen = ref(false)

const currentPage = ref(1)
const pageSize = ref(5)
const selectedIds = ref<number[]>([])

const searchQuery = ref('')
const typeFilter = ref<TypeFilter>('all')
const dateFrom = ref('')
const dateTo = ref('')

const appliedSearchQuery = useDebounce(searchQuery, 1000)

const filters = computed(() => ({
  query: appliedSearchQuery.value,
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

watch([typeFilter, dateFrom, dateTo], () => {
  currentPage.value = 1
  selectedIds.value = []
})

watch(appliedSearchQuery, () => {
  currentPage.value = 1
  selectedIds.value = []
})

watch(filteredTransactions, (list) => {
  const visibleIds = new Set(list.map((item) => item.id))

  selectedIds.value = selectedIds.value.filter((id) => visibleIds.has(id))
})

function handleClearFilters() {
  searchQuery.value = ''
  appliedSearchQuery.value = ''
  typeFilter.value = 'all'
  dateFrom.value = ''
  dateTo.value = ''
}

function handleSubmit(transaction: Transaction) {
  try {
    transactions.value.push(transaction)

    toast.success('Transaction added successfully!')
  } catch {
    toast.error('Failed to add transaction.')
  }
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
  try {
    const index = transactions.value.findIndex((item) => item.id === updatedTransaction.id)

    if (index === -1) {
      toast.error('Failed to update transaction.')
      return
    }

    transactions.value[index] = updatedTransaction
    editingTransaction.value = null

    toast.success('Transaction updated successfully!')
  } catch {
    toast.error('Failed to update transaction.')
  }
}

function handleDelete(id: number) {
  try {
    transactions.value = transactions.value.filter((item) => item.id !== id)

    selectedIds.value = selectedIds.value.filter((selectedId) => selectedId !== id)

    if (editingTransaction.value?.id === id) {
      editingTransaction.value = null
    }

    toast.success('Transaction deleted successfully!')
  } catch {
    toast.error('Failed to delete transaction.')
  }
}

function handleBulkDelete(ids: number[]) {
  try {
    const idsToDelete = new Set(ids)

    transactions.value = transactions.value.filter((item) => !idsToDelete.has(item.id))

    selectedIds.value = selectedIds.value.filter((selectedId) => !idsToDelete.has(selectedId))

    if (editingTransaction.value && idsToDelete.has(editingTransaction.value.id)) {
      editingTransaction.value = null
    }

    toast.success('Transactions deleted successfully!')
  } catch {
    toast.error('Failed to delete transactions.')
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
    <!-- Page Header -->
    <header class="sticky top-14 z-20 border-b border-slate-200 bg-white lg:top-0">
      <div
        class="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-6 lg:px-10"
      >
        <div>
          <h1 class="text-xl font-semibold text-slate-900">Transactions</h1>

          <p class="mt-0.5 text-sm text-slate-500">
            {{ filteredTransactions.length }} of
            {{ transactions.length }}
            entries
          </p>
        </div>

        <BaseButton
          variant="primary"
          class="flex items-center gap-1.5 transition-colors"
          @click="isAddModalOpen = true"
        >
          <Plus class="h-4 w-4" :stroke-width="2" />
          Add Transaction
        </BaseButton>
      </div>
    </header>

    <!-- Main Content -->
    <section class="mx-auto w-full max-w-[1600px] space-y-6 px-5 py-8 sm:px-6 lg:px-10">
      <!-- Search and Filters -->
      <TransactionFilters
        v-model:query="searchQuery"
        v-model:type="typeFilter"
        v-model:dateFrom="dateFrom"
        v-model:dateTo="dateTo"
        @clear="handleClearFilters"
      />

      <!-- Transaction List -->
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
    </section>

    <!-- Add / Edit Transaction Modal -->
    <AddTransactionModal
      :open="isAddModalOpen"
      :transaction="editingTransaction"
      @close="closeModal"
      @submit="handleSubmit"
      @update="handleUpdate"
    />
  </div>
</template>
