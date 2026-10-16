<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue'

import type { DashboardStats as DashboardStatsType } from '@/features/dashboard/utils/dashboard.utils'

defineProps<{
  stats: DashboardStatsType
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 xl:grid-cols-4">
    <BaseCard class="min-h-36 p-6 transition-shadow hover:shadow-md">
      <p class="text-sm font-medium text-slate-500">Balance</p>
      <p class="mt-2 text-2xl font-semibold text-slate-900">
        {{ stats.balance.toFixed(2) }}
      </p>
    </BaseCard>

    <BaseCard class="min-h-36 p-6 transition-shadow hover:shadow-md">
      <p class="text-sm font-medium text-slate-500">Total Income</p>
      <p class="mt-2 text-2xl font-semibold text-emerald-600">
        {{ stats.totalIncome.toFixed(2) }}
      </p>
    </BaseCard>

    <BaseCard class="min-h-36 p-6 transition-shadow hover:shadow-md">
      <p class="text-sm font-medium text-slate-500">Total Expense</p>
      <p class="mt-2 text-2xl font-semibold text-rose-600">
        {{ stats.totalExpense.toFixed(2) }}
      </p>
    </BaseCard>
    <BaseCard class="min-h-36 p-6 transition-shadow hover:shadow-md">
      <p class="text-sm font-medium text-slate-500">Categories Used</p>
      <p class="mt-2 text-2xl font-semibold text-slate-900">
        {{ stats.categoriesUsed }}
      </p>
    </BaseCard>
  </div>
</template>
