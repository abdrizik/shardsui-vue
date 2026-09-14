import { computed, shallowRef, toValue, type MaybeRefOrGetter } from 'vue'
import { clamp } from '@/internal/clamp'
import { dataAttrs } from '@/internal/data-attrs'
import type { TextDirection } from '@/internal/direction-context'
import { safelyChangePointerCapture } from '@/internal/swipe-dismiss'
import { getMaxScrollOffset, normalizeScrollOffset } from '@/internal/scroll-edges'
import { useTimeout } from '@/internal/timeout'
import type { Orientation } from '@/internal/types'
import { getOffset } from './get-offset'

// ms the scrollbars stay in their scrolling state after the last change in scroll offset.
const SCROLL_TIMEOUT = 500
// px floor on thumb length, so the thumb stays grabbable when the content dwarfs the viewport.
const MIN_THUMB_SIZE = 16

function applyOverscrollThumb(
  thumb: HTMLElement,
  sizeVar: string,
  scrollFromStart: number,
  maxScroll: number,
  content: number,
  size: number,
  maxThumbOffset: number
): number {
  const clamped = clamp(scrollFromStart, 0, maxScroll)
  const overscroll = scrollFromStart - clamped
  const nextSize = Math.max(MIN_THUMB_SIZE, (size * content) / (content + Math.abs(overscroll)))
  thumb.style.setProperty(sizeVar, overscroll ? `${nextSize}px` : '')

  const offset = maxScroll ? (clamped / maxScroll) * maxThumbOffset : 0
  return offset + (overscroll > 0 ? size - nextSize : 0)
}

function changed<T extends object>(prev: T, next: T): boolean {
  for (const key of Object.keys(next) as (keyof T)[]) {
    if (prev[key] !== next[key]) return true
  }
  return false
}

type HiddenScrollbars = {
  x: boolean
  y: boolean
  corner: boolean
}

type OverflowEdges = {
  xStart: boolean
  xEnd: boolean
  yStart: boolean
  yEnd: boolean
}

export type OverflowEdgeThreshold = {
  xStart: number
  xEnd: number
  yStart: number
  yEnd: number
}

type Size = {
  width: number
  height: number
}

type Coords = {
  x: number
  y: number
}

export type ScrollAreaRootState = {
  scrolling: boolean
  hasOverflowX: boolean
  hasOverflowY: boolean
  overflowXStart: boolean
  overflowXEnd: boolean
  overflowYStart: boolean
  overflowYEnd: boolean
  cornerHidden: boolean
}

type ScrollAreaRootOptions = {
  overflowEdgeThreshold: MaybeRefOrGetter<number | Partial<OverflowEdgeThreshold> | undefined>
  direction: MaybeRefOrGetter<TextDirection>
}

export function useScrollAreaRoot(options: ScrollAreaRootOptions) {
  let activePointerId: number | null = null
  let savedSnapType: string | null = null
  let dragStartY = 0
  let dragStartX = 0
  let dragStartScrollTop = 0
  let dragStartScrollLeft = 0
  let dragOrientation: Orientation = 'vertical'

  const scrollXTimeout = useTimeout()
  const scrollYTimeout = useTimeout()

  let scrollPosition: Coords = { x: 0, y: 0 }

  const hovering = shallowRef(false)
  const touchModality = shallowRef(false)
  const scrollingX = shallowRef(false)
  const scrollingY = shallowRef(false)
  const hasMeasured = shallowRef(false)
  const snapDisabled = shallowRef(false)
  const hiddenScrollbars = shallowRef<HiddenScrollbars>({ x: true, y: true, corner: true })
  const overflowEdges = shallowRef<OverflowEdges>({
    xStart: false,
    xEnd: false,
    yStart: false,
    yEnd: false
  })
  const thumbSize = shallowRef<Size>({ width: 0, height: 0 })
  const cornerSize = shallowRef<Size>({ width: 0, height: 0 })

  const viewportElement = shallowRef<HTMLElement | null>(null)
  const scrollbarYElement = shallowRef<HTMLElement | null>(null)
  const scrollbarXElement = shallowRef<HTMLElement | null>(null)
  const thumbYElement = shallowRef<HTMLElement | null>(null)
  const thumbXElement = shallowRef<HTMLElement | null>(null)
  const cornerElement = shallowRef<HTMLElement | null>(null)

  const direction = computed(() => toValue(options.direction))

  const overflowEdgeThreshold = computed((): OverflowEdgeThreshold => {
    const threshold = toValue(options.overflowEdgeThreshold)
    const thresholds =
      typeof threshold === 'number'
        ? { xStart: threshold, xEnd: threshold, yStart: threshold, yEnd: threshold }
        : threshold

    return {
      xStart: Math.max(0, thresholds?.xStart || 0),
      xEnd: Math.max(0, thresholds?.xEnd || 0),
      yStart: Math.max(0, thresholds?.yStart || 0),
      yEnd: Math.max(0, thresholds?.yEnd || 0)
    }
  })

  const state = computed<ScrollAreaRootState>(() => ({
    scrolling: scrollingX.value || scrollingY.value,
    hasOverflowX: !hiddenScrollbars.value.x,
    hasOverflowY: !hiddenScrollbars.value.y,
    overflowXStart: overflowEdges.value.xStart,
    overflowXEnd: overflowEdges.value.xEnd,
    overflowYStart: overflowEdges.value.yStart,
    overflowYEnd: overflowEdges.value.yEnd,
    cornerHidden: hiddenScrollbars.value.corner
  }))

  const stateAttrs = computed(() =>
    dataAttrs({
      scrolling: state.value.scrolling,
      'has-overflow-x': state.value.hasOverflowX,
      'has-overflow-y': state.value.hasOverflowY,
      'overflow-x-start': state.value.overflowXStart,
      'overflow-x-end': state.value.overflowXEnd,
      'overflow-y-start': state.value.overflowYStart,
      'overflow-y-end': state.value.overflowYEnd
    })
  )

  function setScrolling(orientation: Orientation, value: boolean) {
    const vertical = orientation === 'vertical'
    const timeout = vertical ? scrollYTimeout : scrollXTimeout

    if (vertical) scrollingY.value = value
    else scrollingX.value = value

    timeout.clear()
    if (value) {
      timeout.start(SCROLL_TIMEOUT, () => {
        if (vertical) scrollingY.value = false
        else scrollingX.value = false
      })
    }
  }

  function markScrolled(next: Coords) {
    const offsetX = next.x - scrollPosition.x
    const offsetY = next.y - scrollPosition.y
    scrollPosition = next

    if (offsetY !== 0) setScrolling('vertical', true)
    if (offsetX !== 0) setScrolling('horizontal', true)
  }

  function measure() {
    const viewport = viewportElement.value
    if (!viewport) return

    const scrollableHeight = viewport.scrollHeight
    const scrollableWidth = viewport.scrollWidth
    const viewportHeight = viewport.clientHeight
    const viewportWidth = viewport.clientWidth
    const scrollTop = viewport.scrollTop
    const scrollLeft = viewport.scrollLeft

    hasMeasured.value = true

    if (scrollableHeight === 0 || scrollableWidth === 0) return

    const scrollbarY = scrollbarYElement.value
    const scrollbarX = scrollbarXElement.value
    const thumbY = thumbYElement.value
    const thumbX = thumbXElement.value

    const scrollbarYHidden = viewportHeight >= scrollableHeight
    const scrollbarXHidden = viewportWidth >= scrollableWidth
    const nextHidden: HiddenScrollbars = {
      x: scrollbarXHidden,
      y: scrollbarYHidden,
      corner: scrollbarXHidden || scrollbarYHidden
    }
    const ratioX = viewportWidth / scrollableWidth
    const ratioY = viewportHeight / scrollableHeight
    const maxScrollLeft = getMaxScrollOffset(scrollableWidth, viewportWidth)
    const maxScrollTop = getMaxScrollOffset(scrollableHeight, viewportHeight)

    const isRtl = toValue(options.direction) === 'rtl'
    const scrollLeftFromStart = normalizeScrollOffset(
      isRtl ? -scrollLeft : scrollLeft,
      maxScrollLeft
    )
    const scrollLeftFromEnd = maxScrollLeft - scrollLeftFromStart

    const scrollTopFromStart = normalizeScrollOffset(scrollTop, maxScrollTop)
    const scrollTopFromEnd = maxScrollTop - scrollTopFromStart

    const nextWidth = scrollbarXHidden ? 0 : viewportWidth
    const nextHeight = scrollbarYHidden ? 0 : viewportHeight

    let nextCornerWidth = 0
    let nextCornerHeight = 0
    if (!scrollbarXHidden && !scrollbarYHidden) {
      nextCornerWidth = scrollbarY?.offsetWidth || 0
      nextCornerHeight = scrollbarX?.offsetHeight || 0
    }

    const currentCornerSize = cornerSize.value
    const cornerNotYetSized = currentCornerSize.width === 0 && currentCornerSize.height === 0
    const cornerWidthOffset = cornerNotYetSized ? nextCornerWidth : 0
    const cornerHeightOffset = cornerNotYetSized ? nextCornerHeight : 0

    const scrollbarXOffset = getOffset(scrollbarX, 'padding', 'x')
    const scrollbarYOffset = getOffset(scrollbarY, 'padding', 'y')
    const thumbXOffset = getOffset(thumbX, 'margin', 'x')
    const thumbYOffset = getOffset(thumbY, 'margin', 'y')

    const idealNextWidth = nextWidth - scrollbarXOffset - thumbXOffset
    const idealNextHeight = nextHeight - scrollbarYOffset - thumbYOffset

    const maxNextWidth = scrollbarX
      ? Math.min(scrollbarX.offsetWidth - cornerWidthOffset, idealNextWidth)
      : idealNextWidth
    const maxNextHeight = scrollbarY
      ? Math.min(scrollbarY.offsetHeight - cornerHeightOffset, idealNextHeight)
      : idealNextHeight

    const nextThumbWidth = Math.max(MIN_THUMB_SIZE, maxNextWidth * ratioX)
    const nextThumbHeight = Math.max(MIN_THUMB_SIZE, maxNextHeight * ratioY)

    const nextThumbSize: Size = { width: nextThumbWidth, height: nextThumbHeight }
    if (changed(thumbSize.value, nextThumbSize)) {
      thumbSize.value = nextThumbSize
    }

    if (scrollbarY && thumbY) {
      const maxThumbOffsetY =
        scrollbarY.offsetHeight - nextThumbHeight - scrollbarYOffset - thumbYOffset
      const thumbOffsetY = applyOverscrollThumb(
        thumbY,
        '--scroll-area-thumb-height',
        scrollTop,
        maxScrollTop,
        scrollableHeight,
        nextThumbHeight,
        maxThumbOffsetY
      )
      thumbY.style.transform = `translate3d(0,${thumbOffsetY}px,0)`
    }

    if (scrollbarX && thumbX) {
      const maxThumbOffsetX =
        scrollbarX.offsetWidth - nextThumbWidth - scrollbarXOffset - thumbXOffset
      const thumbOffsetX = applyOverscrollThumb(
        thumbX,
        '--scroll-area-thumb-width',
        isRtl ? -scrollLeft : scrollLeft,
        maxScrollLeft,
        scrollableWidth,
        nextThumbWidth,
        maxThumbOffsetX
      )
      thumbX.style.transform = `translate3d(${isRtl ? -thumbOffsetX : thumbOffsetX}px,0,0)`
    }

    viewport.style.setProperty('--scroll-area-overflow-x-start', `${scrollLeftFromStart}px`)
    viewport.style.setProperty('--scroll-area-overflow-x-end', `${scrollLeftFromEnd}px`)
    viewport.style.setProperty('--scroll-area-overflow-y-start', `${scrollTopFromStart}px`)
    viewport.style.setProperty('--scroll-area-overflow-y-end', `${scrollTopFromEnd}px`)

    const nextCornerSize: Size = { width: nextCornerWidth, height: nextCornerHeight }
    if (cornerElement.value && changed(currentCornerSize, nextCornerSize)) {
      cornerSize.value = nextCornerSize
    }

    if (changed(hiddenScrollbars.value, nextHidden)) {
      hiddenScrollbars.value = nextHidden
    }

    const threshold = overflowEdgeThreshold.value
    const nextEdges: OverflowEdges = {
      xStart: scrollLeftFromStart > threshold.xStart,
      xEnd: scrollLeftFromEnd > threshold.xEnd,
      yStart: scrollTopFromStart > threshold.yStart,
      yEnd: scrollTopFromEnd > threshold.yEnd
    }
    if (changed(overflowEdges.value, nextEdges)) {
      overflowEdges.value = nextEdges
    }
  }

  function disableViewportSnap() {
    const viewport = viewportElement.value
    if (viewport && savedSnapType === null) {
      savedSnapType = viewport.style.scrollSnapType
      viewport.style.scrollSnapType = 'none'
      snapDisabled.value = true
    }
  }

  function activeThumb() {
    return dragOrientation === 'vertical' ? thumbYElement.value : thumbXElement.value
  }

  function startThumbDrag(event: PointerEvent, orientation: Orientation) {
    if (event.button !== 0) return
    if (activePointerId !== null && activeThumb()?.hasPointerCapture(activePointerId)) {
      return
    }

    activePointerId = event.pointerId
    dragStartY = event.clientY
    dragStartX = event.clientX
    dragOrientation = orientation

    const viewport = viewportElement.value
    if (viewport) {
      dragStartScrollTop = viewport.scrollTop
      dragStartScrollLeft = viewport.scrollLeft
      disableViewportSnap()
    }

    const thumb = activeThumb()
    if (thumb) safelyChangePointerCapture(thumb, event.pointerId, 'setPointerCapture')
  }

  function dragThumb(event: PointerEvent) {
    if (event.pointerId !== activePointerId) return
    if (event.buttons % 2 === 0) {
      endThumbDrag(event)
      return
    }

    const viewport = viewportElement.value
    if (!viewport) return

    const vertical = dragOrientation === 'vertical'
    const thumb = vertical ? thumbYElement.value : thumbXElement.value
    const scrollbar = vertical ? scrollbarYElement.value : scrollbarXElement.value
    if (!thumb || !scrollbar) return

    const axis = vertical ? 'y' : 'x'
    const scrollbarOffset = getOffset(scrollbar, 'padding', axis)
    const thumbOffset = getOffset(thumb, 'margin', axis)
    const currentThumbSize = vertical ? thumb.offsetHeight : thumb.offsetWidth
    const trackSize = vertical ? scrollbar.offsetHeight : scrollbar.offsetWidth
    const maxThumbOffset = trackSize - currentThumbSize - scrollbarOffset - thumbOffset
    const delta = vertical ? event.clientY - dragStartY : event.clientX - dragStartX
    const scrollRatio = maxThumbOffset <= 0 ? 0 : delta / maxThumbOffset

    const scrollableSize = vertical ? viewport.scrollHeight : viewport.scrollWidth
    const viewportSize = vertical ? viewport.clientHeight : viewport.clientWidth
    const startScroll = vertical ? dragStartScrollTop : dragStartScrollLeft
    const nextScroll = startScroll + scrollRatio * (scrollableSize - viewportSize)

    if (vertical) viewport.scrollTop = nextScroll
    else viewport.scrollLeft = nextScroll
    setScrolling(dragOrientation, true)
    event.preventDefault()
  }

  function endThumbDrag(event: PointerEvent) {
    if (event.pointerId !== activePointerId) return

    activePointerId = null
    setScrolling(dragOrientation, false)

    if (savedSnapType !== null) {
      const viewport = viewportElement.value
      if (viewport) {
        viewport.style.scrollSnapType = savedSnapType
      }
      savedSnapType = null
      snapDisabled.value = false
    }

    const thumb = activeThumb()
    // `pointercancel` releases capture implicitly, so guard against releasing a
    // capture we no longer hold (which would throw).
    if (thumb?.hasPointerCapture(event.pointerId)) {
      thumb.releasePointerCapture(event.pointerId)
    }
  }

  function markTouchModality(event: PointerEvent) {
    touchModality.value = event.pointerType === 'touch'
  }

  function markHovering(event: PointerEvent) {
    markTouchModality(event)
    if (event.pointerType !== 'touch') {
      hovering.value = true
    }
  }

  function clearHovering() {
    hovering.value = false
  }

  return {
    hovering,
    touchModality,
    scrollingX,
    scrollingY,
    hasMeasured,
    snapDisabled,
    hiddenScrollbars,
    overflowEdges,
    thumbSize,
    cornerSize,
    viewportElement,
    scrollbarYElement,
    scrollbarXElement,
    thumbYElement,
    thumbXElement,
    cornerElement,
    direction,
    overflowEdgeThreshold,
    state,
    stateAttrs,
    markScrolled,
    measure,
    disableViewportSnap,
    startThumbDrag,
    dragThumb,
    endThumbDrag,
    markTouchModality,
    markHovering,
    clearHovering
  }
}

export type ScrollAreaRoot = ReturnType<typeof useScrollAreaRoot>
