<script setup lang="ts">
import { computed } from 'vue'

import type { TypeFilter } from '@/features/transactions/types/transaction.types'

const props = defineProps<{
  query: string
  type: TypeFilter
  dateFrom: string
  dateTo: string
}>()

const emit = defineEmits<{
  'update:query': [value: string]
  'update:type': [value: TypeFilter]
  'update:dateFrom': [value: string]
  'update:dateTo': [value: string]
  clear: []
}>()

const hasActiveFilters = computed(
  () =>
    props.query.trim() !== '' ||
    props.type !== 'all' ||
    props.dateFrom !== '' ||
    props.dateTo !== '',
)

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'

function onQueryInput(event: Event) {
  emit('update:query', (event.target as HTMLInputElement).value)
}

function onTypeChange(event: Event) {
  emit('update:type', (event.target as HTMLSelectElement).value as TypeFilter)
}

function onDateFromInput(event: Event) {
  emit('update:dateFrom', (event.target as HTMLInputElement).value)
}

function onDateToInput(event: Event) {
  emit('update:dateTo', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <section>
    <div
      class="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end"
    >
      <div class="min-w-0 flex-1">
        <label for="filter-search" class="block text-sm font-medium text-slate-700">Search</label>
        <input
          id="filter-search"
          type="search"
          :value="query"
          placeholder="Search category or note..."
          :class="inputClass"
          @input="onQueryInput"
        />
      </div>

      <div class="w-full sm:w-36">
        <label for="filter-type" class="block text-sm font-medium text-slate-700">Type</label>
        <select id="filter-type" :value="type" :class="inputClass" @change="onTypeChange">
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div class="w-full sm:w-40">
        <label for="filter-date-from" class="block text-sm font-medium text-slate-700">
          From
        </label>
        <input
          id="filter-date-from"
          type="date"
          :value="dateFrom"
          :class="inputClass"
          @input="onDateFromInput"
        />
      </div>

      <div class="w-full sm:w-40">
        <label for="filter-date-to" class="block text-sm font-medium text-slate-700">To</label>
        <input
          id="filter-date-to"
          type="date"
          :value="dateTo"
          :class="inputClass"
          @input="onDateToInput"
        />
      </div>

      <button
        v-if="hasActiveFilters"
        type="button"
        class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        @click="emit('clear')"
      >
        Clear
      </button>
    </div>
  </section>
</template>
