<script setup lang="ts">
import { computed, ref } from 'vue'

import type { Transaction } from '@/features/transactions/types/transaction.types'

const props = defineProps<{
  transactions: Transaction[]
  totalCount: number
  selectedIds: number[]
  currentPage: number
  pageSize: number
  totalPages: number
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

type PendingDelete =
  | { mode: 'single'; id: number }
  | { mode: 'bulk'; ids: number[] }
  | null

const pendingDelete = ref<PendingDelete>(null)

const isAllSelected = computed(
  () => props.totalCount > 0 && props.selectedIds.length === props.totalCount,
)
const isIndeterminate = computed(
  () => props.selectedIds.length > 0 && !isAllSelected.value,
)

const rangeStart = computed(() =>
  props.totalCount === 0 ? 0 : (props.currentPage - 1) * props.pageSize + 1,
)
const rangeEnd = computed(() =>
  Math.min(props.currentPage * props.pageSize, props.totalCount),
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
      No transactions yet. Submit the form above to add your first one.
    </p>

    <div v-else class="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
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
          <button
            v-if="selectedIds.length > 0"
            type="button"
            class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @click="emit('clear-selection')"
          >
            Clear
          </button>
        </div>

        <button
          type="button"
          class="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="selectedIds.length === 0"
          @click="openBulkDeleteModal"
        >
          Delete selected
        </button>
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
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.75"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    title="Delete"
                    class="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    @click="openDeleteModal(transaction)"
                  >
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.75"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
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
          <button
            type="button"
            class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="currentPage <= 1"
            @click="emit('page-change', currentPage - 1)"
          >
            Previous
          </button>
          <span class="text-sm tabular-nums text-slate-600">
            {{ currentPage }} / {{ totalPages }}
          </span>
          <button
            type="button"
            class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="currentPage >= totalPages"
            @click="emit('page-change', currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="pendingDelete"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      @click.self="cancelDelete"
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
          <button
            type="button"
            class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @click="cancelDelete"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            @click="confirmDelete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
