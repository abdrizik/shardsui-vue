import {
  computed,
  nextTick,
  shallowRef,
  toValue,
  watch,
  watchEffect,
  watchPostEffect,
  type MaybeRefOrGetter
} from 'vue'
import { useAnimationFrame } from './animation-frame'
import { createAnimationsFinished } from './animations-finished'

type Offset = {
  horizontal: number
  vertical: number
}

type PopupViewportOptions = {
  activeTrigger: MaybeRefOrGetter<Element | null>
  currentContainer: MaybeRefOrGetter<HTMLElement | null>
  activeTriggerId: MaybeRefOrGetter<string | null>
  open: MaybeRefOrGetter<boolean>
  mounted: MaybeRefOrGetter<boolean>
}

export function usePopupViewport(options: PopupViewportOptions) {
  const previousNode = shallowRef<HTMLElement | null>(null)
  const previousContentDimensions = shallowRef<{ width: number; height: number } | null>(null)
  const showStartingStyle = shallowRef(false)

  const triggerOffset = shallowRef<Offset | null>(null)

  let capturedNode: HTMLElement | null = null
  let lastHandledTrigger: Element | null = null
  let cleanupController: AbortController | null = null

  const cleanupFrame = useAnimationFrame()

  const activeTrigger = computed(() => toValue(options.activeTrigger))
  const activeTriggerId = computed(() => toValue(options.activeTriggerId))
  const currentContainer = computed(() => toValue(options.currentContainer))
  const open = computed(() => toValue(options.open))
  const mounted = computed(() => toValue(options.mounted))

  const animationsFinished = createAnimationsFinished({
    element: currentContainer,
    waitForStartingStyleRemoved: true
  })

  const activationDirection = computed(() => getActivationDirection(triggerOffset.value))
  const transitioning = computed(() => previousNode.value != null)
  const contentKey = computed(() => activeTriggerId.value ?? activeTrigger.value?.id ?? 'current')

  watchEffect(() => {
    if (!open.value || !mounted.value) {
      lastHandledTrigger = null
    }
  })

  watch(
    () => (open.value ? activeTrigger.value : null),
    (_, previousActiveTrigger) => {
      const trigger = activeTrigger.value
      const captured = capturedNode

      if (
        trigger &&
        previousActiveTrigger &&
        trigger !== previousActiveTrigger &&
        lastHandledTrigger !== trigger &&
        captured
      ) {
        const offset = calculateRelativePosition(previousActiveTrigger, trigger)

        previousNode.value = captured
        triggerOffset.value = offset
        showStartingStyle.value = true

        lastHandledTrigger = trigger
      }
    },
    { flush: 'pre' }
  )

  watch(
    () => [contentKey.value, previousNode.value] as const,
    ([, previous]) => {
      if (previous == null) return

      cleanupController?.abort()

      showStartingStyle.value = true

      cleanupFrame.request(async () => {
        showStartingStyle.value = false
        await nextTick()

        const controller = new AbortController()
        cleanupController = controller
        animationsFinished.run(() => {
          previousNode.value = null
          previousContentDimensions.value = null
          capturedNode = null
        }, controller.signal)
      })
    },
    { immediate: true, flush: 'pre' }
  )

  watchPostEffect(() => {
    const container = currentContainer.value
    void previousNode.value

    if (!container) return

    const wrapper = container.ownerDocument.createElement('div')
    for (const child of Array.from(container.childNodes)) {
      wrapper.appendChild(child.cloneNode(true))
    }
    capturedNode = wrapper
  })

  return {
    previousNode,
    previousContentDimensions,
    showStartingStyle,
    activationDirection,
    transitioning,
    contentKey
  }
}

/** Px a trigger's centre must move before the shift counts as directional rather than incidental. */
const DIRECTION_TOLERANCE_PX = 5

function getActivationDirection(offset: Offset | null): string | undefined {
  if (!offset) return undefined
  const horizontal = labelDirection(offset.horizontal, 'right', 'left')
  const vertical = labelDirection(offset.vertical, 'down', 'up')
  return `${horizontal} ${vertical}`
}

function labelDirection(value: number, positiveLabel: string, negativeLabel: string): string {
  if (value > DIRECTION_TOLERANCE_PX) return positiveLabel
  if (value < -DIRECTION_TOLERANCE_PX) return negativeLabel
  return ''
}

function calculateRelativePosition(from: Element, to: Element): Offset {
  const fromRect = from.getBoundingClientRect()
  const toRect = to.getBoundingClientRect()
  const fromCenter = {
    x: fromRect.left + fromRect.width / 2,
    y: fromRect.top + fromRect.height / 2
  }
  const toCenter = {
    x: toRect.left + toRect.width / 2,
    y: toRect.top + toRect.height / 2
  }
  return {
    horizontal: toCenter.x - fromCenter.x,
    vertical: toCenter.y - fromCenter.y
  }
}
