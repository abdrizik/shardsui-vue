import {
  computed,
  nextTick,
  onScopeDispose,
  onWatcherCleanup,
  shallowRef,
  toValue,
  watchEffect,
  watchPostEffect,
  type MaybeRefOrGetter
} from 'vue'
import { createAnimationFrame } from '@/internal/animation-frame'
import { useButton, type ButtonOptions } from '@/internal/button'
import { chain } from '@/internal/chain'
import { PATIENT_CLICK_THRESHOLD } from '@/internal/constants'
import type { DirectionContextValue } from '@/internal/direction-context'
import { contains } from '@/internal/dom'
import { useCompositeItem, type CompositeRoot } from '@/internal/floating/composite'
import { isClickLikeEvent } from '@/internal/floating/event'
import {
  applySafePolygonPointerEventsMutation,
  clearSafePolygonPointerEventsMutation,
  getHoverInteraction,
  type HoverInteraction
} from '@/internal/floating/hover/interaction'
import type { CloseGuardContextBase } from '@/internal/floating/hover/predicates'
import { hoverReferenceInteraction } from '@/internal/floating/hover/reference'
import { safePolygon } from '@/internal/floating/safe-polygon'
import {
  getNextTabbable,
  getPreviousTabbable,
  getTabbableAfterElement,
  isOutsideEvent
} from '@/internal/floating/tabbable'
import type { HoverContext } from '@/internal/floating/types'
import { REASONS } from '@/internal/reasons'
import { useTimeout } from '@/internal/timeout'
import type { NavigationMenuItemContext } from './context'
import type { ActivationDirection, NavigationMenuRoot } from './navigation-menu'

function sideFromElements(
  domReferenceElement: Element,
  floatingElement: HTMLElement
): CloseGuardContextBase['side'] {
  const referenceRect = domReferenceElement.getBoundingClientRect()
  const floatingRect = floatingElement.getBoundingClientRect()
  const referenceCenterX = referenceRect.left + referenceRect.width / 2
  const referenceCenterY = referenceRect.top + referenceRect.height / 2
  const floatingCenterX = floatingRect.left + floatingRect.width / 2
  const floatingCenterY = floatingRect.top + floatingRect.height / 2
  const deltaX = floatingCenterX - referenceCenterX
  const deltaY = floatingCenterY - referenceCenterY
  if (Math.abs(deltaX) >= Math.abs(deltaY)) {
    return deltaX >= 0 ? 'right' : 'left'
  }
  return deltaY >= 0 ? 'bottom' : 'top'
}

type NavigationMenuTriggerOptions = Pick<
  ButtonOptions,
  'onClick' | 'onMousedown' | 'onKeydown' | 'onKeyup' | 'onPointerdown'
> & {
  as: ButtonOptions['as']
  ref: MaybeRefOrGetter<HTMLElement | null>
  triggerId: MaybeRefOrGetter<string>
  disabled: MaybeRefOrGetter<boolean>
}

export function useNavigationMenuTrigger(
  navigationMenu: NavigationMenuRoot,
  item: NavigationMenuItemContext,
  composite: CompositeRoot | undefined,
  direction: DirectionContextValue,
  options: NavigationMenuTriggerOptions
) {
  const pointerType = shallowRef<PointerEvent['pointerType']>('')
  let allowFocus = false
  let stickIfOpen = true

  const stickIfOpenTimeout = useTimeout()
  const focusFrame = createAnimationFrame()

  const hoverInstance: HoverInteraction = getHoverInteraction(navigationMenu.data)

  const isActive = computed(
    () => navigationMenu.open.value && item.value.value === navigationMenu.value.value
  )

  const blocksSafePolygonPointerEvents = computed(() => pointerType.value !== 'touch')

  const triggerId = computed(() => toValue(options.triggerId))

  const compositeItem = composite
    ? useCompositeItem({
        composite,
        ref: options.ref,
        disabled: () => toValue(options.disabled)
      })
    : null

  function getScope(): HTMLElement | null {
    if (!navigationMenu.nested.value || !navigationMenu.positionerElement.value) {
      return toValue(options.ref)?.closest<HTMLElement>('ul') ?? null
    }
    return null
  }

  function inlineCloseGuardContext(): CloseGuardContextBase | null {
    const ref = toValue(options.ref)
    const floating = navigationMenu.floatingElement.value
    if (
      !navigationMenu.nested.value ||
      navigationMenu.positionerElement.value ||
      !ref ||
      !floating
    ) {
      return null
    }
    return {
      side: sideFromElements(ref, floating),
      elements: { domReference: ref, floating },
      nodeId: navigationMenu.floatingNodeId
    }
  }

  function activationDirectionFor(): ActivationDirection {
    const prevTrigger = navigationMenu.prevTriggerElement.value
    const ref = toValue(options.ref)
    if (!prevTrigger || !ref) return null
    const prev = prevTrigger.getBoundingClientRect()
    const next = ref.getBoundingClientRect()
    if (navigationMenu.orientation.value === 'horizontal' && next.left !== prev.left) {
      return next.left > prev.left ? 'right' : 'left'
    }
    if (navigationMenu.orientation.value === 'vertical' && next.top !== prev.top) {
      return next.top > prev.top ? 'down' : 'up'
    }
    return null
  }

  function armStickIfOpen(): void {
    stickIfOpen = true
    stickIfOpenTimeout.clear()
    stickIfOpenTimeout.start(PATIENT_CLICK_THRESHOLD, () => {
      stickIfOpen = false
    })
  }

  function activate(event: MouseEvent | KeyboardEvent): void {
    if (
      navigationMenu.mounted.value &&
      navigationMenu.prevTriggerElement.value &&
      toValue(options.ref)
    ) {
      const direction = activationDirectionFor()
      if (direction) navigationMenu.setActivationDirection(direction)
    }

    if (event.type !== 'click' && navigationMenu.value.value != null) {
      navigationMenu.data.openEvent = undefined
    }

    if (pointerType.value === 'touch' && event.type !== 'click') {
      return
    }

    const prevValue = navigationMenu.value.value

    if (navigationMenu.value.value != null) {
      if (prevValue !== item.value.value || isClickLikeEvent(event.type)) {
        navigationMenu.data.openEvent = event
      }
      if (event.type !== 'keydown') {
        navigationMenu.setValue(
          item.value.value,
          event.type === 'mouseenter' ? REASONS.triggerHover : REASONS.triggerPress,
          event
        )
      }
    }

    const floating = navigationMenu.floatingElement.value
    const trigger = toValue(options.ref)
    if (
      event.type === 'mouseenter' &&
      blocksSafePolygonPointerEvents.value &&
      (!navigationMenu.nested.value || !navigationMenu.positionerElement.value) &&
      floating &&
      trigger
    ) {
      const applyPointerEventsMutation = () => {
        const scopeElement = getScope() ?? trigger.ownerDocument.body
        applySafePolygonPointerEventsMutation(hoverInstance, {
          scopeElement,
          referenceElement: trigger,
          floatingElement: floating
        })
      }

      if (prevValue != null && prevValue !== item.value.value) {
        queueMicrotask(applyPointerEventsMutation)
      } else {
        applyPointerEventsMutation()
      }
    }
  }

  function activateWithSizing(event: MouseEvent | KeyboardEvent): void {
    const previousSize = navigationMenu.sizing.measureBeforeValueChange(
      item.value.value,
      event.type === 'click' || pointerType.value !== 'touch'
    )

    activate(event)

    if (previousSize) nextTick(() => navigationMenu.sizing.morphFrom(previousSize))
  }

  function shouldOpenOnClick(): boolean {
    if (!navigationMenu.open.value || !isActive.value) return true
    const openEvent = navigationMenu.data.openEvent
    if (openEvent && stickIfOpen) {
      return !isClickLikeEvent(openEvent.type)
    }
    return false
  }

  function onClick(event: MouseEvent): void {
    if (toValue(options.disabled)) return
    const nextOpen = navigationMenu.interactionsEnabled.value ? shouldOpenOnClick() : false
    activateWithSizing(event)
    if (navigationMenu.interactionsEnabled.value) {
      navigationMenu.setOpen(nextOpen, REASONS.triggerPress, event, toValue(options.ref))
    }
  }

  function onKeydown(event: KeyboardEvent): void {
    if (toValue(options.disabled)) return
    allowFocus = true

    if (navigationMenu.nested.value) return

    const isHorizontal = navigationMenu.orientation.value === 'horizontal'
    const verticalOpenKey = direction.direction.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
    const openHorizontal = isHorizontal && event.key === 'ArrowDown'
    const openVertical = !isHorizontal && event.key === verticalOpenKey

    if (openHorizontal || openVertical) {
      navigationMenu.setValue(item.value.value, REASONS.listNavigation, event)
      activateWithSizing(event)
      event.preventDefault()
      event.stopPropagation()
    }
  }

  function onPointerdown(event: PointerEvent): void {
    pointerType.value = event.pointerType
    clearSafePolygonPointerEventsMutation(hoverInstance)
  }

  const button = useButton({
    disabled: () => toValue(options.disabled),
    focusableWhenDisabled: true,
    as: options.as,
    composite: true,
    onClick: () => chain(options.onClick?.(), onClick),
    onMousedown: options.onMousedown,
    onKeydown: () => chain(options.onKeydown?.(), onKeydown),
    onKeyup: options.onKeyup,
    onPointerdown: () => chain(options.onPointerdown?.(), onPointerdown)
  })

  const safePolygonGuard = safePolygon({
    getScope,
    blockPointerEvents: blocksSafePolygonPointerEvents
  })

  const hoverRoot: HoverContext = {
    data: navigationMenu.data,
    triggerElements: navigationMenu.triggerElements,
    open: navigationMenu.open,
    transitionStatus: navigationMenu.transitionStatus,
    domReferenceElement: navigationMenu.domReferenceElement,
    floatingElement: navigationMenu.floatingElement,
    setOpen: (open, reason, event, trigger) => {
      if (reason === REASONS.triggerHover && navigationMenu.interactionsEnabled.value) {
        armStickIfOpen()
      }
      navigationMenu.setOpen(open, reason, event, trigger ?? toValue(options.ref))
    }
  }

  watchEffect(() => {
    if (isActive.value) hoverInstance.closeGuardOptions = safePolygonGuard.options
  })

  hoverReferenceInteraction(hoverRoot, {
    enabled: () => navigationMenu.hoverInteractionsEnabled.value && !toValue(options.disabled),
    move: false,
    shouldAllowOpen: () => pointerType.value !== 'touch',
    shouldAllowClose: () => pointerType.value !== 'touch',
    closeGuard: () => safePolygonGuard,
    restMs: () =>
      navigationMenu.mounted.value && navigationMenu.positionerElement.value
        ? 0
        : navigationMenu.delay.value,
    delay: () => ({ close: navigationMenu.closeDelay.value }),
    triggerElement: () => toValue(options.ref),
    isActiveTrigger: isActive,
    tree: () => navigationMenu.floatingTree,
    inlineCloseGuardContext: () => inlineCloseGuardContext()
  })

  onScopeDispose(focusFrame.cancel)

  watchPostEffect(() => {
    if (!navigationMenu.open.value) {
      navigationMenu.data.openEvent = undefined
      hoverInstance.pointerType = undefined
      hoverInstance.interactedInside = false
      hoverInstance.restTimeoutPending = false
      hoverInstance.openChangeTimeout.clear()
      hoverInstance.restTimeout.clear()
      stickIfOpenTimeout.clear()
      pointerType.value = ''
    }

    onWatcherCleanup(() => clearSafePolygonPointerEventsMutation(hoverInstance))
  })

  watchPostEffect(() => {
    const ref = toValue(options.ref)
    if (isActive.value && ref) {
      navigationMenu.prevTriggerElement.value = ref
    }
  })

  watchPostEffect(() => {
    if (isActive.value && navigationMenu.popupElement.value && allowFocus) {
      allowFocus = false
      focusFrame.request(() => {
        navigationMenu.beforeOutsideElement.value?.focus()
      })
    }
    onWatcherCleanup(() => focusFrame.cancel())
  })

  function registerTrigger(element: HTMLElement): () => void {
    return navigationMenu.registerTrigger(item.value.value, triggerId.value, element)
  }

  function onMouseenter(event: MouseEvent): void {
    if (toValue(options.disabled)) return
    activateWithSizing(event)
  }

  function onMousemove(): void {
    allowFocus = false
  }

  function onPointerenter(event: PointerEvent): void {
    pointerType.value = event.pointerType
  }

  function onFocus(): void {
    compositeItem?.onFocus()
    if (isActive.value) navigationMenu.viewportInert.value = false
  }

  function onBlur(event: FocusEvent): void {
    navigationMenu.closeOnFocusOut(toValue(options.ref), event)
  }

  function focusBeforeGuard(event: FocusEvent): void {
    const floating = navigationMenu.floatingElement.value
    if (floating && isOutsideEvent(event, floating)) {
      navigationMenu.beforeInsideElement.value?.focus()
    } else {
      getPreviousTabbable(toValue(options.ref))?.focus()
    }
  }

  function focusAfterGuard(event: FocusEvent): void {
    const ref = toValue(options.ref)
    const floating = navigationMenu.floatingElement.value
    if (floating && isOutsideEvent(event, floating)) {
      navigationMenu.viewportInert.value = false
      navigationMenu.viewportElement.value?.removeAttribute('inert')
      const elementToFocus = navigationMenu.afterInsideElement.value || ref
      elementToFocus?.focus()
      return
    }

    let nextTabbable = getNextTabbable(ref)

    if (
      navigationMenu.nested.value &&
      !navigationMenu.positionerElement.value &&
      floating &&
      nextTabbable &&
      contains(floating, nextTabbable)
    ) {
      nextTabbable = getTabbableAfterElement(navigationMenu.afterInsideElement.value)
    }

    nextTabbable?.focus()

    if (
      (!navigationMenu.nested.value || navigationMenu.positionerElement.value) &&
      !contains(navigationMenu.rootElement.value, nextTabbable)
    ) {
      navigationMenu.setValue(null, REASONS.focusOut, event)
    }
  }

  return {
    isActive,
    attrs: button.attrs,
    registerTrigger,
    onMouseenter,
    onMousemove,
    onPointerenter,
    onFocus,
    onBlur,
    focusBeforeGuard,
    focusAfterGuard
  }
}

export type NavigationMenuTrigger = ReturnType<typeof useNavigationMenuTrigger>
