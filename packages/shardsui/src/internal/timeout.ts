import { getCurrentScope, onScopeDispose } from 'vue'

type TimeoutId = ReturnType<typeof setTimeout>

export type Timeout = {
  start: (delay: number, fn: () => void) => void
  isStarted: () => boolean
  clear: () => void
}

/** A cancellable timeout with no owner; the caller must call `clear` itself. */
export function createTimeout(): Timeout {
  let currentId: TimeoutId | undefined

  function clear(): void {
    if (currentId === undefined) return
    clearTimeout(currentId)
    currentId = undefined
  }

  return {
    start(delay, fn) {
      clear()
      currentId = setTimeout(() => {
        currentId = undefined
        fn()
      }, delay)
    },
    isStarted: () => currentId !== undefined,
    clear
  }
}

/** A `createTimeout` cleared when the calling effect scope is disposed. */
export function useTimeout(): Timeout {
  const timeout = createTimeout()
  if (!getCurrentScope()) {
    throw new Error('ShardsUI: useTimeout() needs an effect scope; use createTimeout() instead.')
  }
  onScopeDispose(timeout.clear)
  return timeout
}
