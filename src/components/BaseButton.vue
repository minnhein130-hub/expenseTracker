<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'danger'
type Size = 'md' | 'sm'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
  },
)

const variantClass: Record<Variant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-2',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 focus:ring-offset-2',
  secondary: 'border border-slate-300 bg-white text-slate-700 focus:ring-indigo-500',
}

const sizeClass: Record<Size, string> = {
  md: 'px-4 py-2 text-sm',
  sm: 'px-3 py-1.5 text-xs',
}

const secondaryHoverClass: Record<Size, string> = {
  md: 'hover:bg-slate-50',
  sm: 'hover:bg-slate-100',
}

const buttonClass = computed(() => {
  const classes = [
    'rounded-lg font-medium focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
    sizeClass[props.size],
    variantClass[props.variant],
  ]

  if (props.variant === 'secondary') {
    classes.push(secondaryHoverClass[props.size])
  }

  return classes
})
</script>

<template>
  <button :type="type" :class="buttonClass" :disabled="disabled">
    <slot />
  </button>
</template>
