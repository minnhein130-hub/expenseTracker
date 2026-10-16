<script setup lang="ts">
defineProps<{
  id?: string
  type?: string
  placeholder?: string
  required?: boolean
}>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <input
    :id="id"
    :type="type"
    :placeholder="placeholder"
    :required="required"
    v-model="model"
    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
</template>
