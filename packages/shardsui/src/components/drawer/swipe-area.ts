import {
  computed,
  onScopeDispose,
  onWatcherCleanup,
  shallowRef,
  toValue,
  watchPostEffect,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref
} from 'vue'
import type { DialogRoot } from '@/components/dialog/dialog'
import { clamp } from '@/internal/clamp'
import { listen } from '@/internal/dom'
import { isVirtualClick } from '@/internal/floating/event'
import { REASONS } from '@/internal/reasons'
import { getDisplacement, getElementTransform, useSwipeDismiss } from '@/internal/swipe-dismiss'
import { DRAWER_SWIPE_MOVEMENT_X_VAR, DRAWER_SWIPE_MOVEMENT_Y_VAR } from './constants'
import type { DrawerProvider } from './context'
import type { DrawerRoot, DrawerSwipeDirection } from './drawer'
import {
  resetBackdropSwipeVars,
  setBackdropSwipeVars,
  setBackdropSwipingAttribute
} from './swipe-dom'

const DEFAULT_SWIPE_OPEN_RATIO = 0.5
const MIN_SWIPE_START_DISTANCE = 1
const VELOCITY_THRESHOLD = 0.1
const FALLBACK_SWIPE_OPEN_THRESHOLD = 40

const oppositeSwipeDirection: Record<DrawerSwipeDirection, DrawerSwipeDirection> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left'
}

type DrawerSwipeAreaOptions = {
  element: MaybeRefOrGetter<HTMLElement | null>
  id: MaybeRefOrGetter<string>
  disabled: MaybeRefOrGetter<boolean>
  swipeDirection: MaybeRefOrGetter<DrawerSwipeDirection | undefined>
}

export type DrawerSwipeArea = {
  swipeDirection: ComputedRef<DrawerSwipeDirection>
  enabled: ComputedRef<boolean>
  touchAction: ComputedRef<string>
  swiping: Readonly<Ref<boolean>>
}

/** Swipe-from-edge opening for `Drawer.SwipeArea`. */
export function useDrawerSwipeArea(
  dialog: DialogRoot,
  drawer: DrawerRoot,
  provider: DrawerProvider | undefined,
  options: DrawerSwipeAreaOptions
): DrawerSwipeArea {
  const swipeActive = shallowRef(false)
  const appliedSwipeStyles = shallowRef(false)

  let openedBySwipe = false
  let closedOffset: number | null = null
  let dragDelta = { x: 0, y: 0 }
  let swipeBackdropElement: HTMLElement | null = null
  let releaseGuardCleanup: (() => void) | null = null

  const swipeDirection = computed(
    () => toValue(options.swipeDirection) ?? oppositeSwipeDirection[drawer.swipeDirection.value]
  )

  const enabled = computed(
    () => !toValue(options.disabled) && (!dialog.open.value || swipeActive.value)
  )

  const touchAction = computed(() =>
    swipeDirection.value === 'left' || swipeDirection.value === 'right' ? 'pan-y' : 'pan-x'
  )

  const dismissDirection = computed(() => oppositeSwipeDirection[swipeDirection.value])

  const dismissHorizontal = computed(
    () => dismissDirection.value === 'left' || dismissDirection.value === 'right'
  )

  function resetDragDelta(): void {
    dragDelta = { x: 0, y: 0 }
  }

  function disableDismissForSwipe(): void {
    releaseGuardCleanup?.()
    dialog.outsidePressEnabled.value = false
  }

  function enableDismissAfterRelease(): void {
    releaseGuardCleanup?.()

    const doc = toValue(options.element)?.ownerDocument ?? document

    const restore = (event?: MouseEvent) => {
      if (event?.type === 'click' && event.detail !== 0 && !isVirtualClick(event)) return

      releaseGuardCleanup = null
      offPointerdown()
      offClick()
      dialog.outsidePressEnabled.value = true
    }

    const offPointerdown = listen(doc, 'pointerdown', restore, { capture: true })
    const offClick = listen(doc, 'click', restore, { capture: true })
    releaseGuardCleanup = restore
  }

  function popupSize(): number | null {
    const popupElement = dialog.popupElement.value
    if (!popupElement) return null

    const size = dismissHorizontal.value ? popupElement.offsetWidth : popupElement.offsetHeight
    return size > 0 ? size : null
  }

  function measureClosedOffset(popupElement: HTMLElement): number | null {
    const size = popupSize()
    if (size == null) return null

    const transform = getElementTransform(popupElement)
    const transformOffset = dismissHorizontal.value ? transform.x : transform.y
    return Math.abs(transformOffset) > 0.5 ? Math.min(size, Math.abs(transformOffset)) : size
  }

  function swipeOpenThreshold(): number {
    const size = popupSize()
    return size == null ? FALLBACK_SWIPE_OPEN_THRESHOLD : size * DEFAULT_SWIPE_OPEN_RATIO
  }

  function applySwipeMovement(): void {
    const popupElement = dialog.popupElement.value
    if (!popupElement) return

    if (!dialog.open.value || !dialog.mounted.value) return

    closedOffset ??= measureClosedOffset(popupElement)
    if (closedOffset === null) return

    const { x: deltaX, y: deltaY } = dragDelta
    const displacement = Math.max(0, getDisplacement(swipeDirection.value, deltaX, deltaY))
    const dampedDisplacement =
      displacement > closedOffset
        ? closedOffset + Math.sqrt(displacement - closedOffset)
        : displacement
    const remaining = closedOffset - dampedDisplacement
    const dismissing = dismissDirection.value
    const movement = dismissing === 'left' || dismissing === 'up' ? -remaining : remaining
    const movementX = dismissHorizontal.value ? movement : 0
    const movementY = dismissHorizontal.value ? 0 : movement
    const openProgress = clamp(displacement / closedOffset, 0, 1)

    drawer.swipeAreaMovement.value = { x: `${movementX}px`, y: `${movementY}px` }

    const frontmostHeight = drawer.frontmostHeight.value
    const backdropElement = dialog.backdropElement.value
    if (backdropElement) {
      const backdropProgress = clamp(1 - openProgress, 0, 1)
      setBackdropSwipingAttribute(backdropElement, true)
      swipeBackdropElement = backdropElement
      setBackdropSwipeVars(
        backdropElement,
        backdropProgress,
        openProgress > 0 ? frontmostHeight : 0
      )
    }

    provider?.setVisualState({
      swipeProgress: openProgress,
      frontmostHeight: openProgress > 0 ? frontmostHeight : 0
    })

    appliedSwipeStyles.value = true
    drawer.swipeAreaActive.value = true
  }

  function clearSwipeStyles(): void {
    drawer.swipeAreaMovement.value = null

    const backdropElement = swipeBackdropElement
    if (backdropElement) {
      setBackdropSwipingAttribute(backdropElement, false)
      resetBackdropSwipeVars(backdropElement)
    }

    provider?.setVisualState({ swipeProgress: 0, frontmostHeight: 0 })

    appliedSwipeStyles.value = false
    swipeBackdropElement = null
    drawer.swipeAreaActive.value = false
  }

  function openDrawer(): void {
    if (dialog.open.value) return
    openedBySwipe = true
    dialog.setOpen(true, REASONS.swipe)
  }

  function resetSwipeInteractionState(): void {
    openedBySwipe = false
    closedOffset = null
    swipeActive.value = false
  }

  function finishSwipeInteraction(): void {
    resetSwipeInteractionState()
    enableDismissAfterRelease()
    resetDragDelta()
    clearSwipeStyles()
  }

  function applySwipeProgress(
    _progress: number,
    details?: { direction?: DrawerSwipeDirection | undefined; deltaX: number; deltaY: number }
  ): void {
    if (!details) return
    if (!swipeActive.value) return

    dragDelta = { x: details.deltaX, y: details.deltaY }

    if (details.direction !== swipeDirection.value) return

    const displacement = getDisplacement(swipeDirection.value, details.deltaX, details.deltaY)

    if (!openedBySwipe) {
      if (displacement < MIN_SWIPE_START_DISTANCE) return
      openDrawer()
    }

    applySwipeMovement()
  }

  function settleSwipeRelease({
    direction,
    deltaX,
    deltaY,
    releaseVelocityX,
    releaseVelocityY
  }: {
    direction?: DrawerSwipeDirection | undefined
    deltaX: number
    deltaY: number
    releaseVelocityX: number
    releaseVelocityY: number
  }): boolean {
    const displacement = getDisplacement(swipeDirection.value, deltaX, deltaY)
    const releaseVelocity = getDisplacement(
      swipeDirection.value,
      releaseVelocityX,
      releaseVelocityY
    )
    const threshold = swipeOpenThreshold()
    const hasEnoughDistance = displacement >= threshold
    const hasEnoughVelocity = releaseVelocity >= VELOCITY_THRESHOLD
    const shouldOpen =
      direction === swipeDirection.value &&
      (hasEnoughDistance || hasEnoughVelocity) &&
      !toValue(options.disabled)

    if (shouldOpen) {
      openDrawer()
    } else if (openedBySwipe && dialog.open.value) {
      dialog.setOpen(false, REASONS.swipe)
    }

    finishSwipeInteraction()
    return false
  }

  const swipe = useSwipeDismiss({
    enabled,
    directions: () => [swipeDirection.value],
    element: options.element,
    trackDrag: false,
    movementCssVars: {
      x: DRAWER_SWIPE_MOVEMENT_X_VAR,
      y: DRAWER_SWIPE_MOVEMENT_Y_VAR
    },
    onSwipeStart: () => () => {
      disableDismissForSwipe()
      openedBySwipe = false
      swipeActive.value = true
      resetDragDelta()
    },
    onProgress: () => applySwipeProgress,
    onRelease: () => settleSwipeRelease,
    onCancel: () => () => finishSwipeInteraction()
  })

  function onpointerdown(event: PointerEvent): void {
    if (event.pointerType === 'touch') return
    swipe.start(event)

    if (event.cancelable) event.preventDefault()
  }

  function endPointerSwipe(event: PointerEvent): void {
    if (event.pointerType === 'touch') return
    swipe.end(event)
  }

  onScopeDispose(() => {
    releaseGuardCleanup?.()
    dialog.outsidePressEnabled.value = true
  })

  watchPostEffect(() => {
    const node = toValue(options.element)
    if (!node) return

    const cleanups = [
      listen(node, 'pointerdown', onpointerdown),
      listen(node, 'pointermove', (event: PointerEvent) => {
        if (event.pointerType === 'touch') return
        swipe.move(event, node)
      }),
      listen(node, 'pointerup', endPointerSwipe),
      listen(node, 'pointercancel', endPointerSwipe),
      listen(node, 'touchstart', swipe.start),
      listen(node, 'touchmove', (event: TouchEvent) => swipe.move(event, node)),
      listen(node, 'touchend', swipe.end),
      listen(node, 'touchcancel', swipe.end)
    ]

    onWatcherCleanup(() => {
      for (const cleanup of cleanups) cleanup()
    })
  })

  watchPostEffect(() => {
    if (swipeActive.value && appliedSwipeStyles.value) applySwipeMovement()
  })

  watchPostEffect(() => {
    const element = toValue(options.element)
    if (!element) return
    onWatcherCleanup(dialog.registerTrigger(toValue(options.id), element))
  })

  watchPostEffect(() => {
    if (!enabled.value) {
      if (swipeActive.value) enableDismissAfterRelease()
      swipe.reset()
      resetDragDelta()
      clearSwipeStyles()
      resetSwipeInteractionState()
    }
  })

  return {
    swipeDirection,
    enabled,
    touchAction,
    swiping: swipe.swiping
  }
}
