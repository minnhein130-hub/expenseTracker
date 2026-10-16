<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue'

import type { CategoryTotal } from '@/features/dashboard/utils/dashboard.utils'

defineProps<{
  title: string
  categories: CategoryTotal[]
  barColor: string
  emptyMessage: string
}>()

function percent(share: number): string {
  return `${(share * 100).toFixed(1)}%`
}
</script>

<template>
  <BaseCard class="p-6">
    <h2 class="text-xl font-semibold text-slate-900">
      {{ title }}
    </h2>

    <div v-if="categories.length > 0" class="mt-4 space-y-4">
      <div v-for="entry in categories" :key="entry.category">
        <div class="flex items-center justify-between text-sm">
          <span class="font-medium text-slate-700">
            {{ entry.category }}
          </span>

          <span class="font-semibold text-slate-900">
            {{ entry.total.toFixed(2) }}
          </span>
        </div>

        <div class="mt-1.5 flex items-center gap-2">
          <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              class="h-full rounded-full"
              :class="barColor"
              :style="{ width: percent(entry.share) }"
            ></div>
          </div>

          <span class="w-14 text-right text-xs tabular-nums text-slate-500">
            {{ percent(entry.share) }}
          </span>
        </div>
      </div>
    </div>

    <p
      v-else
      class="mt-4 rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500"
    >
      {{ emptyMessage }}
    </p>
  </BaseCard>
</template>
