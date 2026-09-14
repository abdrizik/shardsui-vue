import { isElement } from '@floating-ui/utils/dom'
import { computed, shallowRef, toValue, type MaybeRefOrGetter } from 'vue'
import { SHARDSUI_SWIPE_IGNORE_SELECTOR } from '@/internal/constants'
import { getTarget } from '@/internal/dom'
import { safelyChangePointerCapture } from '@/internal/swipe-dismiss'
import { getDisplacement, getElementTransform, type SwipeDirection } from '@/internal/swipe-dismiss'

const SWIPE_THRESHOLD = 40
const REVERSE_CANCEL_THRESHOLD = 10
const OPPOSITE_DIRECTION_DAMPING_FACTOR = 0.5
const MIN_DRAG_THRESHOLD = 1
const IGNORE_SELECTOR = `button,a,input,textarea,[role="button"],${SHARDSUI_SWIPE_IGNORE_SELECTOR}`

type ToastSwipeOptions = {
  directions: MaybeRefOrGetter<SwipeDirection[]>
  element: MaybeRefOrGetter<HTMLElement | null>
  onSwipeStart: () => void
  onDismiss: () => void
}

function damp(delta: number): number {
  return delta > 0
    ? delta ** OPPOSITE_DIRECTION_DAMPING_FACTOR
    : -(Math.abs(delta) ** OPPOSITE_DIRECTION_DAMPING_FACTOR)
}

export function useToastSwipe(options: ToastSwipeOptions) {
  const swiping = shallowRef(false)
  const direction = shallowRef<SwipeDirection | undefined>(undefined)

  const dragOffset = shallowRef({ x: 0, y: 0 })
  const initialTransform = shallowRef({ x: 0, y: 0, scale: 1 })

  let isRealSwipe = false
  let lockedAxis: 'horizontal' | 'vertical' | null = null
  let dragStartPos = { x: 0, y: 0 }
  let cancelBaseline = { x: 0, y: 0 }
  let intendedDirection: SwipeDirection | undefined
  let maxDisplacement = 0
  let cancelled = false
  let isFirstPointerMove = false
  let activePointerId: number | null = null

  const directions = computed(() => toValue(options.directions))

  const dragStyles = computed(() => ({
    transition: swiping.value ? 'none' : undefined,
    transform: swiping.value
      ? `translateX(${dragOffset.value.x}px) translateY(${dragOffset.value.y}px) scale(${initialTransform.value.scale})`
      : undefined,
    movementX: `${dragOffset.value.x - initialTransform.value.x}px`,
    movementY: `${dragOffset.value.y - initialTransform.value.y}px`
  }))

  const reset = () => {
    direction.value = undefined
    initialTransform.value = { x: 0, y: 0, scale: 1 }
    dragOffset.value = { x: 0, y: 0 }
  }

  const start = (event: PointerEvent) => {
    const target = getTarget(event)
    if (isElement(target) && target.closest(IGNORE_SELECTOR)) return

    cancelled = false
    intendedDirection = undefined
    maxDisplacement = 0
    activePointerId = event.pointerId
    dragStartPos = { x: event.clientX, y: event.clientY }
    cancelBaseline = dragStartPos

    const element = toValue(options.element)
    if (element) {
      const transform = getElementTransform(element)
      initialTransform.value = transform
      dragOffset.value = { x: transform.x, y: transform.y }
      safelyChangePointerCapture(element, event.pointerId, 'setPointerCapture')
    }

    options.onSwipeStart()

    swiping.value = true
    isRealSwipe = false
    lockedAxis = null
    isFirstPointerMove = true
  }

  const move = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId) return

    event.preventDefault()

    if (isFirstPointerMove) {
      dragStartPos = { x: event.clientX, y: event.clientY }
      isFirstPointerMove = false
    }

    const { clientX, clientY, movementX, movementY } = event
    const baseline = cancelBaseline

    if ((movementY < 0 && clientY > baseline.y) || (movementY > 0 && clientY < baseline.y)) {
      cancelBaseline = { x: cancelBaseline.x, y: clientY }
    }

    if ((movementX < 0 && clientX > baseline.x) || (movementX > 0 && clientX < baseline.x)) {
      cancelBaseline = { x: clientX, y: cancelBaseline.y }
    }

    const deltaX = clientX - dragStartPos.x
    const deltaY = clientY - dragStartPos.y
    const cancelDeltaX = clientX - cancelBaseline.x
    const cancelDeltaY = clientY - cancelBaseline.y

    const allowed = directions.value
    const allowLeft = allowed.includes('left')
    const allowRight = allowed.includes('right')
    const allowUp = allowed.includes('up')
    const allowDown = allowed.includes('down')
    const hasHorizontal = allowLeft || allowRight
    const hasVertical = allowUp || allowDown

    if (!isRealSwipe && Math.hypot(deltaX, deltaY) >= MIN_DRAG_THRESHOLD) {
      isRealSwipe = true
      if (hasHorizontal && hasVertical) {
        lockedAxis = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical'
      }
    }

    const axis = lockedAxis

    if (intendedDirection) {
      const displacement = getDisplacement(intendedDirection, cancelDeltaX, cancelDeltaY)

      if (displacement > SWIPE_THRESHOLD) {
        cancelled = false
        direction.value = intendedDirection
      } else if (
        !(allowLeft && allowRight) &&
        !(allowUp && allowDown) &&
        maxDisplacement - displacement >= REVERSE_CANCEL_THRESHOLD
      ) {
        cancelled = true
      }
    } else {
      let candidate: SwipeDirection | undefined
      if (axis === 'vertical') {
        if (deltaY > 0) candidate = 'down'
        else if (deltaY < 0) candidate = 'up'
      } else if (axis === 'horizontal') {
        if (deltaX > 0) candidate = 'right'
        else if (deltaX < 0) candidate = 'left'
      } else if (Math.abs(deltaX) >= Math.abs(deltaY)) {
        candidate = deltaX > 0 ? 'right' : 'left'
      } else {
        candidate = deltaY > 0 ? 'down' : 'up'
      }

      if (candidate && allowed.includes(candidate)) {
        intendedDirection = candidate
        maxDisplacement = getDisplacement(candidate, deltaX, deltaY)
        direction.value = candidate
      }
    }

    const dampX = (deltaX > 0 && !allowRight) || (deltaX < 0 && !allowLeft)
    const dampY = (deltaY > 0 && !allowDown) || (deltaY < 0 && !allowUp)
    const transform = initialTransform.value

    dragOffset.value = {
      x: transform.x + (hasHorizontal && axis !== 'vertical' ? (dampX ? damp(deltaX) : deltaX) : 0),
      y: transform.y + (hasVertical && axis !== 'horizontal' ? (dampY ? damp(deltaY) : deltaY) : 0)
    }
  }

  const end = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId) return

    activePointerId = null
    swiping.value = false
    isRealSwipe = false
    lockedAxis = null

    const transform = initialTransform.value
    const snapBack = () => {
      dragOffset.value = { x: transform.x, y: transform.y }
      direction.value = undefined
    }

    if (event.type === 'pointercancel' || cancelled) {
      snapBack()
      return
    }

    const deltaX = dragOffset.value.x - transform.x
    const deltaY = dragOffset.value.y - transform.y
    const dismissDirection = directions.value.find(
      (candidate) => getDisplacement(candidate, deltaX, deltaY) > SWIPE_THRESHOLD
    )

    if (!dismissDirection) {
      snapBack()
      return
    }

    direction.value = dismissDirection
    options.onDismiss()
  }

  return { swiping, direction, dragStyles, reset, start, move, end }
}
