import { computed, toValue, type ComputedRef, type MaybeRefOrGetter, type Ref } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import { openChangeComplete } from '@/internal/open-change-complete'
import { useTransitionStatus, type TransitionStatus } from '@/internal/transition-status'

type ItemIndicatorOptions = {
  keepMounted: MaybeRefOrGetter<boolean>
  element: MaybeRefOrGetter<HTMLElement | null>
  open: MaybeRefOrGetter<boolean>
}

export type ItemIndicator = {
  shouldRender: ComputedRef<boolean>
  transitionStatus: Readonly<Ref<TransitionStatus>>
  stateAttrs: ComputedRef<Record<string, string | undefined>>
}

export function useItemIndicator(options: ItemIndicatorOptions): ItemIndicator {
  const open = computed(() => toValue(options.open))

  const transition = useTransitionStatus({ open })

  const shouldRender = computed(() => toValue(options.keepMounted) || transition.mounted.value)
  const stateAttrs = computed(() =>
    dataAttrs({
      'starting-style': transition.status.value === 'starting',
      'ending-style': transition.status.value === 'ending'
    })
  )

  openChangeComplete({
    open,
    element: options.element,
    onComplete: () => {
      if (!open.value) transition.mounted.value = false
    }
  })

  return { shouldRender, transitionStatus: transition.status, stateAttrs }
}
