import { mergeProps as mergeVueProps } from 'vue'
import { makeEventPreventable } from './event-preventable'

type Handler = (...args: unknown[]) => void

export function mergeProps(...props: Parameters<typeof mergeVueProps>) {
  const merged = mergeVueProps(...props)
  for (const key in merged) {
    const handlers = merged[key]
    if (/^on[A-Z]/.test(key) && Array.isArray(handlers)) {
      merged[key] = mergeHandlers([...handlers].reverse())
    }
  }
  return merged
}

function mergeHandlers(handlers: Handler[]) {
  return (...args: unknown[]) => {
    const [event] = args
    if (!(event instanceof Event)) {
      for (const handler of handlers) handler(...args)
      return
    }

    const preventable = makeEventPreventable(event)
    for (const handler of handlers) {
      handler(...args)
      if (preventable.shardsUIHandlerPrevented) return
    }
  }
}
