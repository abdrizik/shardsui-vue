import { isElement, isHTMLElement } from '@floating-ui/utils/dom'
import { computed, shallowRef, toValue, type MaybeRefOrGetter } from 'vue'
import { clamp } from './clamp'
import { contains, getTarget } from './dom'
import { getElementAtPoint } from './get-element-at-point'
import { findScrollableTouchTarget, hasScrollableAncestor, type ScrollAxis } from './scrollable'

export function safelyChangePointerCapture(
  element: HTMLElement,
  pointerId: number,
  method: 'setPointerCapture' | 'releasePointerCapture'
) {
  if (typeof element[method] !== 'function') return

  try {
    element[method](pointerId)
  } catch (error) {
    if (!(error instanceof DOMException) || error.name !== 'NotFoundError') throw error
  }
}

export type SwipeDirection = 'up' | 'down' | 'left' | 'right'

type SwipeDismissDetails = {
  nativeEvent: PointerEvent | TouchEvent
  direction: SwipeDirection | undefined
}

type SwipeDismissProgressDetails = {
  deltaX: number
  deltaY: number
  direction: SwipeDirection | undefined
}

type SwipeDismissReleaseDetails = {
  event: PointerEvent | TouchEvent
  direction: SwipeDirection | undefined
  deltaX: number
  deltaY: number
  velocityX: number
  velocityY: number
  releaseVelocityX: number
  releaseVelocityY: number
}

type SwipeDismissOptions = {
  enabled: MaybeRefOrGetter<boolean>
  directions: MaybeRefOrGetter<SwipeDirection[]>
  element: MaybeRefOrGetter<HTMLElement | null>
  movementCssVars: MaybeRefOrGetter<{ x: string; y: string }>
  swipeThreshold?: () =>
    | ((details: { element: HTMLElement; direction: SwipeDirection }) => number)
    | undefined
  canStart?: () =>
    | ((position: { x: number; y: number }, details: SwipeDismissDetails) => boolean)
    | undefined
  ignoreScrollableAncestors?: MaybeRefOrGetter<boolean | undefined>
  ignoreSelectorWhenTouch?: MaybeRefOrGetter<boolean | undefined>
  trackDrag?: MaybeRefOrGetter<boolean | undefined>
  onSwipeStart?: () => ((event: PointerEvent | TouchEvent) => void) | undefined
  onProgress?: () => ((progress: number, details?: SwipeDismissProgressDetails) => void) | undefined
  onCancel?: () => ((event: PointerEvent | TouchEvent) => void) | undefined
  onSwipingChange?: () => ((swiping: boolean) => void) | undefined
  onRelease?: () => ((details: SwipeDismissReleaseDetails) => boolean | void) | undefined
  onDismiss?: () =>
    | ((event: PointerEvent | TouchEvent, details: { direction: SwipeDirection }) => void)
    | undefined
}

type Point = { x: number; y: number }
type LockedAxis = 'horizontal' | 'vertical' | null

const DEFAULT_SWIPE_THRESHOLD = 40
const REVERSE_CANCEL_THRESHOLD = 10
const MIN_DRAG_THRESHOLD = 1

const MIN_VELOCITY_DURATION_MS = 50
const MIN_RELEASE_VELOCITY_DURATION_MS = 16
const MAX_RELEASE_VELOCITY_AGE_MS = 80
const DEFAULT_IGNORE_SELECTOR = 'button,a,input,select,textarea,label,[role="button"]'

export function getDisplacement(
  direction: SwipeDirection | undefined,
  deltaX: number,
  deltaY: number
): number {
  switch (direction) {
    case 'up':
      return -deltaY
    case 'down':
      return deltaY
    case 'left':
      return -deltaX
    case 'right':
      return deltaX
    default:
      return 0
  }
}

export function getElementTransform(element: HTMLElement): {
  x: number
  y: number
  scale: number
} {
  const win = element.ownerDocument.defaultView ?? window
  const computedStyle = win.getComputedStyle(element)
  const transform = computedStyle.transform
  let translateX = 0
  let translateY = 0
  let scale = 1

  if (transform && transform !== 'none') {
    const matrix = transform.match(/matrix(?:3d)?\(([^)]+)\)/)
    if (matrix) {
      const values = matrix[1].split(', ').map(parseFloat)
      if (values.length === 6) {
        translateX = values[4]
        translateY = values[5]
        scale = Math.sqrt(values[0] * values[0] + values[1] * values[1])
      } else if (values.length === 16) {
        translateX = values[12]
        translateY = values[13]
        scale = values[0]
      }
    }
  }

  return { x: translateX, y: translateY, scale }
}

function getValidTimeStamp(timeStamp: number): number | null {
  return Number.isFinite(timeStamp) && timeStamp > 0 ? timeStamp : null
}

function hasPrimaryMouseButton(buttons: number): boolean {
  // `buttons` is a bitmask and the primary button is bit 0.
  return buttons % 2 === 1
}

function ownerDocumentOf(element: Element | null): Document {
  return element?.ownerDocument ?? document
}

function getPrimaryPointerPosition(event: PointerEvent | TouchEvent): Point | null {
  if ('touches' in event) {
    const touch = event.touches[0]
    return touch ? { x: touch.clientX, y: touch.clientY } : null
  }
  return { x: event.clientX, y: event.clientY }
}

function isTouchLikeEvent(event: PointerEvent | TouchEvent): boolean {
  if ('touches' in event) return true
  return event.pointerType === 'touch'
}

function signedSqrt(value: number): number {
  return value >= 0 ? Math.sqrt(value) : -Math.sqrt(-value)
}

function dampAxis(delta: number, allowNegative: boolean, allowPositive: boolean): number {
  if (!allowNegative && delta < 0) return signedSqrt(delta)
  if (!allowPositive && delta > 0) return signedSqrt(delta)
  return delta
}

export function useSwipeDismiss(options: SwipeDismissOptions) {
  const swiping = shallowRef(false)
  const direction = shallowRef<SwipeDirection | undefined>(undefined)

  const dragOffset = shallowRef<Point>({ x: 0, y: 0 })
  const initialTransform = shallowRef<{ x: number; y: number; scale: number }>({
    x: 0,
    y: 0,
    scale: 1
  })

  let isRealSwipe = false
  let lockedAxis: LockedAxis = null
  let dragStartPos: Point = { x: 0, y: 0 }
  let dragOffsetCurrent: Point = { x: 0, y: 0 }
  let lastMovePos: Point | null = null
  let intendedSwipeDirection: SwipeDirection | undefined
  let maxSwipeDisplacement = 0
  let cancelledSwipe = false
  let swipeCancelBaseline: Point = { x: 0, y: 0 }
  let isFirstPointerMove = false
  let pendingSwipeStartPos: Point | null = null
  let swipeFromScrollable = false
  let sawPrimaryButtonsOnMove = false
  let elementSize = { width: 0, height: 0 }
  let swipeProgress = 0
  let swipeThresholdValue = DEFAULT_SWIPE_THRESHOLD
  let swipeStartTime: number | null = null
  let lastDragSample: { x: number; y: number; time: number } | null = null
  let lastDragVelocity = { x: 0, y: 0 }
  let lastProgressDetails: SwipeDismissProgressDetails | null = null
  // Untracked mirror of `swiping`: `reset()` runs inside a consumer watcher, so reading the ref
  // there would subscribe that watcher to it and every `swiping` write would re-run the watcher
  // and reset the gesture.
  let swipingUntracked = false

  const enabled = computed(() => toValue(options.enabled))
  const directions = computed(() => toValue(options.directions))
  const element = computed(() => toValue(options.element))
  const movementCssVars = computed(() => toValue(options.movementCssVars))
  const ignoreSelectorWhenTouch = computed(() => toValue(options.ignoreSelectorWhenTouch) ?? true)
  const ignoreScrollableAncestors = computed(
    () => toValue(options.ignoreScrollableAncestors) ?? false
  )
  const trackDrag = computed(() => toValue(options.trackDrag) ?? true)

  const directionsState = computed(() => {
    const allowed = directions.value
    const allowLeft = allowed.includes('left')
    const allowRight = allowed.includes('right')
    const allowUp = allowed.includes('up')
    const allowDown = allowed.includes('down')
    const hasHorizontal = allowLeft || allowRight
    const hasVertical = allowUp || allowDown
    const primaryDirection = allowed.length === 1 ? allowed[0] : undefined
    const scrollAxes: ScrollAxis[] = []
    if (hasVertical) scrollAxes.push('vertical')
    if (hasHorizontal) scrollAxes.push('horizontal')
    return {
      allowLeft,
      allowRight,
      allowUp,
      allowDown,
      hasHorizontal,
      hasVertical,
      primaryDirection,
      scrollAxes
    }
  })

  const dragStyles = computed((): Record<string, string> => {
    const cssVars = movementCssVars.value
    const offset = trackDrag.value ? dragOffset.value : dragOffsetCurrent
    const transform = initialTransform.value

    const styles: Record<string, string> = {}

    if (swiping.value) {
      styles.transition = 'none'
      styles.transform = `translate3d(${offset.x}px,${offset.y}px,0) scale(${transform.scale})`
    }
    styles[cssVars.x] = `${offset.x - transform.x}px`
    styles[cssVars.y] = `${offset.y - transform.y}px`
    return styles
  })

  function setSwiping(nextSwiping: boolean) {
    if (swipingUntracked === nextSwiping) return
    swipingUntracked = nextSwiping
    swiping.value = nextSwiping
    options.onSwipingChange?.()?.(nextSwiping)
  }

  function resolveSwipeThreshold(swipeDirection: SwipeDirection | undefined) {
    if (!swipeDirection) return

    const swipeThreshold = options.swipeThreshold?.()
    if (!swipeThreshold) {
      swipeThresholdValue = DEFAULT_SWIPE_THRESHOLD
      return
    }

    const el = element.value
    if (!el) return

    const value = swipeThreshold({ element: el, direction: swipeDirection })
    swipeThresholdValue = Math.max(0, value)
  }

  function updateSwipeProgress(progress: number, details?: SwipeDismissProgressDetails) {
    const nextProgress = Number.isFinite(progress) ? clamp(progress, 0, 1) : 0
    const progressChanged = nextProgress !== swipeProgress
    let detailsChanged = false

    if (details) {
      const last = lastProgressDetails
      detailsChanged =
        !last ||
        last.deltaX !== details.deltaX ||
        last.deltaY !== details.deltaY ||
        last.direction !== details.direction
    }

    if (!progressChanged && !detailsChanged) return

    swipeProgress = nextProgress
    if (details) {
      lastProgressDetails = details
    } else if (progressChanged) {
      lastProgressDetails = null
    }
    options.onProgress?.()?.(nextProgress, details)
  }

  function recordDragSample(offset: Point, timeStamp: number | null) {
    if (timeStamp === null) return

    const last = lastDragSample
    if (last && timeStamp > last.time) {
      const durationMs = Math.max(timeStamp - last.time, MIN_RELEASE_VELOCITY_DURATION_MS)
      lastDragVelocity = {
        x: (offset.x - last.x) / durationMs,
        y: (offset.y - last.y) / durationMs
      }
    }

    lastDragSample = { x: offset.x, y: offset.y, time: timeStamp }
  }

  const reset = () => {
    direction.value = undefined
    setSwiping(false)
    isRealSwipe = false
    dragOffset.value = { x: 0, y: 0 }
    initialTransform.value = { x: 0, y: 0, scale: 1 }
    lockedAxis = null
    updateSwipeProgress(0)

    swipeThresholdValue = DEFAULT_SWIPE_THRESHOLD
    dragStartPos = { x: 0, y: 0 }
    dragOffsetCurrent = { x: 0, y: 0 }
    intendedSwipeDirection = undefined
    maxSwipeDisplacement = 0
    cancelledSwipe = false
    swipeCancelBaseline = { x: 0, y: 0 }
    isFirstPointerMove = false
    lastMovePos = null
    pendingSwipeStartPos = null
    swipeFromScrollable = false
    sawPrimaryButtonsOnMove = false
    elementSize = { width: 0, height: 0 }
    swipeStartTime = null
    lastDragSample = null
    lastDragVelocity = { x: 0, y: 0 }
    lastProgressDetails = null
  }

  function getTargetAtPoint(position: Point, nativeEvent: Event): Element | null {
    const target =
      getElementAtPoint(element.value?.ownerDocument, position.x, position.y) ??
      getTarget(nativeEvent)
    return isElement(target) ? target : null
  }

  function findGestureScrollableTouchTarget(
    target: EventTarget | null,
    root: HTMLElement
  ): HTMLElement | null {
    const { hasHorizontal, hasVertical } = directionsState.value
    if (hasHorizontal && !hasVertical) {
      return findScrollableTouchTarget(target, root, 'horizontal')
    }
    if (hasVertical && !hasHorizontal) {
      return findScrollableTouchTarget(target, root, 'vertical')
    }
    return (
      findScrollableTouchTarget(target, root, 'vertical') ??
      findScrollableTouchTarget(target, root, 'horizontal')
    )
  }

  function startSwipeAtPosition(
    event: PointerEvent | TouchEvent,
    position: Point,
    ignoreScrollable = false
  ): boolean {
    const el = element.value
    swipeFromScrollable = false
    const touchLike = isTouchLikeEvent(event)
    const target = getTargetAtPoint(position, event)

    const doc = ownerDocumentOf(el)
    const body = doc.body

    const scrollableTarget =
      touchLike && body ? findGestureScrollableTouchTarget(target, body) : null
    if (scrollableTarget && !ignoreScrollable) {
      return false
    }
    swipeFromScrollable = Boolean(scrollableTarget && ignoreScrollable)

    const isInteractiveElement = target ? target.closest(DEFAULT_IGNORE_SELECTOR) : false
    if (isInteractiveElement && (!touchLike || ignoreSelectorWhenTouch.value)) {
      return false
    }

    const { primaryDirection, scrollAxes } = directionsState.value
    if (ignoreScrollableAncestors.value && el && isHTMLElement(target) && scrollAxes.length > 0) {
      if (!ignoreScrollable && hasScrollableAncestor(target, el, scrollAxes)) {
        return false
      }
    }

    cancelledSwipe = false
    intendedSwipeDirection = undefined
    maxSwipeDisplacement = 0

    dragStartPos = position
    swipeStartTime = getValidTimeStamp(event.timeStamp)
    swipeCancelBaseline = position
    lastMovePos = position

    if (el) {
      elementSize = { width: el.offsetWidth, height: el.offsetHeight }
      resolveSwipeThreshold(primaryDirection)
      const transform = getElementTransform(el)
      initialTransform.value = transform
      dragOffsetCurrent = { x: transform.x, y: transform.y }
      dragOffset.value = { x: transform.x, y: transform.y }
      recordDragSample({ x: transform.x, y: transform.y }, swipeStartTime)

      if (!('touches' in event)) {
        safelyChangePointerCapture(el, event.pointerId, 'setPointerCapture')
      }
    }

    options.onSwipeStart?.()?.(event)

    setSwiping(true)
    isRealSwipe = false
    lockedAxis = null
    isFirstPointerMove = true
    updateSwipeProgress(0)

    return true
  }

  function resetPendingSwipeState() {
    pendingSwipeStartPos = null
    swipeFromScrollable = false
    lastMovePos = null
  }

  function cancelSwipeInteraction(event: PointerEvent) {
    resetPendingSwipeState()

    if (!swipingUntracked) return

    setSwiping(false)
    isRealSwipe = false
    lockedAxis = null

    const { x, y } = initialTransform.value
    dragOffsetCurrent = { x, y }
    dragOffset.value = { x, y }
    direction.value = undefined
    sawPrimaryButtonsOnMove = false

    const el = element.value
    if (el) {
      safelyChangePointerCapture(el, event.pointerId, 'releasePointerCapture')
    }

    updateSwipeProgress(0, {
      deltaX: 0,
      deltaY: 0,
      direction: undefined
    })

    options.onCancel?.()?.(event)
  }

  function applyDirectionalDamping(deltaX: number, deltaY: number) {
    const { allowLeft, allowRight, allowUp, allowDown, hasHorizontal, hasVertical } =
      directionsState.value

    return {
      x: hasHorizontal ? dampAxis(deltaX, allowLeft, allowRight) : signedSqrt(deltaX),
      y: hasVertical ? dampAxis(deltaY, allowUp, allowDown) : signedSqrt(deltaY)
    }
  }

  function canSwipeFromScrollEdgeOnPendingMove(
    scrollTarget: HTMLElement,
    deltaX: number,
    deltaY: number
  ): boolean | null {
    const { allowDown, allowLeft, allowRight, allowUp, hasHorizontal, hasVertical } =
      directionsState.value
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    const useVerticalAxis =
      hasVertical && deltaY !== 0 && (!hasHorizontal || absDeltaY >= absDeltaX)

    if (useVerticalAxis) {
      const maxScrollTop = Math.max(0, scrollTarget.scrollHeight - scrollTarget.clientHeight)
      const atTop = scrollTarget.scrollTop <= 0
      const atBottom = scrollTarget.scrollTop >= maxScrollTop
      const movingDown = deltaY > 0
      const movingUp = deltaY < 0
      const canSwipeDown = movingDown && atTop && allowDown
      const canSwipeUp = movingUp && atBottom && allowUp
      return canSwipeDown || canSwipeUp
    }

    const useHorizontalAxis =
      hasHorizontal && deltaX !== 0 && (!hasVertical || absDeltaX > absDeltaY)
    if (useHorizontalAxis) {
      const maxScrollLeft = Math.max(0, scrollTarget.scrollWidth - scrollTarget.clientWidth)
      const atLeft = scrollTarget.scrollLeft <= 0
      const atRight = scrollTarget.scrollLeft >= maxScrollLeft
      const movingRight = deltaX > 0
      const movingLeft = deltaX < 0
      const canSwipeRight = movingRight && atLeft && allowRight
      const canSwipeLeft = movingLeft && atRight && allowLeft
      return canSwipeRight || canSwipeLeft
    }

    return null
  }

  const start = (event: PointerEvent | TouchEvent) => {
    if (!enabled.value) return
    if (event.defaultPrevented) return

    if (!('touches' in event) && event.button !== 0) return

    const startPos = getPrimaryPointerPosition(event)
    if (!startPos) return

    pendingSwipeStartPos = startPos
    swipeFromScrollable = false
    sawPrimaryButtonsOnMove = !('touches' in event)

    const canStart = options.canStart?.()
    if (
      canStart &&
      !canStart(startPos, {
        nativeEvent: event,
        direction: directionsState.value.primaryDirection
      })
    ) {
      return
    }

    if (startSwipeAtPosition(event, startPos)) {
      pendingSwipeStartPos = null
    }
  }

  function updateCancelBaseline(position: Point, movement: Point) {
    const baseline = swipeCancelBaseline
    const reversedX =
      (movement.x < 0 && position.x > baseline.x) || (movement.x > 0 && position.x < baseline.x)
    const reversedY =
      (movement.y < 0 && position.y > baseline.y) || (movement.y > 0 && position.y < baseline.y)

    swipeCancelBaseline = {
      x: reversedX ? position.x : baseline.x,
      y: reversedY ? position.y : baseline.y
    }
  }

  function lockAxisOnFirstRealSwipe(deltaX: number, deltaY: number) {
    if (isRealSwipe || Math.hypot(deltaX, deltaY) < MIN_DRAG_THRESHOLD) return

    isRealSwipe = true

    const { hasHorizontal, hasVertical } = directionsState.value
    if (hasHorizontal && hasVertical) {
      lockedAxis = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical'
    }
  }

  function adoptIntendedDirection(axis: LockedAxis, deltaX: number, deltaY: number) {
    const { allowLeft, allowRight, allowUp, allowDown } = directionsState.value

    let candidate: SwipeDirection | undefined
    if (axis === 'vertical') {
      if (deltaY !== 0) candidate = deltaY > 0 ? 'down' : 'up'
    } else if (axis === 'horizontal') {
      if (deltaX !== 0) candidate = deltaX > 0 ? 'right' : 'left'
    } else if (Math.abs(deltaX) >= Math.abs(deltaY)) {
      candidate = deltaX > 0 ? 'right' : 'left'
    } else {
      candidate = deltaY > 0 ? 'down' : 'up'
    }

    if (!candidate) return

    const isAllowed =
      (candidate === 'left' && allowLeft) ||
      (candidate === 'right' && allowRight) ||
      (candidate === 'up' && allowUp) ||
      (candidate === 'down' && allowDown)
    if (!isAllowed) return

    intendedSwipeDirection = candidate
    maxSwipeDisplacement = getDisplacement(candidate, deltaX, deltaY)
    direction.value = candidate
    resolveSwipeThreshold(candidate)
  }

  function updateReverseCancellation(cancelDeltaX: number, cancelDeltaY: number) {
    const { allowLeft, allowRight, allowUp, allowDown } = directionsState.value
    const intended = intendedSwipeDirection
    const displacement = getDisplacement(intended, cancelDeltaX, cancelDeltaY)

    if (displacement > swipeThresholdValue) {
      cancelledSwipe = false
      direction.value = intended
      return
    }

    if (
      !(allowLeft && allowRight) &&
      !(allowUp && allowDown) &&
      maxSwipeDisplacement - displacement >= REVERSE_CANCEL_THRESHOLD
    ) {
      cancelledSwipe = true
    }
  }

  function applyDragOffset(deltaX: number, deltaY: number, axis: LockedAxis): Point {
    const { hasHorizontal, hasVertical } = directionsState.value
    const damped = applyDirectionalDamping(deltaX, deltaY)
    const transform = initialTransform.value

    const offsetX = transform.x + (hasHorizontal && axis !== 'vertical' ? damped.x : 0)
    const offsetY = transform.y + (hasVertical && axis !== 'horizontal' ? damped.y : 0)

    dragOffsetCurrent = { x: offsetX, y: offsetY }
    if (trackDrag.value) {
      dragOffset.value = { x: offsetX, y: offsetY }
    }

    return { x: offsetX, y: offsetY }
  }

  function computeSwipeProgress(offset: Point): number {
    const swipeDirection = directionsState.value.primaryDirection ?? intendedSwipeDirection
    if (!swipeDirection) return 0

    const size =
      swipeDirection === 'left' || swipeDirection === 'right'
        ? elementSize.width
        : elementSize.height
    const scale = initialTransform.value.scale || 1
    if (size <= 0 || scale <= 0) return 0

    const displacement = getDisplacement(
      swipeDirection,
      offset.x - initialTransform.value.x,
      offset.y - initialTransform.value.y
    )
    return displacement > 0 ? displacement / (size * scale) : 0
  }

  function moveCore(
    event: PointerEvent | TouchEvent,
    boundaryElement: HTMLElement,
    position: Point,
    movement: Point
  ) {
    if (!enabled.value || !swipingUntracked) return

    if (isTouchLikeEvent(event) && !swipeFromScrollable) {
      const target = getTarget(event)
      if (findGestureScrollableTouchTarget(target, boundaryElement)) {
        return
      }
    }

    if (!('touches' in event)) {
      // Prevent text selection on Safari
      event.preventDefault()
    }

    if (isFirstPointerMove) {
      isFirstPointerMove = false
      // Accounts for the delay between pointerdown and the first pointermove on iOS.
      if (trackDrag.value) {
        dragStartPos = position
        const moveTime = getValidTimeStamp(event.timeStamp)
        if (moveTime !== null) {
          swipeStartTime = moveTime
        }
      }
    }

    updateCancelBaseline(position, movement)

    const deltaX = position.x - dragStartPos.x
    const deltaY = position.y - dragStartPos.y

    lockAxisOnFirstRealSwipe(deltaX, deltaY)
    const axis = lockedAxis

    if (intendedSwipeDirection) {
      updateReverseCancellation(
        position.x - swipeCancelBaseline.x,
        position.y - swipeCancelBaseline.y
      )
    } else {
      adoptIntendedDirection(axis, deltaX, deltaY)
    }

    const offset = applyDragOffset(deltaX, deltaY, axis)
    recordDragSample(offset, getValidTimeStamp(event.timeStamp))
    updateSwipeProgress(computeSwipeProgress(offset), {
      deltaX: offset.x - initialTransform.value.x,
      deltaY: offset.y - initialTransform.value.y,
      direction: intendedSwipeDirection
    })
  }

  function handlePendingSwipeMove(event: PointerEvent | TouchEvent, position: Point): boolean {
    if (!isTouchLikeEvent(event) && event.defaultPrevented) {
      resetPendingSwipeState()
      return true
    }

    const canStart = options.canStart?.()
    if (
      canStart &&
      !canStart(position, {
        nativeEvent: event,
        direction: directionsState.value.primaryDirection
      })
    ) {
      return false
    }

    const pendingStartPos = pendingSwipeStartPos
    const el = element.value
    let ignoreScrollableOnStart = false

    if (isTouchLikeEvent(event) && pendingStartPos && el) {
      const target = getTargetAtPoint(position, event)
      const body = ownerDocumentOf(el).body
      const scrollTarget = body ? findGestureScrollableTouchTarget(target, body) : null

      if (scrollTarget && (contains(el, scrollTarget) || contains(scrollTarget, el))) {
        const canSwipeFromEdge = canSwipeFromScrollEdgeOnPendingMove(
          scrollTarget,
          position.x - pendingStartPos.x,
          position.y - pendingStartPos.y
        )

        if (canSwipeFromEdge === false) return true
        if (canSwipeFromEdge === true) ignoreScrollableOnStart = true
      }
    }

    const started = startSwipeAtPosition(event, position, ignoreScrollableOnStart)
    if (!started) return false

    pendingSwipeStartPos = null

    if (pendingStartPos && ignoreScrollableOnStart) {
      dragStartPos = pendingStartPos
      swipeCancelBaseline = pendingStartPos
      lastMovePos = pendingStartPos
      isFirstPointerMove = false
    } else {
      swipeFromScrollable = false
    }

    return false
  }

  const move = (event: PointerEvent | TouchEvent, boundaryElement: HTMLElement) => {
    if (!enabled.value) return

    const currentPos = getPrimaryPointerPosition(event)
    if (!currentPos) return

    let endAfterMove = false

    if (!('touches' in event)) {
      const hasPrimary = hasPrimaryMouseButton(event.buttons)
      if (hasPrimary) {
        sawPrimaryButtonsOnMove = true
      }

      if (event.buttons !== 0 && !hasPrimary) {
        cancelSwipeInteraction(event)
        return
      }

      if (event.buttons === 0 && sawPrimaryButtonsOnMove) {
        if (!swipingUntracked) {
          end(event)
          return
        }
        endAfterMove = true
      }
    }

    if (!swiping.value && pendingSwipeStartPos !== null) {
      const shouldIgnoreMove = handlePendingSwipeMove(event, currentPos)
      if (shouldIgnoreMove) return
    }

    const previousPos = lastMovePos
    const movement =
      previousPos === null
        ? { x: 0, y: 0 }
        : { x: currentPos.x - previousPos.x, y: currentPos.y - previousPos.y }

    lastMovePos = currentPos
    moveCore(event, boundaryElement, currentPos, movement)

    // The `'touches'` guard re-narrows the event type for `end`.
    if (endAfterMove && !('touches' in event)) {
      end(event)
    }
  }

  function resolveVelocities(
    deltaX: number,
    deltaY: number,
    offset: Point,
    endTime: number | null
  ) {
    const startTime = swipeStartTime
    const durationMs =
      startTime !== null && endTime !== null && endTime > startTime ? endTime - startTime : 0
    const velocityDurationMs = durationMs > 0 ? Math.max(durationMs, MIN_VELOCITY_DURATION_MS) : 0

    let releaseVelocityX = lastDragVelocity.x
    let releaseVelocityY = lastDragVelocity.y

    const lastSample = lastDragSample
    if (lastSample && endTime !== null && endTime >= lastSample.time) {
      const ageMs = endTime - lastSample.time
      if (ageMs > MAX_RELEASE_VELOCITY_AGE_MS) {
        releaseVelocityX = 0
        releaseVelocityY = 0
      } else {
        const sampleDurationMs = Math.max(ageMs, MIN_RELEASE_VELOCITY_DURATION_MS)
        const sampleVelocityX = (offset.x - lastSample.x) / sampleDurationMs
        const sampleVelocityY = (offset.y - lastSample.y) / sampleDurationMs
        if (sampleVelocityX !== 0) releaseVelocityX = sampleVelocityX
        if (sampleVelocityY !== 0) releaseVelocityY = sampleVelocityY
      }
    }

    return {
      velocityX: velocityDurationMs > 0 ? deltaX / velocityDurationMs : 0,
      velocityY: velocityDurationMs > 0 ? deltaY / velocityDurationMs : 0,
      releaseVelocityX,
      releaseVelocityY
    }
  }

  function findDismissedDirection(deltaX: number, deltaY: number): SwipeDirection | undefined {
    const threshold = swipeThresholdValue
    return directions.value.find(
      (candidate) => getDisplacement(candidate, deltaX, deltaY) > threshold
    )
  }

  const end = (event: PointerEvent | TouchEvent) => {
    if (!enabled.value) return

    const { primaryDirection } = directionsState.value

    const offset = dragOffsetCurrent
    const transform = initialTransform.value
    const releaseDeltaX = offset.x - transform.x
    const releaseDeltaY = offset.y - transform.y
    const progressDetails: SwipeDismissProgressDetails = {
      deltaX: releaseDeltaX,
      deltaY: releaseDeltaY,
      direction: direction.value ?? intendedSwipeDirection
    }
    const snapBack = () => {
      dragOffsetCurrent = { x: transform.x, y: transform.y }
      dragOffset.value = { x: transform.x, y: transform.y }
      direction.value = undefined
      updateSwipeProgress(0, progressDetails)
    }

    if (!swipingUntracked) {
      resetPendingSwipeState()
      updateSwipeProgress(0, progressDetails)
      return
    }

    setSwiping(false)
    isRealSwipe = false
    lockedAxis = null
    resetPendingSwipeState()
    sawPrimaryButtonsOnMove = false

    const el = element.value
    if (el && !('touches' in event)) {
      safelyChangePointerCapture(el, event.pointerId, 'releasePointerCapture')
    }

    const releaseDecision = options.onRelease?.()?.({
      event,
      direction: direction.value ?? intendedSwipeDirection,
      deltaX: releaseDeltaX,
      deltaY: releaseDeltaY,
      ...resolveVelocities(releaseDeltaX, releaseDeltaY, offset, getValidTimeStamp(event.timeStamp))
    })
    const hasReleaseDecision = typeof releaseDecision === 'boolean'

    const cancelled = cancelledSwipe || event.type === 'pointercancel'

    if (cancelled && !hasReleaseDecision) {
      snapBack()
      return
    }

    const dismissDirection = hasReleaseDecision
      ? releaseDecision
        ? (direction.value ?? intendedSwipeDirection ?? primaryDirection)
        : undefined
      : findDismissedDirection(releaseDeltaX, releaseDeltaY)

    if (!dismissDirection) {
      snapBack()
      return
    }

    direction.value = dismissDirection
    options.onDismiss?.()?.(event, { direction: dismissDirection })
  }

  return { swiping, direction, dragStyles, reset, start, move, end }
}

export type SwipeDismiss = ReturnType<typeof useSwipeDismiss>
