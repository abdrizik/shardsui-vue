import { shallowRef, watch } from 'vue'

/** Mirrors an optional `open` prop into local state that keeps following the prop. */
export function useOpen(prop: () => boolean | undefined, fallback = false) {
  const open = shallowRef(prop() ?? fallback)
  watch(prop, (next) => {
    if (next !== undefined) open.value = next
  })
  return open
}
