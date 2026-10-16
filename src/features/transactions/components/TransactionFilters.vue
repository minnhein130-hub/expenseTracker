<script setup lang="ts">
import { computed } from 'vue'

import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseInput from '@/components/BaseInput.vue'

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
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'

const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700'

function onTypeChange(event: Event) {
  emit('update:type', (event.target as HTMLSelectElement).value as TypeFilter)
}
</script>

<template>
  <section>
    <BaseCard class="flex flex-col gap-4 p-5 sm:flex-row sm:items-end">
      <!-- Search -->
      <div class="min-w-0 flex-1">
        <label for="filter-search" :class="labelClass"> Search </label>

        <BaseInput
          id="filter-search"
          type="search"
          placeholder="Search category or note..."
          :model-value="query"
          @update:model-value="emit('update:query', $event)"
        />
      </div>

      <!-- Type -->
      <div class="w-full sm:w-36">
        <label for="filter-type" :class="labelClass"> Type </label>

        <select id="filter-type" :value="type" :class="inputClass" @change="onTypeChange">
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <!-- From Date -->
      <div class="w-full sm:w-40">
        <label for="filter-date-from" :class="labelClass"> From </label>

        <BaseInput
          id="filter-date-from"
          type="date"
          :model-value="dateFrom"
          @update:model-value="emit('update:dateFrom', $event)"
        />
      </div>

      <!-- To Date -->
      <div class="w-full sm:w-40">
        <label for="filter-date-to" :class="labelClass"> To </label>

        <BaseInput
          id="filter-date-to"
          type="date"
          :model-value="dateTo"
          @update:model-value="emit('update:dateTo', $event)"
        />
      </div>

      <!-- Clear Filters -->
      <BaseButton
        v-if="hasActiveFilters"
        variant="secondary"
        class="transition-colors"
        @click="emit('clear')"
      >
        Clear
      </BaseButton>
    </BaseCard>
  </section>
</template>
