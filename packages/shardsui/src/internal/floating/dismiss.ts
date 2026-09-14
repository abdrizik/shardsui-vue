import { onWatcherCleanup, toValue, watchPostEffect, type MaybeRefOrGetter } from 'vue'
import { isWebKit } from '../detect-browser'
import { contains, getTarget, isElement, isNode, listen } from '../dom'
import { isInjectedAfterOpen } from '../is-injected-after-open'
import { REASONS } from '../reasons'
import { useTimeout } from '../timeout'
import { getNodeChildren, type FloatingTree } from './floating-tree'
import { containsThroughPortals } from './portal'

type PressType = 'intentional' | 'sloppy'

export type DismissReason =
  | typeof REASONS.escapeKey
  | typeof REASONS.outsidePress
  | typeof REASONS.triggerPress

export function normalizeBubbles(
  normalizable?: boolean | { escapeKey?: boolean; outsidePress?: boolean }
) {
  return {
    escapeKey:
      typeof normalizable === 'boolean' ? normalizable : (normalizable?.escapeKey ?? false),
    outsidePress:
      typeof normalizable === 'boolean' ? normalizable : (normalizable?.outsidePress ?? true)
  }
}

export type DismissOptions = {
  open: MaybeRefOrGetter<boolean>
  onClose: (reason: DismissReason, event: Event) => void
  enabled?: MaybeRefOrGetter<boolean | undefined>
  escapeKey?: MaybeRefOrGetter<boolean | undefined>
  outsidePress?: () => boolean | ((event: MouseEvent | TouchEvent) => boolean) | undefined
  outsidePressEvent?: MaybeRefOrGetter<
    PressType | { mouse: PressType; touch: PressType } | undefined
  >
  triggerPress?: MaybeRefOrGetter<boolean | undefined>
  popupElement: MaybeRefOrGetter<Element | null>
  referenceElement?: MaybeRefOrGetter<Element | null | undefined>
  isInsideElement: (target: Node) => boolean
  bubbles?: MaybeRefOrGetter<boolean | { escapeKey?: boolean; outsidePress?: boolean } | undefined>
  tree?: MaybeRefOrGetter<FloatingTree | undefined>
  nodeId?: MaybeRefOrGetter<string | undefined>
}

export function useDismiss(options: DismissOptions): void {
  let isComposing = false
  const compositionTimeout = useTimeout()

  let pressStartTarget: Element | null = null
  let currentPointerType: PointerEvent['pointerType'] = ''

  let insideTree = false
  const clearInsideTreeTimeout = useTimeout()

  let touchState: {
    startTime: number
    startX: number
    startY: number
    dismissOnTouchEnd: boolean
    dismissOnMouseDown: boolean
  } | null = null

  const cancelDismissOnEndTimeout = useTimeout()

  watchPostEffect(() => {
    const open = toValue(options.open)
    const enabled = toValue(options.enabled) ?? true

    if (!open || !enabled) return

    const onClose = options.onClose
    const isInsideElement = options.isInsideElement
    const escapeKey = toValue(options.escapeKey) ?? true
    const outsidePress = options.outsidePress?.() ?? true
    const outsidePressEvent = toValue(options.outsidePressEvent) ?? 'sloppy'
    const triggerPress = toValue(options.triggerPress) ?? false
    const popupElement = toValue(options.popupElement)
    const referenceElement = toValue(options.referenceElement) ?? null
    const bubbles = toValue(options.bubbles)
    const tree = toValue(options.tree)
    const nodeId = toValue(options.nodeId)

    const { escapeKey: escapeKeyBubbles, outsidePress: outsidePressBubbles } =
      normalizeBubbles(bubbles)

    const ownNode = tree && nodeId ? tree.nodes.find((n) => n.id === nodeId) : undefined
    if (ownNode) {
      ownNode.dismissBubbles = {
        escapeKey: escapeKeyBubbles,
        outsidePress: outsidePressBubbles
      }
    }

    const pendingTargetCleanups = new Set<() => void>()

    function addTargetEventListenerOnce<EventType extends Event>(
      event: EventType,
      listener: (event: EventType) => void
    ) {
      const target = getTarget(event)
      if (!target) return

      const detach = () => {
        target.removeEventListener(event.type, handler, { capture: true })
        pendingTargetCleanups.delete(detach)
      }
      const handler = () => {
        listener(event)
        detach()
      }

      // DOM dispatch runs a target's capture listeners before its bubble listeners, so the
      // close lands before the element's own `@click`.
      target.addEventListener(event.type, handler, { capture: true })
      pendingTargetCleanups.add(detach)
    }

    function clearInsideTree() {
      clearInsideTreeTimeout.clear()
      insideTree = false
    }

    function markInsideTree() {
      insideTree = true
      clearInsideTreeTimeout.start(0, clearInsideTree)
    }

    // `dismissBubbles` is present exactly while a descendant's own dismiss effect is live, so
    // it survives the rest of a dispatch in which that descendant already set `open = false`.
    function hasBlockingChild(bubbleKey: 'escapeKey' | 'outsidePress'): boolean {
      if (!tree || !nodeId) return false
      const children = getNodeChildren(tree.nodes, nodeId, false)
      return children.some(
        (child) => child.dismissBubbles !== undefined && !child.dismissBubbles[bubbleKey]
      )
    }

    function isWithinOwnElements(target: EventTarget | null): boolean {
      if (!isNode(target)) return false
      return containsThroughPortals(popupElement, target) || isInsideElement(target)
    }

    function isWithinFloatingTree(target: Node | null): boolean {
      if (isWithinOwnElements(target)) return true
      if (!tree || !nodeId) return false
      return getNodeChildren(tree.nodes, nodeId).some((node) => contains(node.floating, target))
    }

    function oncompositionstart() {
      compositionTimeout.clear()
      isComposing = true
    }

    function oncompositionend() {
      // Safari fires `compositionend` before `keydown`.
      // 0ms or 1ms don't work in Safari. 5ms appears to consistently work.
      compositionTimeout.start(isWebKit ? 5 : 0, () => {
        isComposing = false
      })
    }

    function onkeydown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return

      // `Escape` while composing should close the IME compose menu, not the floating element.
      if (isComposing) return

      if (!escapeKeyBubbles && hasBlockingChild('escapeKey')) {
        return
      }

      onClose(REASONS.escapeKey, e)

      e.preventDefault()

      if (!escapeKeyBubbles) {
        e.stopPropagation()
      }
    }

    function getOutsidePressEventType(): PressType {
      if (typeof outsidePressEvent === 'string') {
        return outsidePressEvent
      }
      return outsidePressEvent[currentPointerType === 'touch' ? 'touch' : 'mouse']
    }

    function shouldIgnoreEvent(event: Event): boolean {
      const computedOutsidePressEvent = getOutsidePressEventType()
      return (
        (computedOutsidePressEvent === 'intentional' && event.type !== 'click') ||
        (computedOutsidePressEvent === 'sloppy' && event.type === 'click')
      )
    }

    function closeOnPressOutside(event: MouseEvent | TouchEvent) {
      // UI Events dispatches `click` at the nearest common inclusive ancestor of the
      // `pointerdown` and `pointerup` targets, so a drag out of the popup would report an
      // outside target. Where the press started is what decides inside vs. outside.
      const eventTarget = getTarget(event)
      let target: Element | null = isElement(eventTarget) ? eventTarget : null
      if (event.type === 'click') {
        target = pressStartTarget ?? target
        pressStartTarget = null
      }

      if (shouldIgnoreEvent(event)) {
        clearInsideTree()
        return
      }

      if (insideTree) {
        clearInsideTree()
        return
      }

      if (!target) return

      if (isWithinFloatingTree(target)) {
        return
      }

      if (isInjectedAfterOpen(target, popupElement)) {
        return
      }

      if (outsidePress instanceof Function && !outsidePress(event)) return

      if (hasBlockingChild('outsidePress')) {
        return
      }

      onClose(REASONS.outsidePress, event)
      clearInsideTree()
    }

    function closeOnSloppyPointerDown(event: PointerEvent) {
      if (
        getOutsidePressEventType() !== 'sloppy' ||
        event.pointerType === 'touch' ||
        isWithinOwnElements(getTarget(event))
      ) {
        return
      }

      closeOnPressOutside(event)
    }

    function trackTouchStart(event: TouchEvent) {
      if (getOutsidePressEventType() !== 'sloppy' || isWithinOwnElements(getTarget(event))) {
        return
      }

      const touch = event.touches[0]
      if (touch) {
        touchState = {
          startTime: Date.now(),
          startX: touch.clientX,
          startY: touch.clientY,
          dismissOnTouchEnd: false,
          dismissOnMouseDown: true
        }

        cancelDismissOnEndTimeout.start(1000, () => {
          if (touchState) {
            touchState.dismissOnTouchEnd = false
            touchState.dismissOnMouseDown = false
          }
        })
      }
    }

    function ontouchstart(event: TouchEvent) {
      currentPointerType = 'touch'
      addTargetEventListenerOnce(event, trackTouchStart)
    }

    function onPointerDownCapture(event: PointerEvent) {
      cancelDismissOnEndTimeout.clear()

      currentPointerType = event.pointerType

      addTargetEventListenerOnce(event, closeOnSloppyPointerDown)
    }

    function closeOnPressOutsideCapture(event: MouseEvent) {
      cancelDismissOnEndTimeout.clear()

      if (event.type === 'mousedown' && touchState && !touchState.dismissOnMouseDown) {
        return
      }

      addTargetEventListenerOnce(event, closeOnPressOutside)
    }

    function trackTouchMove(event: TouchEvent) {
      if (
        getOutsidePressEventType() !== 'sloppy' ||
        !touchState ||
        isWithinOwnElements(getTarget(event))
      ) {
        return
      }

      const touch = event.touches[0]
      if (!touch) return

      const deltaX = Math.abs(touch.clientX - touchState.startX)
      const deltaY = Math.abs(touch.clientY - touchState.startY)
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      if (distance > 5) {
        touchState.dismissOnTouchEnd = true
      }

      if (distance > 10) {
        closeOnPressOutside(event)
        cancelDismissOnEndTimeout.clear()
        touchState = null
      }
    }

    function ontouchmove(event: TouchEvent) {
      addTargetEventListenerOnce(event, trackTouchMove)
    }

    function closeOnSloppyTouchEnd(event: TouchEvent) {
      if (
        getOutsidePressEventType() !== 'sloppy' ||
        !touchState ||
        isWithinOwnElements(getTarget(event))
      ) {
        return
      }

      if (touchState.dismissOnTouchEnd) {
        closeOnPressOutside(event)
      }

      cancelDismissOnEndTimeout.clear()
      touchState = null
    }

    function ontouchend(event: TouchEvent) {
      addTargetEventListenerOnce(event, closeOnSloppyTouchEnd)
    }

    function closeOnTriggerPress(event: MouseEvent) {
      const target = getTarget(event)
      if (!isNode(target)) return

      if (!isInsideElement(target)) return

      onClose(REASONS.triggerPress, event)
    }

    function trackPressStart(event: MouseEvent) {
      if (event.button !== 0) return
      const target = getTarget(event)
      if (!isElement(target)) return

      pressStartTarget = target

      if (isWithinOwnElements(target)) markInsideTree()
    }

    const doc = popupElement?.ownerDocument ?? document

    const cleanups: Array<() => void> = []

    if (escapeKey) {
      cleanups.push(
        listen(doc, 'keydown', onkeydown),
        listen(doc, 'compositionstart', oncompositionstart),
        listen(doc, 'compositionend', oncompositionend)
      )

      // The document listener alone runs in registration order, so an outer floating element
      // opened first would consume the key before this one could stop it. Listening on the
      // elements too keeps the innermost element first, where `stopPropagation` still works.
      for (const element of [popupElement, referenceElement]) {
        if (element) cleanups.push(listen(element, 'keydown', onkeydown))
      }
    }

    if (outsidePress !== false) {
      cleanups.push(
        listen(doc, 'click', closeOnPressOutsideCapture, { capture: true }),
        listen(doc, 'pointerdown', onPointerDownCapture, { capture: true }),
        listen(doc, 'mousedown', closeOnPressOutsideCapture, { capture: true }),
        listen(doc, 'touchstart', ontouchstart, { capture: true }),
        listen(doc, 'touchmove', ontouchmove, { capture: true }),
        listen(doc, 'touchend', ontouchend, { capture: true })
      )

      cleanups.push(
        listen(doc, 'pointerdown', trackPressStart, { capture: true }),
        listen(doc, 'mousedown', trackPressStart, { capture: true })
      )

      if (popupElement) {
        cleanups.push(
          listen(popupElement, 'click', markInsideTree, { capture: true }),
          listen(popupElement, 'mouseup', markInsideTree, { capture: true }),
          listen(popupElement, 'touchmove', markInsideTree, { capture: true }),
          listen(popupElement, 'touchend', markInsideTree, { capture: true })
        )
      }
    }

    if (triggerPress) {
      cleanups.push(listen(doc, 'pointerdown', closeOnTriggerPress, { capture: true }))
      cleanups.push(listen(doc, 'click', closeOnTriggerPress, { capture: true }))
    }

    onWatcherCleanup(() => {
      if (ownNode) ownNode.dismissBubbles = undefined

      for (const cleanup of cleanups) cleanup()
      for (const detach of pendingTargetCleanups) detach()

      compositionTimeout.clear()
      clearInsideTreeTimeout.clear()
      insideTree = false
      pressStartTarget = null
    })
  })
}
