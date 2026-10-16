<script setup lang="ts">
import type { DashboardStats as DashboardStatsType } from '@/features/dashboard/utils/dashboard.utils'

defineProps<{
  stats: DashboardStatsType
}>()
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm font-medium text-slate-500">Balance</p>
      <p class="mt-2 text-2xl font-semibold text-slate-900">
        {{ stats.balance.toFixed(2) }}
      </p>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm font-medium text-slate-500">Total Income</p>
      <p class="mt-2 text-2xl font-semibold text-emerald-600">
        {{ stats.totalIncome.toFixed(2) }}
      </p>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm font-medium text-slate-500">Total Expense</p>
      <p class="mt-2 text-2xl font-semibold text-rose-600">
        {{ stats.totalExpense.toFixed(2) }}
      </p>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm font-medium text-slate-500">Categories Used</p>
      <p class="mt-2 text-2xl font-semibold text-slate-900">
        {{ stats.categoriesUsed }}
      </p>
    </div>
  </div>
</template>
