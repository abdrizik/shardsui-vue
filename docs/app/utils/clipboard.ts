import { onScopeDispose, shallowRef } from 'vue'

export function useClipboard(resetMs = 2000) {
  const copied = shallowRef(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  onScopeDispose(() => clearTimeout(timer))

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      clearTimeout(timer)
      copied.value = true
      timer = setTimeout(() => (copied.value = false), resetMs)
    } catch {
      copied.value = false
    }
  }

  return { copied, copy }
}
