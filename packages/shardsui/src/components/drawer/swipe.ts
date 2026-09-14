import {
  computed,
  onScopeDispose,
  onWatcherCleanup,
  shallowRef,
  watch,
  watchPostEffect,
  type ComputedRef,
  type Ref,
  type ShallowRef
} from 'vue'
import type { DialogRoot } from '@/components/dialog/dialog'
import { createAnimationFrame } from '@/internal/animation-frame'
import { clamp } from '@/internal/clamp'
import { contains, getTarget, isElement, listen } from '@/internal/dom'
import { getElementAtPoint } from '@/internal/get-element-at-point'
import { REASONS } from '@/internal/reasons'
import { findScrollableTouchTarget, type ScrollAxis } from '@/internal/scrollable'
import { getDisplacement, useSwipeDismiss, type SwipeDirection } from '@/internal/swipe-dismiss'
import { DRAWER_SWIPE_MOVEMENT_X_VAR, DRAWER_SWIPE_MOVEMENT_Y_VAR } from './constants'
import type { DrawerProvider } from './context'
import type { DrawerRoot, DrawerSnapPoint } from './drawer'
import { findClosestSnapPoint, useDrawerSnapPoints } from './snap-points'
import {
  canSwipeFromScrollEdgeOnMove,
  getBaseSwipeThreshold,
  hasScrollableContentOnAxis,
  isAtSwipeStartEdge,
  isDrawerContentTarget,
  isSwipeIgnoredTarget,
  MIN_SWIPE_THRESHOLD,
  resetBackdropSwipeVars,
  selectionEndpointElements,
  setBackdropSwipeVars,
  setBackdropSwipingAttribute,
  shouldIgnoreSwipeForTextSelection,
  shouldYieldTouchMove,
  updateTouchScrollPosition,
  type TouchScroll
} from './swipe-dom'

const FAST_SWIPE_VELOCITY = 0.5
const SNAP_VELOCITY_THRESHOLD = 0.5
// Velocities are px/ms, so multiplying by a duration in ms projects how far the drag would coast.
const SNAP_VELOCITY_MULTIPLIER = 300
const MAX_SNAP_VELOCITY = 4
const MIN_SWIPE_RELEASE_VELOCITY = 0.2
const MAX_SWIPE_RELEASE_VELOCITY = 4
const MIN_SWIPE_RELEASE_DURATION_MS = 80
const MAX_SWIPE_RELEASE_DURATION_MS = 360
const MIN_SWIPE_RELEASE_SCALAR = 0.1
const MAX_SWIPE_RELEASE_SCALAR = 1

function isRangeInput(
  target: EventTarget | null,
  win: Window & typeof globalThis
): target is HTMLInputElement {
  return target instanceof win.HTMLInputElement && target.type === 'range'
}

function isEventOnRangeInput(event: TouchEvent): boolean {
  const win = (event.target as Element | null)?.ownerDocument?.defaultView ?? window
  return event.composedPath().some((target) => isRangeInput(target, win))
}

type ReleaseDetails = {
  deltaX: number
  deltaY: number
  direction?: SwipeDirection | undefined
  velocityX: number
  velocityY: number
  releaseVelocityX: number
  releaseVelocityY: number
}

export type DrawerSwipe = {
  swiping: Readonly<Ref<boolean>>
  swipeStrength: ShallowRef<number | null>
  releasing: ShallowRef<boolean>
  dragStyles: ComputedRef<Record<string, string>>
  activeSnapPointOffset: ComputedRef<number | null>
}

/** Swipe-to-dismiss and snap-point dragging for `Drawer.Viewport`. */
export function useDrawerSwipe(
  dialog: DialogRoot,
  drawer: DrawerRoot,
  provider: DrawerProvider | undefined
): DrawerSwipe {
  const releaseStrength = shallowRef<number | null>(null)
  const releasing = shallowRef(false)
  let pendingCloseSnapPoint: DrawerSnapPoint | null | undefined = undefined

  let ignoreTouchSwipe = false
  let touchScroll: TouchScroll | null = null
  let lastPointerType: PointerEvent['pointerType'] | '' = ''
  let ignoreNextTouchStartFromPen = false
  let nestedSwipeActive = false

  const controlledDismissFrame = createAnimationFrame()
  onScopeDispose(controlledDismissFrame.cancel)

  const nestedDrawerOpen = computed(() => dialog.nestedOpenDrawerCount.value > 0)

  const hasSnapPoints = computed(() => !!drawer.snapPoints.value?.length)

  const scrollAxis = computed<ScrollAxis>(() => {
    const direction = drawer.swipeDirection.value
    return direction === 'left' || direction === 'right' ? 'horizontal' : 'vertical'
  })
  const isVerticalScrollAxis = computed(() => scrollAxis.value === 'vertical')

  const snapPointsState = useDrawerSnapPoints({
    viewportElement: dialog.viewportElement,
    snapPoints: drawer.snapPoints,
    activeSnapPoint: drawer.activeSnapPoint,
    popupHeight: drawer.popupHeight
  })

  const activeSnapPointOffset = snapPointsState.activeSnapPointOffset

  const snapPointRange = computed(() => {
    const snapPoints = drawer.snapPoints.value
    if (!snapPoints || snapPoints.length < 2) return null
    const swipeDirection = drawer.swipeDirection.value
    if (swipeDirection !== 'down' && swipeDirection !== 'up') return null
    const resolvedSnapPoints = snapPointsState.resolvedSnapPoints.value
    if (resolvedSnapPoints.length < 2) return null
    const offsets = resolvedSnapPoints.map((point) => point.offset).sort((a, b) => a - b)
    const minOffset = offsets[0]!
    return { minOffset, range: offsets[1]! - minOffset }
  })

  const snapPointProgress = computed(() => {
    const range = snapPointRange.value
    const offset = activeSnapPointOffset.value
    if (!range || offset === null) return null
    return clamp((offset - range.minOffset) / range.range, 0, 1)
  })

  const swipeDirections = computed<SwipeDirection[]>(() => {
    const direction = drawer.swipeDirection.value
    if (hasSnapPoints.value && (direction === 'down' || direction === 'up')) {
      return direction === 'down' ? ['down', 'up'] : ['up', 'down']
    }
    return [direction]
  })

  function updateNestedSwipeActive(details?: {
    direction?: SwipeDirection | undefined
    deltaX: number
    deltaY: number
  }): void {
    if (nestedSwipeActive || !details) return
    const direction = details.direction ?? drawer.swipeDirection.value
    const delta = getDisplacement(direction, details.deltaX, details.deltaY)
    if (Math.abs(delta) < MIN_SWIPE_THRESHOLD) return
    nestedSwipeActive = true
    drawer.parent.value?.onNestedSwipingChange(true)
  }

  function finishNestedSwipe(): void {
    if (!nestedSwipeActive) return
    nestedSwipeActive = false
    drawer.parent.value?.onNestedSwipingChange(false)
  }

  function clearRelease(): void {
    drawer.swipeDismissed.value = false
    releasing.value = false
    releaseStrength.value = null
  }

  function applyProgress(resolvedProgress: number): void {
    const swipeProgress = dialog.open.value && !dialog.nested.value ? resolvedProgress : 0
    const height = drawer.frontmostHeight.value

    provider?.setVisualState({
      swipeProgress,
      frontmostHeight: swipeProgress > 0 ? height : 0
    })

    const backdropElement = dialog.backdropElement.value
    if (!backdropElement) return

    if (swipeProgress <= 0) {
      resetBackdropSwipeVars(backdropElement)
      return
    }

    setBackdropSwipeVars(backdropElement, swipeProgress, height)
  }

  function releaseScalar(
    direction: SwipeDirection,
    { deltaX, deltaY, velocityX, velocityY, releaseVelocityX, releaseVelocityY }: ReleaseDetails
  ): number | null {
    const popupElement = dialog.popupElement.value
    if (!popupElement) return null

    const size =
      direction === 'left' || direction === 'right'
        ? popupElement.offsetWidth
        : popupElement.offsetHeight
    if (size <= 0) return null

    const snapPointBaseOffset =
      (direction === 'down' || direction === 'up') && hasSnapPoints.value
        ? (activeSnapPointOffset.value ?? 0)
        : 0
    const translationAlongDirection =
      snapPointBaseOffset + getDisplacement(direction, deltaX, deltaY)
    const remainingDistance = Math.max(0, size - translationAlongDirection)
    if (remainingDistance <= 0) return null

    const releaseVelocity = getDisplacement(direction, releaseVelocityX, releaseVelocityY)
    const directionalVelocity =
      Math.abs(releaseVelocity) > 0
        ? releaseVelocity
        : getDisplacement(direction, velocityX, velocityY)
    if (directionalVelocity <= MIN_SWIPE_RELEASE_VELOCITY) return null

    const clampedVelocity = clamp(
      directionalVelocity,
      MIN_SWIPE_RELEASE_VELOCITY,
      MAX_SWIPE_RELEASE_VELOCITY
    )
    const durationMs = clamp(
      remainingDistance / clampedVelocity,
      MIN_SWIPE_RELEASE_DURATION_MS,
      MAX_SWIPE_RELEASE_DURATION_MS
    )
    const normalizedDuration =
      (durationMs - MIN_SWIPE_RELEASE_DURATION_MS) /
      (MAX_SWIPE_RELEASE_DURATION_MS - MIN_SWIPE_RELEASE_DURATION_MS)
    return (
      MIN_SWIPE_RELEASE_SCALAR +
      normalizedDuration * (MAX_SWIPE_RELEASE_SCALAR - MIN_SWIPE_RELEASE_SCALAR)
    )
  }

  function clearTextSelection(event: PointerEvent | TouchEvent): void {
    if ('touches' in event || event.pointerType === 'touch') return

    const popupElement = dialog.popupElement.value
    if (!popupElement) return

    const selection = popupElement.ownerDocument.getSelection()
    if (!selection || selection.isCollapsed) return

    const [anchorElement, focusElement] = selectionEndpointElements(selection)

    if (!contains(popupElement, anchorElement) && !contains(popupElement, focusElement)) {
      return
    }

    selection.removeAllRanges()
  }

  function syncSwipingState(swiping: boolean): void {
    setBackdropSwipingAttribute(dialog.backdropElement.value, swiping)
    if (!swiping && !drawer.parent.value) {
      finishNestedSwipe()
    }
  }

  function canStart(
    position: { x: number; y: number },
    details: { nativeEvent: PointerEvent | TouchEvent }
  ): boolean {
    const popupElement = dialog.popupElement.value
    if (!popupElement) return false

    const doc = popupElement.ownerDocument
    const elementAtPoint = getElementAtPoint(popupElement.ownerDocument, position.x, position.y)
    if (!elementAtPoint || !contains(popupElement, elementAtPoint)) {
      return false
    }

    const nativeEvent = details.nativeEvent
    const touchLike =
      'touches' in nativeEvent ||
      ('pointerType' in nativeEvent && nativeEvent.pointerType === 'touch')

    if (touchLike && shouldIgnoreSwipeForTextSelection(doc, popupElement)) {
      return false
    }

    return true
  }

  function applySwipeProgress(
    progress: number,
    details?: { direction?: SwipeDirection | undefined; deltaX: number; deltaY: number }
  ): void {
    updateNestedSwipeActive(details)

    const range = snapPointRange.value
    const popupHeight = drawer.popupHeight.value

    let resolvedProgress = progress
    if (range && popupHeight > 0) {
      const baseOffset = activeSnapPointOffset.value ?? range.minOffset
      if (details && Number.isFinite(details.deltaY)) {
        const nextOffset = clamp(baseOffset + details.deltaY, 0, popupHeight)
        resolvedProgress = clamp((nextOffset - range.minOffset) / range.range, 0, 1)
      } else if (snapPointProgress.value !== null) {
        resolvedProgress = snapPointProgress.value
      }
    }

    const parent = drawer.parent.value
    if (parent) {
      const nestedSwipeProgress = dialog.open.value ? resolvedProgress : 0
      parent.onNestedSwipeProgressChange(nestedSwipeProgress)

      if (nestedSwipeProgress <= 0) {
        finishNestedSwipe()
      }
    }

    applyProgress(resolvedProgress)
  }

  function startRelease(direction: SwipeDirection, details: ReleaseDetails): void {
    const popupElement = dialog.popupElement.value
    if (!popupElement) return

    finishNestedSwipe()

    popupElement.style.removeProperty('transition')
    drawer.swipeDismissed.value = true
    releasing.value = true
    releaseStrength.value = releaseScalar(direction, details)
  }

  function releaseWithoutSnapPoints(details: ReleaseDetails): boolean | undefined {
    const { deltaX, deltaY, direction, velocityX, velocityY } = details
    const element = dialog.popupElement.value
    if (!direction || !element) {
      clearRelease()
      return undefined
    }

    const directionalDelta = getDisplacement(direction, deltaX, deltaY)
    if (directionalDelta <= 0) {
      clearRelease()
      return false
    }

    if (getDisplacement(direction, velocityX, velocityY) >= FAST_SWIPE_VELOCITY) {
      startRelease(direction, details)
      return true
    }

    const shouldClose = directionalDelta > getBaseSwipeThreshold(element, direction)
    if (shouldClose) startRelease(direction, details)
    else clearRelease()
    return shouldClose
  }

  function releaseWithSnapPoints(details: ReleaseDetails): boolean | undefined {
    const { deltaY, velocityY, releaseVelocityY } = details
    const swipeDirection = drawer.swipeDirection.value
    const popupHeight = drawer.popupHeight.value
    const resolvedSnapPoints = snapPointsState.resolvedSnapPoints.value

    if (swipeDirection !== 'down' && swipeDirection !== 'up') {
      clearRelease()
      return undefined
    }
    if (!popupHeight) {
      clearRelease()
      return false
    }
    if (resolvedSnapPoints.length === 0) {
      clearRelease()
      return undefined
    }

    const dragDelta = swipeDirection === 'down' ? deltaY : -deltaY
    const dragDirection = Math.sign(dragDelta)
    const releaseDirectionalVelocity =
      swipeDirection === 'down' ? releaseVelocityY : -releaseVelocityY
    const fallbackDirectionalVelocity = swipeDirection === 'down' ? velocityY : -velocityY
    let resolvedDirectionalVelocity = releaseDirectionalVelocity
    if (dragDirection !== 0 && Math.abs(dragDelta) >= MIN_SWIPE_THRESHOLD) {
      const velocityDirection = Math.sign(resolvedDirectionalVelocity)
      if (velocityDirection !== 0 && velocityDirection !== dragDirection) {
        resolvedDirectionalVelocity = fallbackDirectionalVelocity
      }
    }

    const currentOffset = activeSnapPointOffset.value ?? 0
    const dragTargetOffset = clamp(currentOffset + dragDelta, 0, popupHeight)
    const velocityOffset =
      Math.abs(resolvedDirectionalVelocity) >= SNAP_VELOCITY_THRESHOLD
        ? clamp(resolvedDirectionalVelocity, -MAX_SNAP_VELOCITY, MAX_SNAP_VELOCITY) *
          SNAP_VELOCITY_MULTIPLIER
        : 0
    const targetOffset = drawer.snapToSequentialPoints.value
      ? dragTargetOffset
      : clamp(dragTargetOffset + velocityOffset, 0, popupHeight)

    const closeFromSnapPoints = (): true => {
      pendingCloseSnapPoint = drawer.activeSnapPoint.value
      drawer.setActiveSnapPoint(null)
      startRelease(swipeDirection, details)
      return true
    }

    if (drawer.snapToSequentialPoints.value) {
      const orderedSnapPoints = resolvedSnapPoints.toSorted(
        (first, second) => first.offset - second.offset
      )

      const currentIndex = findClosestSnapPoint(orderedSnapPoints, currentOffset).index
      let targetSnapPoint = findClosestSnapPoint(orderedSnapPoints, targetOffset).point

      const velocityDirection = Math.sign(resolvedDirectionalVelocity)
      const shouldAdvance =
        dragDirection !== 0 &&
        velocityDirection !== 0 &&
        velocityDirection === dragDirection &&
        Math.abs(resolvedDirectionalVelocity) >= SNAP_VELOCITY_THRESHOLD
      let effectiveTargetOffset = targetOffset

      if (shouldAdvance) {
        const adjacentIndex = clamp(currentIndex + dragDirection, 0, orderedSnapPoints.length - 1)
        if (adjacentIndex !== currentIndex) {
          const adjacentPoint = orderedSnapPoints[adjacentIndex]!
          const shouldForceAdjacent =
            dragDirection > 0
              ? targetOffset < adjacentPoint.offset
              : targetOffset > adjacentPoint.offset
          if (shouldForceAdjacent) {
            targetSnapPoint = adjacentPoint
            effectiveTargetOffset = adjacentPoint.offset
          }
        } else if (dragDirection > 0) {
          return closeFromSnapPoints()
        }
      }

      const closeDistance = Math.abs(effectiveTargetOffset - popupHeight)
      const snapDistance = Math.abs(effectiveTargetOffset - targetSnapPoint.offset)
      if (closeDistance < snapDistance) {
        return closeFromSnapPoints()
      }

      drawer.setActiveSnapPoint(targetSnapPoint.value)
      clearRelease()
      return false
    }

    if (resolvedDirectionalVelocity >= FAST_SWIPE_VELOCITY && dragDelta > 0) {
      return closeFromSnapPoints()
    }

    const closestSnapPoint = findClosestSnapPoint(resolvedSnapPoints, targetOffset).point
    const closestDistance = Math.abs(targetOffset - closestSnapPoint.offset)

    const closeDistance = Math.abs(targetOffset - popupHeight)
    if (closeDistance < closestDistance) {
      return closeFromSnapPoints()
    }

    drawer.setActiveSnapPoint(closestSnapPoint.value)
    clearRelease()
    return false
  }

  function settleSwipeRelease(details: ReleaseDetails): boolean | undefined {
    return hasSnapPoints.value ? releaseWithSnapPoints(details) : releaseWithoutSnapPoints(details)
  }

  function dismissDrawer(): void {
    provider?.setVisualState({ swipeProgress: 0, frontmostHeight: 0 })

    const backdropElement = dialog.backdropElement.value
    if (backdropElement) resetBackdropSwipeVars(backdropElement)

    dialog.setOpen(false, REASONS.swipe)

    if (dialog.open.value) {
      controlledDismissFrame.request(() => {
        if (dialog.open.value) {
          const savedSnapPoint = pendingCloseSnapPoint
          if (savedSnapPoint !== undefined) {
            drawer.setActiveSnapPoint(savedSnapPoint)
          }
          pendingCloseSnapPoint = undefined
          clearRelease()
          swipe.reset()
        } else {
          pendingCloseSnapPoint = undefined
        }
      })
      return
    }

    pendingCloseSnapPoint = undefined
    drawer.swipeDismissed.value = true
  }

  const swipe = useSwipeDismiss({
    enabled: () => dialog.mounted.value && !nestedDrawerOpen.value,
    directions: swipeDirections,
    element: dialog.popupElement,
    ignoreSelectorWhenTouch: false,
    ignoreScrollableAncestors: true,
    movementCssVars: {
      x: DRAWER_SWIPE_MOVEMENT_X_VAR,
      y: DRAWER_SWIPE_MOVEMENT_Y_VAR
    },
    onSwipeStart: () => clearTextSelection,
    onSwipingChange: () => syncSwipingState,
    swipeThreshold:
      () =>
      ({ element, direction }) =>
        getBaseSwipeThreshold(element, direction),
    canStart: () => canStart,
    onProgress: () => applySwipeProgress,
    onRelease: () => settleSwipeRelease,
    onDismiss: () => dismissDrawer
  })

  function processTouchMove(event: TouchEvent, scrollState: TouchScroll, touch: Touch): void {
    const rootElement = dialog.viewportElement.value ?? dialog.popupElement.value
    if (!rootElement) return
    const doc = rootElement.ownerDocument
    const verticalAxis = isVerticalScrollAxis.value

    // Avoid blocking pinch zoom or text selection adjustments on iOS Safari.
    if (event.touches.length === 2) return

    const drawerAxisDelta = verticalAxis
      ? touch.clientY - scrollState.lastY
      : touch.clientX - scrollState.lastX

    const allowTouchMove = shouldIgnoreSwipeForTextSelection(doc, rootElement)

    if (allowTouchMove || !dialog.open.value || !dialog.mounted.value || nestedDrawerOpen.value) {
      return
    }

    if (shouldYieldTouchMove(scrollState, event, touch, verticalAxis)) return

    const scrollTarget = scrollState.scrollTarget
    if (!scrollTarget || scrollTarget === doc.documentElement || scrollTarget === doc.body) {
      if (event.cancelable) event.preventDefault()
      // Claim the gesture before the framework's own touch handlers see it; dispatching the
      // move through them re-rasterizes the popup content on every frame.
      event.stopPropagation()
      swipe.move(event, rootElement)
      return
    }

    const axis = scrollAxis.value
    if (!hasScrollableContentOnAxis(scrollTarget, axis)) {
      if (event.cancelable) event.preventDefault()
      event.stopPropagation()
      return
    }

    if (drawerAxisDelta !== 0) {
      const canSwipeFromScrollEdge = canSwipeFromScrollEdgeOnMove(
        scrollTarget,
        axis,
        drawer.swipeDirection.value,
        drawerAxisDelta
      )

      if (!scrollState.allowSwipe) {
        if (event.cancelable && canSwipeFromScrollEdge) {
          scrollState.allowSwipe = true
          event.preventDefault()
        } else {
          scrollState.allowSwipe = false
        }
      } else if (event.cancelable) {
        event.preventDefault()
      }
    }

    if (scrollState.allowSwipe === true) {
      event.stopPropagation()
      swipe.move(event, rootElement)
    }
  }

  function ontouchmove(event: TouchEvent): void {
    if (ignoreTouchSwipe) return

    const scrollState = touchScroll
    const touch = event.touches[0]
    if (!touch || !scrollState) return

    processTouchMove(event, scrollState, touch)
    updateTouchScrollPosition(scrollState, touch)
  }

  function startPointerSwipe(event: PointerEvent, root: Node): void {
    lastPointerType = event.pointerType
    ignoreNextTouchStartFromPen = event.pointerType === 'pen'

    if (!dialog.open.value || !dialog.mounted.value || nestedDrawerOpen.value) return

    const elementAtPoint = getElementAtPoint(root, event.clientX, event.clientY)
    if (isSwipeIgnoredTarget(elementAtPoint) || isDrawerContentTarget(elementAtPoint)) {
      return
    }

    if (event.pointerType === 'touch') return

    swipe.start(event)
  }

  function endPointerSwipe(event: PointerEvent): void {
    lastPointerType = ''
    if (event.pointerType === 'touch') return
    swipe.end(event)
  }

  function startTouchSwipe(event: TouchEvent, root: Node): void {
    if (lastPointerType === 'pen' && ignoreNextTouchStartFromPen) {
      ignoreNextTouchStartFromPen = false
      ignoreTouchSwipe = false
      touchScroll = null
      return
    }

    if (!dialog.open.value || !dialog.mounted.value || nestedDrawerOpen.value) {
      ignoreTouchSwipe = false
      touchScroll = null
      return
    }

    const touch = event.touches[0]
    if (!touch) return

    if (isEventOnRangeInput(event)) {
      ignoreTouchSwipe = false
      touchScroll = null
      return
    }

    const elementAtPoint = getElementAtPoint(root, touch.clientX, touch.clientY)
    ignoreTouchSwipe = isSwipeIgnoredTarget(elementAtPoint)
    if (ignoreTouchSwipe) {
      touchScroll = null
      return
    }

    const rootElement = dialog.viewportElement.value ?? dialog.popupElement.value
    const eventTarget = getTarget(event)
    const target = isElement(eventTarget) ? eventTarget : null
    if (rootElement && target && !contains(rootElement, target)) {
      ignoreTouchSwipe = true
      touchScroll = null
      return
    }

    const axis = scrollAxis.value
    let scrollTarget: HTMLElement | null = null
    let hasCrossAxisScrollableContent = false
    if (rootElement && target) {
      scrollTarget = findScrollableTouchTarget(target, rootElement, axis)
      hasCrossAxisScrollableContent =
        findScrollableTouchTarget(
          target,
          rootElement,
          isVerticalScrollAxis.value ? 'horizontal' : 'vertical'
        ) != null
    }

    let allowSwipe: boolean | null = null
    if (scrollTarget) {
      const canSwipeFromEdge = isAtSwipeStartEdge(scrollTarget, axis, drawer.swipeDirection.value)
      allowSwipe = canSwipeFromEdge ? null : false
    }

    touchScroll = {
      startX: touch.clientX,
      startY: touch.clientY,
      lastX: touch.clientX,
      lastY: touch.clientY,
      scrollTarget,
      hasCrossAxisScrollableContent,
      allowSwipe,
      preserveNativeCrossAxisScroll: false,
      drawerAxisAttributed: false
    }

    swipe.start(event)
  }

  function endTouchSwipe(event: TouchEvent): void {
    ignoreTouchSwipe = false
    touchScroll = null
    lastPointerType = ''
    ignoreNextTouchStartFromPen = false
    swipe.end(event)
  }

  watch(
    () => dialog.viewportElement.value,
    (node) => {
      if (!node) return

      const cleanups = [
        listen(node, 'pointerdown', (event: PointerEvent) =>
          startPointerSwipe(event, node.ownerDocument)
        ),
        listen(node, 'pointermove', (event: PointerEvent) => {
          if (event.pointerType === 'touch') return
          swipe.move(event, node)
        }),
        listen(node, 'pointerup', endPointerSwipe),
        listen(node, 'pointercancel', endPointerSwipe),
        listen(node, 'touchstart', (event: TouchEvent) =>
          startTouchSwipe(event, node.ownerDocument)
        ),
        listen(node, 'touchend', endTouchSwipe),
        listen(node, 'touchcancel', endTouchSwipe)
      ]

      onWatcherCleanup(() => {
        for (const cleanup of cleanups) cleanup()
      })
    },
    { immediate: true, flush: 'sync' }
  )

  watch(
    () => dialog.viewportElement.value ?? dialog.popupElement.value,
    (rootElement) => {
      if (!rootElement) return
      onWatcherCleanup(
        listen(rootElement.ownerDocument, 'touchmove', ontouchmove, {
          passive: false,
          capture: true
        })
      )
    },
    { immediate: true, flush: 'sync' }
  )

  watchPostEffect(() => {
    if (!snapPointRange.value || swipe.swiping.value) return
    applyProgress(!dialog.open.value || dialog.nested.value ? 0 : (snapPointProgress.value ?? 0))
  })

  watchPostEffect(() => {
    if (dialog.open.value) {
      if (!drawer.swipeAreaActive.value) swipe.reset()
      clearRelease()
    }
  })

  watchPostEffect(() => {
    const parent = drawer.parent.value
    if (!parent) return
    if (!dialog.open.value) {
      parent.onNestedSwipeProgressChange(0)
    }
    onWatcherCleanup(() => {
      parent.onNestedSwipeProgressChange(0)
    })
  })

  let observedBackdrop: HTMLElement | null = null
  watchPostEffect(() => {
    observedBackdrop = dialog.backdropElement.value
  })

  onScopeDispose(() => {
    provider?.setVisualState({ swipeProgress: 0, frontmostHeight: 0 })
    setBackdropSwipingAttribute(observedBackdrop, false)
    const currentBackdrop = dialog.backdropElement.value
    if (currentBackdrop !== observedBackdrop) {
      setBackdropSwipingAttribute(currentBackdrop, false)
    }
    finishNestedSwipe()
  })

  return {
    swiping: swipe.swiping,
    swipeStrength: releaseStrength,
    releasing,
    dragStyles: swipe.dragStyles,
    activeSnapPointOffset
  }
}
