import { onScopeDispose, shallowRef, watch, type Ref } from 'vue'

export function useDebounce<T>(source: Ref<T>, delay = 1000): Ref<T> {
  const debounced = shallowRef<T>(source.value)

  let timer: number | undefined

  watch(source, (value) => {
    window.clearTimeout(timer)

    timer = window.setTimeout(() => {
      debounced.value = value
    }, delay)
  })

  onScopeDispose(() => {
    window.clearTimeout(timer)
  })

  return debounced
}
