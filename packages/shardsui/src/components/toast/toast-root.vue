<script setup lang="ts">
import {
  computed,
  mergeProps,
  onWatcherCleanup,
  watch,
  watchEffect,
  watchPostEffect,
  watchSyncEffect
} from 'vue'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { contains, getTarget, listen } from '@/internal/dom'
import { openChangeComplete } from '@/internal/open-change-complete'
import { usePartElement } from '@/internal/part-element'
import type { SwipeDirection } from '@/internal/swipe-dismiss'
import type { PartProps } from '@/internal/types'
import { ToastContext, ToastProviderContext, type ToastRootState } from './context'
import { useToastSwipe } from './swipe'
import { useToastRoot } from './toast'
import type { ToastObject } from './types'

type Props = PartProps & {
  toast: ToastObject
  swipeDirection?: SwipeDirection | SwipeDirection[]
  onPointerdown?: (event: PointerEvent) => void
  onPointermove?: (event: PointerEvent) => void
  onPointerup?: (event: PointerEvent) => void
  onPointercancel?: (event: PointerEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  toast,
  swipeDirection = ['down', 'right'],
  onPointerdown,
  onPointermove,
  onPointerup,
  onPointercancel,
  onKeydown
} = defineProps<Props>()

defineSlots<{ default?: (state: ToastRootState) => any }>()

const provider = ToastProviderContext.get()

const element = usePartElement()

const toastRoot = useToastRoot({ toast: () => toast, ref: element })
ToastContext.set(toastRoot)

const isAnchored = computed(() => toast.positionerProps?.anchor !== undefined)

const swipeDirections = computed<SwipeDirection[]>(() =>
  isAnchored.value ? [] : Array.isArray(swipeDirection) ? swipeDirection : [swipeDirection]
)

const swipeEnabled = computed(() => swipeDirections.value.length > 0)

const swipe = useToastSwipe({
  directions: swipeDirections,
  element,
  onSwipeStart: () => {
    provider.hovering.value = true
  },
  onDismiss: () => provider.close(toast.id)
})

let lastToastId: string | undefined

watchEffect(() => {
  const id = toast.id
  if (toast.transitionStatus !== 'starting' && lastToastId === id) return
  if (lastToastId !== undefined) swipe.reset()
  lastToastId = id
})

function startSwipe(event: PointerEvent) {
  if (!swipeEnabled.value || event.button !== 0) return
  if (event.pointerType === 'touch') provider.pauseTimers()
  swipe.start(event)
}

const toastIndex = computed(() => provider.stackIndexOf(toast))
const toastOffsetY = computed(() => provider.offsetYOf(toast.id))

const isHighPriority = computed(() => toast.priority === 'high')

const toastState = computed<ToastRootState>(() => ({
  transitionStatus: toast.transitionStatus,
  expanded: provider.expanded.value,
  limited: toast.limited ?? false,
  type: toast.type,
  swiping: swipe.swiping.value,
  swipeDirection: swipe.direction.value
}))

const stateAttrs = computed(() =>
  dataAttrs({
    expanded: provider.expanded.value,
    limited: toast.limited,
    swiping: swipe.swiping.value,
    type: toast.type,
    'swipe-direction': swipe.direction.value,
    'starting-style': toast.transitionStatus === 'starting',
    'ending-style': toast.transitionStatus === 'ending'
  })
)

openChangeComplete({
  enabled: () => toast.transitionStatus === 'ending',
  open: () => toast.transitionStatus !== 'ending',
  element,
  onComplete: () => provider.remove(toast.id)
})

watchPostEffect(() => {
  const node = element.value
  if (!node || !swipeEnabled.value) return

  const preventTouchMove = (event: TouchEvent) => {
    const target = getTarget(event)
    if (!swipe.swiping.value || !contains(node, target)) return
    event.preventDefault()
  }

  onWatcherCleanup(listen(node, 'touchmove', preventTouchMove, { passive: false }))
})

watch(
  swipe.swiping,
  (swiping, _previous, onCleanup) => {
    if (!swiping) return
    const doc = element.value?.ownerDocument ?? document
    const offPointerup = listen(doc, 'pointerup', swipe.end)
    const offPointercancel = listen(doc, 'pointercancel', swipe.end)
    onCleanup(() => {
      offPointerup()
      offPointercancel()
    })
  },
  { flush: 'sync' }
)

function closeOnEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  const node = element.value
  if (!contains(node, (node?.ownerDocument ?? document).activeElement)) return
  provider.close(toast.id)
}

watchSyncEffect(() => {
  const node = element.value
  if (!node) return
  onWatcherCleanup(
    listen(node, 'keydown', (event: KeyboardEvent) => chain(onKeydown, closeOnEscape)(event))
  )
})

const ownAttrs = computed(() => ({
  inert: toast.limited ? true : undefined,
  role: isHighPriority.value ? 'alertdialog' : 'dialog',
  tabindex: 0,
  'aria-modal': false,
  'aria-labelledby': toastRoot.titleId.value,
  'aria-describedby': toastRoot.descriptionId.value,
  'aria-hidden': isHighPriority.value && !provider.focused.value ? true : undefined,
  onPointerdown: chain(onPointerdown, startSwipe),
  onPointermove: chain(onPointermove, swipe.move),
  onPointerup: chain(onPointerup, swipe.end),
  onPointercancel: chain(onPointercancel, swipe.end)
}))

const rootStyle = computed(() => {
  const drag = swipe.dragStyles.value
  return {
    '--toast-swipe-movement-x': drag.movementX,
    '--toast-swipe-movement-y': drag.movementY,
    ...(swipe.swiping.value
      ? { transition: drag.transition, transform: drag.transform }
      : undefined),
    '--toast-index': String(toastIndex.value),
    '--toast-offset-y': `${toastOffsetY.value}px`,
    '--toast-height': toast.height ? `${toast.height}px` : undefined
  }
})
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="rootStyle"
  >
    <slot v-bind="toastState" />
  </component>
</template>
