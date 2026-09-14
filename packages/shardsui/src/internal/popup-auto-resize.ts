import { computed, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { useAnimationFrame } from './animation-frame'
import { createAnimationsFinished } from './animations-finished'
import type { Side } from './floating/anchor-positioning'
import { getCssDimensions } from './get-css-dimensions'
import { setTemporaryStyle, setTemporaryStyles } from './temporary-style'

type Dimensions = { width: number; height: number }

const EMPTY_STYLES: Record<string, string> = {}

type PopupAutoResizeOptions = {
  popupElement: MaybeRefOrGetter<HTMLElement | null>
  positionerElement: MaybeRefOrGetter<HTMLElement | null>
  mounted: MaybeRefOrGetter<boolean>
  content: () => unknown
  side: MaybeRefOrGetter<Side>
  direction: MaybeRefOrGetter<'ltr' | 'rtl'>
  onMeasureLayout: () => void
  onMeasureLayoutComplete: (previousDimensions: Dimensions | null) => void
}

function setPopupCssSize(popupElement: HTMLElement, size: Dimensions | 'auto') {
  const width = size === 'auto' ? 'auto' : `${size.width}px`
  const height = size === 'auto' ? 'auto' : `${size.height}px`
  popupElement.style.setProperty('--popup-width', width)
  popupElement.style.setProperty('--popup-height', height)
}

function setPositionerCssSize(positionerElement: HTMLElement, size: Dimensions | 'max-content') {
  const width = size === 'max-content' ? 'max-content' : `${size.width}px`
  const height = size === 'max-content' ? 'max-content' : `${size.height}px`
  positionerElement.style.setProperty('--positioner-width', width)
  positionerElement.style.setProperty('--positioner-height', height)
}

function getAnchoringStyles(side: Side, direction: 'ltr' | 'rtl'): Record<string, string> {
  const isPhysicalTop = side === 'top'
  const isPhysicalLeft =
    side === 'left' || side === (direction === 'rtl' ? 'inline-end' : 'inline-start')

  if (!isPhysicalTop && !isPhysicalLeft) return EMPTY_STYLES

  return {
    position: 'absolute',
    [isPhysicalTop ? 'bottom' : 'top']: '0',
    [isPhysicalLeft ? 'right' : 'left']: '0'
  }
}

export function usePopupAutoResize(options: PopupAutoResizeOptions): void {
  const popupElement = computed(() => toValue(options.popupElement))
  const positionerElement = computed(() => toValue(options.positionerElement))
  const mounted = computed(() => toValue(options.mounted))
  const content = computed(() => options.content())
  const side = computed(() => toValue(options.side))
  const direction = computed(() => toValue(options.direction))
  const anchoringStyles = computed(() => getAnchoringStyles(side.value, direction.value))

  const animationFrame = useAnimationFrame()
  const animationsFinished = createAnimationsFinished({
    element: popupElement,
    waitForStartingStyleRemoved: true
  })

  let committedDimensions: Dimensions | null = null
  let isInitialRender = true

  watch(
    () =>
      [
        mounted.value,
        content.value,
        popupElement.value,
        positionerElement.value,
        anchoringStyles.value
      ] as const,
    ([isMounted, , popup, positioner, styles], _previous, onCleanup) => {
      if (!isMounted) {
        isInitialRender = true
        committedDimensions = null
        return
      }

      if (!popup || !positioner) return

      const restoreAnchoringStyles = setTemporaryStyles(popup, styles)

      setPopupCssSize(popup, 'auto')

      const restorePopupPosition = setTemporaryStyle(popup, 'position', 'static')
      const restorePopupTransform = setTemporaryStyle(popup, 'transform', 'none')
      const restorePopupScale = setTemporaryStyle(popup, 'scale', '1')
      const restorePositionerAvailableSize = setTemporaryStyles(positioner, {
        '--available-width': 'max-content',
        '--available-height': 'max-content'
      })

      function restoreMeasurementOverrides() {
        restorePopupPosition()
        restorePopupTransform()
        restorePopupScale()
        restorePositionerAvailableSize()
      }

      options.onMeasureLayout()

      if (isInitialRender || committedDimensions === null) {
        setPositionerCssSize(positioner, 'max-content')

        const dimensions = getCssDimensions(popup)

        committedDimensions = dimensions

        setPositionerCssSize(positioner, dimensions)
        restoreMeasurementOverrides()
        options.onMeasureLayoutComplete(null)

        isInitialRender = false

        onCleanup(restoreAnchoringStyles)
        return
      }

      setPositionerCssSize(positioner, 'max-content')

      const previousDimensions = committedDimensions
      const newDimensions = getCssDimensions(popup)

      committedDimensions = newDimensions

      setPopupCssSize(popup, previousDimensions)
      restoreMeasurementOverrides()
      options.onMeasureLayoutComplete(previousDimensions)

      setPositionerCssSize(positioner, newDimensions)

      const abortController = new AbortController()

      animationFrame.request(() => {
        setPopupCssSize(popup, newDimensions)

        animationsFinished.run(() => {
          popup.style.setProperty('--popup-width', 'auto')
          popup.style.setProperty('--popup-height', 'auto')
        }, abortController.signal)
      })

      onCleanup(() => {
        abortController.abort()
        animationFrame.cancel()
        restoreAnchoringStyles()
      })
    },
    { immediate: true, flush: 'post' }
  )
}
