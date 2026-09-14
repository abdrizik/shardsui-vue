import {
  computed,
  onScopeDispose,
  onWatcherCleanup,
  toValue,
  watchPostEffect,
  type MaybeRefOrGetter
} from 'vue'
import { contains, getTarget, isElement, listen } from '../../dom'
import { REASONS } from '../../reasons'
import { FloatingTreeContext, type FloatingTree } from '../floating-tree'
import type { HoverContext } from '../types'
import {
  applySafePolygonPointerEventsMutation,
  clearSafePolygonPointerEventsMutation,
  getHoverInteraction,
  type HoverInteraction
} from './interaction'
import {
  getDelay,
  isClickLikeOpenEvent,
  isInsideEnabledTrigger,
  isMouseLikePointerType,
  type CloseGuard,
  type CloseGuardContextBase,
  type Delay
} from './predicates'

type HoverReferenceInteractionOptions = {
  enabled?: MaybeRefOrGetter<boolean | undefined>
  closeGuard: () => CloseGuard | null
  restMs?: MaybeRefOrGetter<number | undefined>
  delay: MaybeRefOrGetter<Delay>
  move: MaybeRefOrGetter<boolean>
  mouseOnly?: MaybeRefOrGetter<boolean | undefined>
  isActiveTrigger: MaybeRefOrGetter<boolean>
  triggerElement: MaybeRefOrGetter<Element | null>
  tree?: MaybeRefOrGetter<FloatingTree | null | undefined>
  inlineCloseGuardContext?: MaybeRefOrGetter<CloseGuardContextBase | null | undefined>
  shouldAllowOpen?: MaybeRefOrGetter<boolean | undefined>
  shouldAllowClose?: MaybeRefOrGetter<boolean | undefined>
  /**
   * Cancels a pending hover-open from the trigger's `mouseout` as well, backing up a `mouseleave`
   * that Chrome can drop during a fast pointer sweep and leave a submenu stuck open.
   */
  guardStaleOpen?: MaybeRefOrGetter<boolean | undefined>
}

export function hoverReferenceInteraction(
  root: HoverContext,
  options: HoverReferenceInteractionOptions
): void {
  const floatingTree = FloatingTreeContext.getOr() ?? null

  const enabled = computed(() => toValue(options.enabled) ?? true)
  const restMs = computed(() => toValue(options.restMs) ?? 0)
  const delay = computed<Delay>(() => toValue(options.delay))
  const move = computed(() => toValue(options.move))
  const mouseOnly = computed(() => toValue(options.mouseOnly) ?? false)
  const isActiveTrigger = computed(() => toValue(options.isActiveTrigger))
  const shouldAllowOpen = computed(() => toValue(options.shouldAllowOpen) ?? true)
  const shouldAllowClose = computed(() => toValue(options.shouldAllowClose) ?? true)
  const guardStaleOpen = computed(() => toValue(options.guardStaleOpen) ?? false)

  const closeGuard = computed(() => options.closeGuard())
  const referenceElement = computed(() => toValue(options.triggerElement))
  const tree = computed(() => toValue(options.tree) ?? floatingTree)
  const inlineCloseGuardContext = computed(() => toValue(options.inlineCloseGuardContext) ?? null)

  const instance: HoverInteraction = getHoverInteraction(root.data)

  function hasClickLikeOpenEvent(): boolean {
    return isClickLikeOpenEvent(root.data.openEvent?.type, instance.interactedInside)
  }

  function isOverInactiveTrigger(
    currentDomReference: Element | null,
    currentTarget: Element,
    target: EventTarget | null
  ): boolean {
    const allTriggers = root.triggerElements
    if (allTriggers.hasElement(currentTarget)) {
      return !currentDomReference || !contains(currentDomReference, currentTarget)
    }
    if (!isElement(target)) {
      return false
    }
    const targetElement = target
    return (
      allTriggers.containsNode(targetElement) &&
      (!currentDomReference || !contains(currentDomReference, targetElement))
    )
  }

  onScopeDispose(() => {
    instance.stopTrackingMouseMove()
  })

  watchPostEffect(() => {
    if (!enabled.value) return

    if (isActiveTrigger.value) {
      instance.closeGuardOptions = closeGuard.value?.options
    }

    const trigger = referenceElement.value as HTMLElement | null

    if (!isElement(trigger)) return

    const openOnHover = (event: MouseEvent): void => {
      instance.openChangeTimeout.clear()
      instance.blockMouseMove = false

      if (mouseOnly.value && !isMouseLikePointerType(instance.pointerType)) {
        return
      }

      const openDelay = getDelay(delay.value, 'open', instance.pointerType)
      const eventTarget = getTarget(event)
      const currentDomReference = root.domReferenceElement.value
      let triggerNode: HTMLElement = trigger

      if (isElement(eventTarget) && !root.triggerElements.hasElement(eventTarget)) {
        for (const triggerElement of root.triggerElements.elements()) {
          if (contains(triggerElement, eventTarget)) {
            triggerNode = triggerElement
            break
          }
        }
      }

      if (
        isElement(currentDomReference) &&
        !root.triggerElements.hasElement(trigger) &&
        contains(trigger, currentDomReference)
      ) {
        triggerNode = currentDomReference as HTMLElement
      }

      const isOverInactive = isOverInactiveTrigger(currentDomReference, triggerNode, eventTarget)
      const isOpen = root.open.value
      const isInClosingTransition = root.transitionStatus.value === 'ending'
      const isHoverCloseTransition = !isOpen && isInClosingTransition && instance.isHoverCloseActive
      const isReenteringSameTriggerDuringCloseTransition =
        !isOverInactive &&
        isElement(currentDomReference) &&
        contains(currentDomReference, triggerNode) &&
        isHoverCloseTransition
      const isRestOnlyDelay = restMs.value > 0 && !openDelay
      const shouldOpenImmediately =
        (isOverInactive && (isOpen || isHoverCloseTransition)) ||
        isReenteringSameTriggerDuringCloseTransition
      const shouldOpen = !isOpen || isOverInactive

      if (shouldOpenImmediately) {
        if (shouldAllowOpen.value) {
          root.setOpen(true, REASONS.triggerHover, event, triggerNode)
        }
        return
      }

      if (isRestOnlyDelay) {
        return
      }

      if (openDelay) {
        instance.openChangeTimeout.start(openDelay, () => {
          if (shouldOpen && shouldAllowOpen.value) {
            root.setOpen(true, REASONS.triggerHover, event, triggerNode)
          }
        })
      } else if (shouldOpen && shouldAllowOpen.value) {
        root.setOpen(true, REASONS.triggerHover, event, triggerNode)
      }
    }

    const onmouseleave = (event: MouseEvent): void => {
      if (hasClickLikeOpenEvent()) {
        clearSafePolygonPointerEventsMutation(instance)
        return
      }

      instance.stopTrackingMouseMove()
      instance.restTimeout.clear()
      instance.restTimeoutPending = false

      if (isInsideEnabledTrigger(event.relatedTarget, root.triggerElements)) {
        return
      }

      const closeFn = closeGuard.value
      const closeContext = root.data.closeGuardContext ?? inlineCloseGuardContext.value
      if (closeFn && closeContext) {
        if (!root.open.value) {
          instance.openChangeTimeout.clear()
        }

        const currentTrigger = referenceElement.value

        const trackCursor = closeFn({
          ...closeContext,
          tree: tree.value,
          x: event.clientX,
          y: event.clientY,
          onClose: () => {
            clearSafePolygonPointerEventsMutation(instance)
            instance.stopTrackingMouseMove()
            if (
              shouldAllowClose.value &&
              enabled.value &&
              !hasClickLikeOpenEvent() &&
              currentTrigger === root.domReferenceElement.value
            ) {
              instance.closeAfterDelay(root, tree.value, delay.value, event)
            }
          }
        })

        instance.trackMouseMove(
          root.domReferenceElement.value?.ownerDocument ?? document,
          trackCursor
        )
        trackCursor(event)
        return
      }

      const shouldClose =
        instance.pointerType === 'touch'
          ? !contains(root.floatingElement.value, event.relatedTarget)
          : true

      if (shouldClose && shouldAllowClose.value) {
        instance.closeAfterDelay(root, tree.value, delay.value, event)
      }
    }

    const onMouseOut = (event: MouseEvent): void => {
      if (contains(trigger, event.relatedTarget)) {
        return
      }
      instance.openChangeTimeout.clear()
      instance.restTimeout.clear()
      instance.restTimeoutPending = false
    }

    const setPointerType = (event: PointerEvent): void => {
      instance.pointerType = event.pointerType
    }

    const onmousemove = (event: MouseEvent): void => {
      const currentDomReference = root.domReferenceElement.value
      const currentOpen = root.open.value
      const isOverInactive = isOverInactiveTrigger(currentDomReference, trigger, event.target)

      if (mouseOnly.value && !isMouseLikePointerType(instance.pointerType)) {
        return
      }

      if (currentOpen && isOverInactive && instance.closeGuardOptions?.().blockPointerEvents) {
        const floatingElement = root.floatingElement.value
        if (floatingElement) {
          const scopeElement =
            instance.closeGuardOptions?.().getScope?.() ?? trigger.ownerDocument.body
          applySafePolygonPointerEventsMutation(instance, {
            scopeElement,
            referenceElement: trigger,
            floatingElement
          })
        }
      }

      if ((currentOpen && !isOverInactive) || restMs.value === 0) {
        return
      }

      if (
        !isOverInactive &&
        instance.restTimeoutPending &&
        event.movementX ** 2 + event.movementY ** 2 < 2
      ) {
        return
      }

      instance.restTimeout.clear()

      const openAfterRest = (): void => {
        instance.restTimeoutPending = false
        if (hasClickLikeOpenEvent()) {
          return
        }
        const latestOpen = root.open.value
        if (!instance.blockMouseMove && (!latestOpen || isOverInactive) && shouldAllowOpen.value) {
          root.setOpen(true, REASONS.triggerHover, event, trigger)
        }
      }

      if (instance.pointerType === 'touch' || (isOverInactive && currentOpen)) {
        openAfterRest()
      } else {
        instance.restTimeoutPending = true
        instance.restTimeout.start(restMs.value, openAfterRest)
      }
    }

    // Registration order is listener order: the `move` handler must clear `blockMouseMove`
    // before `onmousemove` reads it on the same event.
    const cleanups: Array<() => void> = []
    if (move.value) {
      cleanups.push(listen(trigger, 'mousemove', openOnHover, { once: true }))
    }
    cleanups.push(
      listen(trigger, 'mouseenter', openOnHover),
      listen(trigger, 'mouseleave', onmouseleave)
    )
    if (guardStaleOpen.value) {
      cleanups.push(listen(trigger, 'mouseout', onMouseOut))
    }
    cleanups.push(
      listen(trigger, 'mousemove', onmousemove),
      listen(trigger, 'pointerdown', setPointerType),
      listen(trigger, 'pointerenter', setPointerType)
    )

    onWatcherCleanup(() => {
      for (const cleanup of cleanups) cleanup()
    })
  })
}
