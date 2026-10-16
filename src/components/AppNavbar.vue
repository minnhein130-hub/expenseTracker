<script setup lang="ts">
import { LayoutDashboard, ReceiptText } from 'lucide-vue-next'
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-slate-200 bg-white lg:hidden">
    <div class="flex items-center justify-between px-4 py-3">
      <span class="text-sm font-semibold text-slate-900">Expense Tracker</span>
      <nav class="flex gap-1 text-sm font-medium">
        <RouterLink
          to="/dashboard"
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100"
          exact-active-class="bg-indigo-50 text-indigo-600"
        >
          <LayoutDashboard class="h-5 w-5" :stroke-width="1.5" />
          Dashboard
        </RouterLink>
        <RouterLink
          to="/"
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100"
          exact-active-class="bg-indigo-50 text-indigo-600"
        >
          <ReceiptText class="h-5 w-5" :stroke-width="1.5" />
          Transactions
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
