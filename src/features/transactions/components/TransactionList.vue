<script setup lang="ts">
import { computed, ref } from 'vue'

import { Pencil, Trash2 } from 'lucide-vue-next'

import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseModal from '@/components/BaseModal.vue'

import type { Transaction } from '@/features/transactions/types/transaction.types'

const props = defineProps<{
  transactions: Transaction[]
  totalCount: number
  selectedIds: number[]
  currentPage: number
  pageSize: number
  totalPages: number
  isFilterEmpty?: boolean
}>()

const emit = defineEmits<{
  edit: [transaction: Transaction]
  delete: [id: number]
  'bulk-delete': [ids: number[]]
  'select-toggle': [id: number]
  'select-all-toggle': []
  'clear-selection': []
  'page-change': [page: number]
  'page-size-change': [size: number]
}>()

type PendingDelete = { mode: 'single'; id: number } | { mode: 'bulk'; ids: number[] } | null

const pendingDelete = ref<PendingDelete>(null)

const isAllSelected = computed(
  () => props.totalCount > 0 && props.selectedIds.length === props.totalCount,
)
const isIndeterminate = computed(() => props.selectedIds.length > 0 && !isAllSelected.value)

const rangeStart = computed(() =>
  props.totalCount === 0 ? 0 : (props.currentPage - 1) * props.pageSize + 1,
)
const rangeEnd = computed(() => Math.min(props.currentPage * props.pageSize, props.totalCount))

const emptyMessage = computed(() =>
  props.isFilterEmpty
    ? 'No transactions match your search or filters.'
    : 'No transactions yet. Submit the form above to add your first one.',
)

const modalTitle = computed(() =>
  pendingDelete.value?.mode === 'bulk' ? 'Delete Transactions?' : 'Delete Transaction?',
)
const modalMessage = computed(() => {
  if (pendingDelete.value?.mode === 'bulk') {
    return `Are you sure you want to delete these ${pendingDelete.value.ids.length} transactions?`
  }
  return 'Are you sure you want to delete this transaction?'
})

function isSelected(id: number) {
  return props.selectedIds.includes(id)
}

function openDeleteModal(transaction: Transaction) {
  pendingDelete.value = { mode: 'single', id: transaction.id }
}

function openBulkDeleteModal() {
  if (props.selectedIds.length === 0) {
    return
  }
  pendingDelete.value = { mode: 'bulk', ids: [...props.selectedIds] }
}

function cancelDelete() {
  pendingDelete.value = null
}

function confirmDelete() {
  const pending = pendingDelete.value
  if (!pending) {
    return
  }
  if (pending.mode === 'single') {
    emit('delete', pending.id)
  } else {
    emit('bulk-delete', pending.ids)
  }
  pendingDelete.value = null
}

function onPageSizeChange(event: Event) {
  const value = Number((event.target as HTMLSelectElement).value)
  emit('page-size-change', value)
}
</script>

<template>
  <section>
    <h2 class="text-xl font-semibold text-slate-900">Transactions</h2>

    <p
      v-if="totalCount === 0"
      class="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500"
    >
      {{ emptyMessage }}
    </p>

    <BaseCard v-else class="mt-4 overflow-hidden">
      <div
        class="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex flex-wrap items-center gap-4">
          <label class="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              class="h-4 w-4 rounded accent-indigo-600"
              :checked="isAllSelected"
              :indeterminate="isIndeterminate"
              @change="emit('select-all-toggle')"
            />
            Select all ({{ totalCount }})
          </label>
          <span class="text-sm text-slate-600">{{ selectedIds.length }} selected</span>
          <BaseButton
            v-if="selectedIds.length > 0"
            variant="secondary"
            size="sm"
            @click="emit('clear-selection')"
          >
            Clear
          </BaseButton>
        </div>

        <BaseButton
          variant="danger"
          size="sm"
          :disabled="selectedIds.length === 0"
          @click="openBulkDeleteModal"
        >
          Delete selected
        </BaseButton>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr
              class="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              <th class="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded accent-indigo-600"
                  :checked="isAllSelected"
                  :indeterminate="isIndeterminate"
                  @change="emit('select-all-toggle')"
                />
              </th>
              <th class="px-4 py-3">Transaction</th>
              <th class="px-4 py-3">Category</th>
              <th class="px-4 py-3">Date</th>
              <th class="px-4 py-3">Note</th>
              <th class="px-4 py-3 text-right">Amount</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="transaction in transactions"
              :key="transaction.id"
              class="border-b border-slate-100 last:border-0 even:bg-slate-50/60"
            >
              <td class="px-4 py-3">
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded accent-indigo-600"
                  :checked="isSelected(transaction.id)"
                  @change="emit('select-toggle', transaction.id)"
                />
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="
                    transaction.type === 'income'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  "
                >
                  {{ transaction.type === 'income' ? 'Income' : 'Expense' }}
                </span>
              </td>
              <td class="px-4 py-3 font-medium text-slate-900">{{ transaction.category }}</td>
              <td class="px-4 py-3 text-slate-600">{{ transaction.date }}</td>
              <td class="max-w-[200px] truncate px-4 py-3 text-slate-600">
                {{ transaction.note ?? '—' }}
              </td>
              <td
                class="px-4 py-3 text-right font-semibold"
                :class="transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'"
              >
                {{ transaction.type === 'income' ? '+' : '-' }}{{ transaction.amount.toFixed(2) }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    title="Edit"
                    class="rounded-lg p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    @click="emit('edit', transaction)"
                  >
                    <Pencil class="h-4 w-4" :stroke-width="1.75" />
                  </button>
                  <button
                    type="button"
                    title="Delete"
                    class="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    @click="openDeleteModal(transaction)"
                  >
                    <Trash2 class="h-4 w-4" :stroke-width="1.75" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span>Showing {{ rangeStart }}–{{ rangeEnd }} of {{ totalCount }}</span>
          <label class="flex items-center gap-2">
            Rows
            <select
              :value="pageSize"
              class="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              @change="onPageSizeChange"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
            </select>
          </label>
        </div>

        <div class="flex items-center gap-2">
          <BaseButton
            variant="secondary"
            size="sm"
            :disabled="currentPage <= 1"
            @click="emit('page-change', currentPage - 1)"
          >
            Previous
          </BaseButton>
          <span class="text-sm tabular-nums text-slate-600">
            {{ currentPage }} / {{ totalPages }}
          </span>
          <BaseButton
            variant="secondary"
            size="sm"
            :disabled="currentPage >= totalPages"
            @click="emit('page-change', currentPage + 1)"
          >
            Next
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <BaseModal
      :open="pendingDelete !== null"
      labelled-by="delete-modal-title"
      @close="cancelDelete"
    >
      <div
        class="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
        role="alertdialog"
        aria-describedby="delete-modal-message"
      >
        <h3 id="delete-modal-title" class="text-lg font-semibold text-slate-900">
          {{ modalTitle }}
        </h3>
        <p id="delete-modal-message" class="mt-2 text-sm text-slate-600">
          {{ modalMessage }}
        </p>

        <div class="mt-6 flex justify-end gap-2">
          <BaseButton variant="secondary" @click="cancelDelete">Cancel</BaseButton>
          <BaseButton variant="danger" @click="confirmDelete">Delete</BaseButton>
        </div>
      </div>
    </BaseModal>
  </section>
</template>
