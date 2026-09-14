import { DEV } from 'esm-env'
import { getCurrentScope, onScopeDispose } from 'vue'

type AnimationFrameId = number

let lastRAF = globalThis.requestAnimationFrame

function createScheduler() {
  let callbacks: (FrameRequestCallback | null)[] = []
  let nextId = 1
  let startId = 1
  let isScheduled = false

  function tick(timestamp: number) {
    isScheduled = false

    const currentCallbacks = callbacks
    callbacks = []
    startId = nextId

    for (const callback of currentCallbacks) {
      callback?.(timestamp)
    }
  }

  return {
    request(fn: FrameRequestCallback): AnimationFrameId {
      const id = nextId
      nextId += 1
      callbacks.push(fn)

      // Test suites swap `requestAnimationFrame` for a fake; a frame already scheduled on the old
      // one will never fire, so schedule again whenever the global identity changes.
      let rafChanged = false
      if (DEV && lastRAF !== requestAnimationFrame) {
        lastRAF = requestAnimationFrame
        rafChanged = true
      }

      if (!isScheduled || rafChanged) {
        isScheduled = true
        requestAnimationFrame(tick)
      }
      return id
    },

    cancel(id: AnimationFrameId): void {
      const index = id - startId
      if (index < 0 || index >= callbacks.length) return
      callbacks[index] = null
    }
  }
}

const scheduler = createScheduler()

export function requestAnimationFrameTick(fn: FrameRequestCallback): AnimationFrameId {
  return scheduler.request(fn)
}

export function cancelAnimationFrameTick(id: AnimationFrameId): void {
  scheduler.cancel(id)
}

export type AnimationFrame = {
  request: (fn: () => void) => void
  cancel: () => void
}

/** A cancellable animation frame with no owner; the caller must call `cancel` itself. */
export function createAnimationFrame(): AnimationFrame {
  let currentId: AnimationFrameId | null = null

  function cancel(): void {
    if (currentId === null) return
    scheduler.cancel(currentId)
    currentId = null
  }

  return {
    request(fn) {
      cancel()
      currentId = scheduler.request(() => {
        currentId = null
        fn()
      })
    },
    cancel
  }
}

/** A `createAnimationFrame` cancelled when the calling effect scope is disposed. */
export function useAnimationFrame(): AnimationFrame {
  const frame = createAnimationFrame()
  if (!getCurrentScope()) {
    throw new Error(
      'ShardsUI: useAnimationFrame() needs an effect scope; use createAnimationFrame() instead.'
    )
  }
  onScopeDispose(frame.cancel)
  return frame
}
