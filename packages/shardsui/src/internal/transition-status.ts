import {
  onWatcherCleanup,
  shallowRef,
  toValue,
  watchEffect,
  watchPostEffect,
  type MaybeRefOrGetter
} from 'vue'
import { cancelAnimationFrameTick, requestAnimationFrameTick } from './animation-frame'

export type TransitionStatus = 'starting' | 'ending' | 'idle' | undefined

type TransitionStatusOptions = {
  open: MaybeRefOrGetter<boolean>
  idle?: MaybeRefOrGetter<boolean | undefined>
}

export function useTransitionStatus(options: TransitionStatusOptions) {
  const initialOpen = toValue(options.open)
  const mounted = shallowRef(initialOpen)
  const status = shallowRef<TransitionStatus>(
    initialOpen && toValue(options.idle) ? 'idle' : undefined
  )

  watchEffect(() => {
    const open = toValue(options.open)

    if (open && !mounted.value) {
      mounted.value = true
      status.value = 'starting'
    }

    if (!open && mounted.value && status.value !== 'ending' && !toValue(options.idle)) {
      status.value = 'ending'
    }

    if (!open && !mounted.value && status.value === 'ending') {
      status.value = undefined
    }
  })

  watchPostEffect(() => {
    if (toValue(options.open)) {
      const settled = toValue(options.idle)
      if (settled && mounted.value && status.value !== 'idle') {
        status.value = 'starting'
      }
      const frame = requestAnimationFrameTick(() => {
        status.value = settled ? 'idle' : undefined
      })
      onWatcherCleanup(() => cancelAnimationFrameTick(frame))
      return
    }

    if (!mounted.value || status.value === 'ending' || !toValue(options.idle)) return
    const frame = requestAnimationFrameTick(() => {
      status.value = 'ending'
    })
    onWatcherCleanup(() => cancelAnimationFrameTick(frame))
  })

  return { mounted, status }
}
