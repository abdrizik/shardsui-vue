import { onWatcherCleanup, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { createAnimationsFinished } from './animations-finished'
import type { useTransitionStatus } from './transition-status'

type Transition = ReturnType<typeof useTransitionStatus>

type OpenChangeCompleteOptions = {
  enabled?: MaybeRefOrGetter<boolean | undefined>
  open: MaybeRefOrGetter<boolean>
  element: MaybeRefOrGetter<HTMLElement | null>
  onComplete: () => void
}

export function openChangeComplete(options: OpenChangeCompleteOptions): void {
  const animationsFinished = createAnimationsFinished({
    waitForStartingStyleRemoved: options.open,
    element: options.element
  })

  watch(
    () =>
      [toValue(options.enabled) ?? true, toValue(options.open), toValue(options.element)] as const,
    ([isEnabled]) => {
      if (!isEnabled) return
      const controller = new AbortController()
      animationsFinished.run(options.onComplete, controller.signal)
      onWatcherCleanup(() => controller.abort())
    },
    { immediate: true, flush: 'post' }
  )
}

type OpenChangeCompleteCloseOptions = {
  open: MaybeRefOrGetter<boolean>
  element: MaybeRefOrGetter<HTMLElement | null>
  transition: Transition
  onOpenChangeComplete: () => ((open: boolean) => void) | undefined
  onClosed: () => void
}

export function openChangeCompleteClose(options: OpenChangeCompleteCloseOptions): void {
  openChangeComplete({
    enabled: () => options.transition.mounted.value && !toValue(options.open),
    open: options.open,
    element: options.element,
    onComplete: () => {
      if (!toValue(options.open)) {
        options.transition.mounted.value = false
        options.onOpenChangeComplete()?.(false)
        options.onClosed()
      }
    }
  })
}
