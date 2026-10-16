<script setup lang="ts">
defineProps<{
  open: boolean
  labelledBy: string
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="labelledBy"
    @click.self="$emit('close')"
  >
    <slot />
  </div>
</template>
