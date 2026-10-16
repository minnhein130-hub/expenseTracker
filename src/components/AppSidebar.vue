<script setup lang="ts">
import { ChartNoAxesCombined, LayoutDashboard, ReceiptText, Wallet } from 'lucide-vue-next'
</script>

<template>
  <aside class="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[#152033] lg:flex">
    <div class="flex items-center gap-3 px-5 py-6">
      <div
        class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600"
      >
        <Wallet class="h-5 w-5 text-white" :stroke-width="1.5" />
      </div>
      <div>
        <p class="text-sm font-semibold text-white">Expense Tracker</p>
        <p class="text-xs text-slate-400">Personal finance</p>
      </div>
    </div>

    <nav class="mt-2 flex-1 space-y-1 px-3">
      <RouterLink
        to="/dashboard"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
        exact-active-class="bg-indigo-600 text-white hover:bg-indigo-600 hover:text-white"
      >
        <LayoutDashboard class="h-5 w-5" :stroke-width="1.5" />
        Dashboard
      </RouterLink>
      <RouterLink
        to="/"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
        exact-active-class="bg-indigo-600 text-white hover:bg-indigo-600 hover:text-white"
      >
        <ReceiptText class="h-5 w-5" :stroke-width="1.5" />
        Transactions
      </RouterLink>
      <span class="flex cursor-default items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500">
        <ChartNoAxesCombined class="h-5 w-5" :stroke-width="1.5" />
        Budget
      </span>
    </nav>

    <p class="px-5 py-4 text-xs text-slate-500">Data is stored in browser only.</p>
  </aside>
</template>
