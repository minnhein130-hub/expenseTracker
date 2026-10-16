<script setup lang="ts">
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import ToastContainer from '@/features/notifications/components/ToastContainer.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <AppSidebar />

    <div class="lg:pl-64">
      <AppNavbar />

      <main>
        <RouterView />
      </main>
    </div>

    <ToastContainer />
  </div>
</template>
