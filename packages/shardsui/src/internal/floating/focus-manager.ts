import {
  computed,
  onWatcherCleanup,
  toValue,
  watch,
  watchPostEffect,
  type MaybeRefOrGetter
} from 'vue'
import {
  cancelAnimationFrameTick,
  requestAnimationFrameTick,
  useAnimationFrame
} from '../animation-frame'
import {
  CLICK_TRIGGER_SELECTOR,
  FOCUS_GUARD_ATTRIBUTE,
  SHARDSUI_PORTAL_SELECTOR
} from '../constants'
import { isWebKit } from '../detect-browser'
import { contains, getNodeName, getTarget, isElement, isHTMLElement, listen } from '../dom'
import { isInjectedAfterOpen } from '../is-injected-after-open'
import { REASONS } from '../reasons'
import { useTimeout } from '../timeout'
import { visuallyHidden } from '../visually-hidden'
import { getFloatingFocusElement } from './element'
import { isVirtualClick, isVirtualPointerEvent } from './event'
import {
  FloatingNodeContext,
  FloatingTreeContext,
  getNodeAncestors,
  getNodeChildren
} from './floating-tree'
import { isElementVisible } from './list-navigation'
import { markOthers } from './mark-others'
import { containsThroughPortals } from './portal'
import {
  focusable,
  isTabbable,
  isTypeableCombobox,
  isTypeableElement,
  managedTabIndex,
  tabbable,
  type FocusableElement
} from './tabbable'

export type FocusTarget =
  | boolean
  | HTMLElement
  | ((interactionType: string) => HTMLElement | boolean | null | void)
  | undefined

export type FocusManagerOptions = {
  open: MaybeRefOrGetter<boolean>
  modal: MaybeRefOrGetter<boolean>
  enabled: MaybeRefOrGetter<boolean>
  popupElement: MaybeRefOrGetter<HTMLElement | null>
  triggerElement: MaybeRefOrGetter<HTMLElement | null>
  initialFocus: () => FocusTarget
  finalFocus: () => FocusTarget
  openMethod?: MaybeRefOrGetter<string | null | undefined>
  closeEvent?: MaybeRefOrGetter<Event | null | undefined>
  closeReason?: MaybeRefOrGetter<string | null | undefined>
  closeOnFocusOut?: MaybeRefOrGetter<boolean | undefined>
  onFocusOut?: () => ((event: FocusEvent) => void) | undefined
  getNextFocusableElement?: () => HTMLElement | null
  restoreFocus?: MaybeRefOrGetter<boolean | 'popup' | undefined>
  insideElements?: MaybeRefOrGetter<Array<HTMLElement | null> | undefined>
}

function getEventType(event: Event | null | undefined, lastInteractionType: string): string {
  if (!event) return lastInteractionType || 'mouse'
  const eventTarget = getTarget(event)
  const win = (isElement(eventTarget) ? eventTarget.ownerDocument.defaultView : null) ?? window
  if (event instanceof win.KeyboardEvent) return 'keyboard'
  if (event instanceof win.FocusEvent) return lastInteractionType || 'keyboard'
  // A synthetic click carries no pointer type; the last tracked interaction is the modality then.
  if ('pointerType' in event) {
    return (event as PointerEvent).pointerType || lastInteractionType || 'keyboard'
  }
  if ('touches' in event) return 'touch'
  if (event instanceof win.MouseEvent) {
    return lastInteractionType || (event.detail === 0 ? 'keyboard' : 'mouse')
  }
  return ''
}

const LIST_LIMIT = 20
// Shared across every instance, so a dialog opened from another dialog can restore focus
// past a popup that has already unmounted.
let previouslyFocusedElements: WeakRef<Element>[] = []

function clearDisconnectedPreviouslyFocusedElements() {
  previouslyFocusedElements = previouslyFocusedElements.filter((entry) => {
    return entry.deref()?.isConnected
  })
}

function addPreviouslyFocusedElement(element: Element | null | undefined) {
  clearDisconnectedPreviouslyFocusedElements()
  if (element && getNodeName(element) !== 'body') {
    previouslyFocusedElements.push(new WeakRef(element))
    if (previouslyFocusedElements.length > LIST_LIMIT) {
      previouslyFocusedElements = previouslyFocusedElements.slice(-LIST_LIMIT)
    }
  }
}

function getPreviouslyFocusedElement() {
  clearDisconnectedPreviouslyFocusedElements()
  return previouslyFocusedElements[previouslyFocusedElements.length - 1]?.deref()
}

function getFirstTabbableElement(container: Element | null) {
  if (!container) {
    return null
  }
  return tabbable(container)[0] ?? container
}

function supportsPreventScroll(doc: Document): boolean {
  let supported = false
  doc.createElement('div').focus({
    get preventScroll() {
      supported = true
      return false
    }
  })
  return supported
}

function applyTabIndex(floatingFocusElement: HTMLElement) {
  if (floatingFocusElement.hasAttribute('tabindex') && !managedTabIndex.has(floatingFocusElement)) {
    return
  }

  if (!floatingFocusElement.getAttribute('role')?.includes('dialog')) {
    return
  }

  const tabbableSet = new Set<Element>(tabbable(floatingFocusElement))
  const focusableElements = focusable(floatingFocusElement)
  const tabbableContent = focusableElements.filter((element) => {
    const managed = managedTabIndex.get(element)
    return tabbableSet.has(element) || (managed != null && !managed.startsWith('-'))
  })
  const tabIndex = floatingFocusElement.getAttribute('tabindex')

  if (tabbableContent.length === 0) {
    if (tabIndex !== '0') {
      floatingFocusElement.setAttribute('tabindex', '0')
      // Record our own write so the externally-managed early-return above doesn't
      // mistake it for a user-authored `tabindex` and freeze management.
      managedTabIndex.set(floatingFocusElement, '0')
    }
  } else if (
    tabIndex !== '-1' ||
    (managedTabIndex.has(floatingFocusElement) &&
      managedTabIndex.get(floatingFocusElement) !== '-1')
  ) {
    floatingFocusElement.setAttribute('tabindex', '-1')
    managedTabIndex.set(floatingFocusElement, '-1')
  }
}

function effect(run: () => void | (() => void)): void {
  watchPostEffect(() => {
    const cleanup = run()
    if (typeof cleanup === 'function') onWatcherCleanup(cleanup)
  })
}

export function useFocusManager(options: FocusManagerOptions): void {
  const floatingTree = FloatingTreeContext.getOr()
  const nodeId = FloatingNodeContext.getOr()?.id
  const pointerDownTimeout = useTimeout()
  const restoreFocusFrame = useAnimationFrame()

  let previouslyFocused: HTMLElement | null = null
  let undoAriaHidden: (() => void) | null = null
  let undoMarkers: (() => void) | null = null
  let preventReturnFocus = false
  let beforeSentinelElement: HTMLSpanElement | null = null
  let afterSentinelElement: HTMLSpanElement | null = null
  let isPointerDown = false
  let lastInteractionType = ''
  let lastFocusedTabbable: FocusableElement | null = null
  let lastOpen = false
  let lastPopupElement: HTMLElement | null = null
  let lastFinalFocus: FocusTarget = undefined
  let openMethodAtOpen: string | null | undefined
  let lastCloseEvent: Event | null | undefined
  let lastCloseReason: string | null | undefined

  const open = computed(() => toValue(options.open))
  const modal = computed(() => toValue(options.modal))
  const enabled = computed(() => toValue(options.enabled))
  const popupElement = computed(() => toValue(options.popupElement))
  const triggerElement = computed(() => toValue(options.triggerElement))
  const initialFocus = computed(() => options.initialFocus())
  const finalFocus = computed(() => options.finalFocus())
  const openMethod = computed(() => toValue(options.openMethod))
  const closeEvent = computed(() => toValue(options.closeEvent))
  const closeReason = computed(() => toValue(options.closeReason))
  const closeOnFocusOut = computed(() => toValue(options.closeOnFocusOut))
  const onFocusOut = computed(() => options.onFocusOut?.())
  const getNextFocusableElement = options.getNextFocusableElement
  const restoreFocus = computed(() => toValue(options.restoreFocus))
  const insideElements = computed(() => toValue(options.insideElements))

  const active = computed(() => open.value && popupElement.value !== null && enabled.value)
  const hasNonModalGuards = getNextFocusableElement != null

  const isUntrappedTypeableCombobox = computed(
    () => isTypeableCombobox(triggerElement.value) && initialFocus.value === false
  )

  let currentOpenMethod: string | null | undefined
  let currentInsideElements: Array<HTMLElement | null> | undefined
  watch(openMethod, (value) => (currentOpenMethod = value), { immediate: true, flush: 'sync' })
  watch(insideElements, (value) => (currentInsideElements = value), {
    immediate: true,
    flush: 'sync'
  })

  function markPointerDown(): void {
    isPointerDown = true
    pointerDownTimeout.start(0, () => {
      isPointerDown = false
    })
  }

  function clearMarkOthers(): void {
    undoMarkers?.()
    undoMarkers = null
    undoAriaHidden?.()
    undoAriaHidden = null
  }

  function isRelatedFocusGuard(node: Element | null): boolean {
    if (node == null || !node.hasAttribute(FOCUS_GUARD_ATTRIBUTE)) return false
    return (
      node === beforeSentinelElement ||
      node === afterSentinelElement ||
      node === getNextFocusableElement?.()
    )
  }

  function relatedFloatingElements(): HTMLElement[] {
    if (!floatingTree || !nodeId) return []
    return [
      ...getNodeChildren(floatingTree.nodes, nodeId),
      ...getNodeAncestors(floatingTree.nodes, nodeId)
    ]
      .map((treeNode) => treeNode.floating)
      .filter((element) => element != null)
  }

  function isInsideFloatingTree(node: Element | null): boolean {
    return node != null && relatedFloatingElements().some((element) => contains(element, node))
  }

  function isInsideNestedFloatingElement(node: Element | null): boolean {
    if (node == null || !floatingTree || !nodeId) return false
    return getNodeChildren(floatingTree.nodes, nodeId).some((child) =>
      contains(child.floating, node)
    )
  }

  function isNested(): boolean {
    if (!floatingTree || !nodeId) return false
    return (floatingTree.nodes.find((treeNode) => treeNode.id === nodeId)?.parentId ?? null) != null
  }

  function syncOutsideMarkers(): (() => void) | void {
    const popup = popupElement.value
    const trigger = triggerElement.value

    if (!active.value || !popup) {
      clearMarkOthers()
      return
    }

    const portalElements: HTMLElement[] = []
    const portalParent = popup.closest(SHARDSUI_PORTAL_SELECTOR)
    if (portalParent) {
      const nestedPortals = portalParent.querySelectorAll(SHARDSUI_PORTAL_SELECTOR)
      portalElements.push(
        portalParent as HTMLElement,
        ...(Array.from(nestedPortals) as HTMLElement[])
      )
    }

    if (modal.value || isUntrappedTypeableCombobox.value) {
      const avoidElements = [popup, ...portalElements]
      if (trigger && isUntrappedTypeableCombobox.value) avoidElements.push(trigger)
      for (const el of currentInsideElements ?? []) {
        if (el) avoidElements.push(el)
      }

      if (floatingTree && nodeId) {
        void floatingTree.version.value
        for (const child of getNodeChildren(floatingTree.nodes, nodeId)) {
          if (child.floating) avoidElements.push(child.floating)
        }
      }

      undoAriaHidden = markOthers(avoidElements, { ariaHidden: true, mark: false })
    }

    undoMarkers = markOthers([popup, ...portalElements], { mark: true })

    return () => clearMarkOthers()
  }

  /**
   * Safari randomly scrolls to the bottom of the page when an input inside a popup still has
   * focus as the popup unmounts; blurring it first prevents that.
   */
  function blurTypeableBeforeUnmount(): void {
    const popup = popupElement.value

    if (!isWebKit || open.value || !popup) {
      return
    }

    const activeEl = popup.ownerDocument.activeElement
    if (!isHTMLElement(activeEl) || !isTypeableElement(activeEl)) {
      return
    }

    if (contains(popup, activeEl)) {
      activeEl.blur()
    }
  }

  function trackInteractionType(): (() => void) | void {
    const popup = popupElement.value
    if (!open.value || !popup || !enabled.value) return

    const doc = popup.ownerDocument

    const onpointerdown = (event: PointerEvent) => {
      lastInteractionType = event.pointerType || 'keyboard'

      const target = getTarget(event)
      if (isElement(target) && target.closest(CLICK_TRIGGER_SELECTOR)) {
        markPointerDown()
      }
    }

    const onkeydown = () => {
      lastInteractionType = 'keyboard'
    }

    const cleanups = [
      listen(doc, 'pointerdown', onpointerdown, { capture: true }),
      listen(doc, 'keydown', onkeydown, { capture: true })
    ]
    return () => cleanups.forEach((cleanup) => cleanup())
  }

  watch(
    [open, popupElement, finalFocus, closeEvent, closeReason],
    ([isOpen, popup, final, event, reason]) => {
      lastOpen = isOpen
      lastPopupElement = popup
      lastFinalFocus = final
      lastCloseEvent = event
      lastCloseReason = reason
    },
    { immediate: true, flush: 'sync' }
  )

  function trackReturnFocus(): (() => void) | void {
    const popup = popupElement.value
    const trigger = triggerElement.value
    // The cleanup below reads the recorded close event and reason, so this effect has to observe
    // them too: it must be queued in the flush that records the close, ahead of the
    // close-transition completion that clears the reason.
    void closeEvent.value
    void closeReason.value
    if (!active.value || !popup) return

    const focusedOnOpen = popup.ownerDocument.activeElement as HTMLElement | null
    previouslyFocused =
      focusedOnOpen && containsThroughPortals(popup, focusedOnOpen) ? trigger : focusedOnOpen
    addPreviouslyFocusedElement(previouslyFocused)
    openMethodAtOpen = currentOpenMethod

    return () => restoreReturnFocus(trigger)
  }

  function applyInitialFocus(): (() => void) | void {
    const popup = popupElement.value
    if (!active.value || !popup) return

    lastInteractionType = ''

    const doc = popup.ownerDocument

    const target = initialFocus.value
    if (target === false) return

    const interactionType = currentOpenMethod ?? 'mouse'

    const floatingFocusElement = getFloatingFocusElement(popup)

    if (contains(floatingFocusElement, doc.activeElement)) return

    const resolveTarget = (): FocusableElement | null => {
      if (isHTMLElement(target)) return target
      if (typeof target === 'function') {
        const result = target(interactionType)
        if (isHTMLElement(result)) return result
        if (result === false || result === undefined) return null
      }
      return tabbable(floatingFocusElement)[0] ?? floatingFocusElement
    }

    const frameId = requestAnimationFrameTick(() => {
      const resolved = resolveTarget()
      if (!resolved) return
      const activeEl = doc.activeElement
      if (activeEl && contains(popup, activeEl)) return
      // A nested popup opened during this frame renders outside the subtree, so `popup.contains`
      // above cannot see that it took focus and the tree has to be consulted too.
      if (activeEl && containsThroughPortals(popup, activeEl)) return
      if (isInsideNestedFloatingElement(activeEl)) return
      resolved.focus({ preventScroll: true })
    })

    return () => cancelAnimationFrameTick(frameId)
  }

  function restoreReturnFocus(trigger: HTMLElement | null): void {
    if (lastOpen || !previouslyFocused) {
      preventReturnFocus = false
      return
    }

    if (preventReturnFocus) {
      preventReturnFocus = false
      previouslyFocused = null
      return
    }

    if (lastCloseReason === REASONS.triggerHover && lastCloseEvent?.type === 'mouseleave') {
      previouslyFocused = null
      return
    }

    if (lastCloseReason === REASONS.outsidePress && !isNested()) {
      const pressEvent = lastCloseEvent as MouseEvent | PointerEvent | null | undefined
      const virtual =
        !!pressEvent &&
        (isVirtualClick(pressEvent) || isVirtualPointerEvent(pressEvent as PointerEvent))

      if (!virtual && !supportsPreventScroll(lastPopupElement?.ownerDocument ?? document)) {
        previouslyFocused = null
        return
      }
    }

    if (lastFinalFocus === false) {
      previouslyFocused = null
      return
    }

    const interactionType = getEventType(lastCloseEvent, lastInteractionType)

    const preferPreviousFocus = openMethodAtOpen == null

    const previousFocusTarget = previouslyFocused
    const referenceReturnElement = trigger?.isConnected ? trigger : null
    const previousReturnElement =
      previousFocusTarget?.isConnected && getNodeName(previousFocusTarget) !== 'body'
        ? previousFocusTarget
        : null

    let defaultReturnElement = preferPreviousFocus
      ? previousReturnElement || referenceReturnElement
      : referenceReturnElement || previousReturnElement

    if (!defaultReturnElement) {
      defaultReturnElement = (getPreviouslyFocusedElement() ?? null) as HTMLElement | null
    }

    let target: HTMLElement | null = null
    if (isHTMLElement(lastFinalFocus)) {
      target = lastFinalFocus
    } else if (typeof lastFinalFocus === 'function') {
      const result = lastFinalFocus(interactionType)
      if (isHTMLElement(result)) target = result
    }

    if (!target) target = defaultReturnElement

    const hasExplicitReturnFocus =
      isHTMLElement(lastFinalFocus) || typeof lastFinalFocus === 'function'
    const popup = lastPopupElement
    const doc = popup?.ownerDocument ?? document

    const captured = getFirstTabbableElement(target) as HTMLElement | null
    const relatedFloating = relatedFloatingElements()
    queueMicrotask(() => {
      const activeEl = doc.activeElement
      const focusInsideTree =
        contains(popup, activeEl) ||
        (activeEl != null && relatedFloating.some((element) => contains(element, activeEl)))
      if (
        !hasExplicitReturnFocus &&
        captured !== activeEl &&
        activeEl !== doc.body &&
        !focusInsideTree
      ) {
        previouslyFocused = null
        return
      }
      captured?.focus({
        preventScroll: true,
        focusVisible: interactionType === 'keyboard' ? true : undefined
      } as FocusOptions)
    })
    previouslyFocused = null
  }

  function closeOnFocusOutside(): (() => void) | void {
    const popup = popupElement.value
    if (!active.value || !popup) return
    const handleFocusOut = onFocusOut.value
    if (!closeOnFocusOut.value || handleFocusOut == null) return

    const trigger = triggerElement.value
    const trapsFocus = modal.value
    const untrappedCombobox = isUntrappedTypeableCombobox.value

    let disposed = false

    const isInside = (node: Element | null) => {
      if (!node) return false
      if (containsThroughPortals(popup, node)) return true
      if (contains(trigger, node)) return true
      for (const el of insideElements.value ?? []) {
        if (contains(el, node)) return true
      }
      return false
    }

    const dismissIfFocusLeft = (event: FocusEvent, fromTrigger: boolean) => {
      const relatedTarget = event.relatedTarget as Element | null
      const target = getTarget(event)

      if (trapsFocus && relatedTarget == null && isElement(target) && contains(popup, target)) {
        addPreviouslyFocusedElement(target)
      }

      if (isPointerDown) return

      queueMicrotask(() => {
        if (disposed) return
        if (fromTrigger) {
          applyTabIndex(getFloatingFocusElement(popup))
        }

        if (
          isInside(relatedTarget) ||
          isInsideFloatingTree(relatedTarget) ||
          isRelatedFocusGuard(relatedTarget)
        )
          return

        if (!relatedTarget) return

        if (isElement(relatedTarget) && isInjectedAfterOpen(relatedTarget, popup)) return

        if (trapsFocus && !untrappedCombobox) return

        if (!untrappedCombobox && relatedTarget === getPreviouslyFocusedElement()) {
          return
        }

        preventReturnFocus = true
        handleFocusOut(event)
      })
    }

    const cleanups = [
      listen(popup, 'focusout', (event: FocusEvent) => dismissIfFocusLeft(event, false))
    ]
    if (trigger) {
      cleanups.push(
        listen(trigger, 'focusout', (event: FocusEvent) => dismissIfFocusLeft(event, true)),
        // In Safari, buttons lose focus when pressing them.
        listen(trigger, 'pointerdown', markPointerDown)
      )
    }
    return () => {
      disposed = true
      cleanups.forEach((cleanup) => cleanup())
    }
  }

  function restoreFocusInsidePopup(): (() => void) | void {
    const popup = popupElement.value
    const restore = restoreFocus.value
    const restorePopupOnly = restore === 'popup'
    if (!restore || !active.value || !popup) return

    const onfocusin = (event: FocusEvent) => {
      const target = getTarget(event)
      if (isElement(target) && isTabbable(target)) lastFocusedTabbable = target
    }

    const onfocusout = (event: FocusEvent) => {
      const target = getTarget(event)
      const floatingFocusElement = getFloatingFocusElement(popup)

      queueMicrotask(() => {
        if (isElement(target) && isElementVisible(target)) return
        const doc = popup.ownerDocument
        const activeEl = doc.activeElement
        if (activeEl !== doc.body) return

        floatingFocusElement.focus()

        if (restorePopupOnly) {
          // An element removed during the same pointerdown drops the focus set above.
          restoreFocusFrame.request(() => {
            floatingFocusElement.focus()
          })
          return
        }

        const tabbableContent = tabbable(floatingFocusElement)
        const previous = lastFocusedTabbable
        const next =
          (previous && tabbableContent.includes(previous) ? previous : null) ??
          tabbableContent[tabbableContent.length - 1] ??
          floatingFocusElement
        next.focus()
      })
    }

    const offFocusIn = listen(popup, 'focusin', onfocusin)
    const offFocusOut = listen(popup, 'focusout', onfocusout)
    return () => {
      offFocusIn()
      offFocusOut()
      lastFocusedTabbable = null
      restoreFocusFrame.cancel()
    }
  }

  function renderFocusGuards(): (() => void) | void {
    const popup = popupElement.value
    const isModal = modal.value

    if (
      !active.value ||
      !popup ||
      isUntrappedTypeableCombobox.value ||
      (!isModal && !hasNonModalGuards)
    )
      return

    const doc = popup.ownerDocument

    function makeSentinel(): HTMLSpanElement {
      const span = doc.createElement('span')
      span.setAttribute('tabindex', '0')
      span.setAttribute('aria-hidden', 'true')
      span.setAttribute(FOCUS_GUARD_ATTRIBUTE, '')
      span.style.cssText = visuallyHidden
      return span
    }

    const beforeSentinel = makeSentinel()
    const afterSentinel = makeSentinel()

    const detachBeforeSentinel = listen(beforeSentinel, 'focus', (event: FocusEvent) => {
      const floatingFocusElement = getFloatingFocusElement(popup)
      const tabbableElements = tabbable(floatingFocusElement)
      if (isModal) {
        ;(tabbableElements[tabbableElements.length - 1] ?? floatingFocusElement).focus()
        return
      }
      preventReturnFocus = false
      const related = event.relatedTarget as Node | null
      if (contains(popup, related)) {
        triggerElement.value?.focus()
      } else {
        ;(tabbableElements[0] ?? floatingFocusElement).focus()
      }
    })

    const detachAfterSentinel = listen(afterSentinel, 'focus', (event: FocusEvent) => {
      const floatingFocusElement = getFloatingFocusElement(popup)
      const tabbableElements = tabbable(floatingFocusElement)
      if (isModal) {
        ;(tabbableElements[0] ?? floatingFocusElement).focus()
        return
      }
      const related = event.relatedTarget as Node | null
      if (contains(popup, related)) {
        if (closeOnFocusOut.value) {
          preventReturnFocus = true
        }
        getNextFocusableElement?.()?.focus()
      } else {
        ;(tabbableElements[tabbableElements.length - 1] ?? floatingFocusElement).focus()
      }
    })

    const parent = popup.parentNode
    if (parent) {
      parent.insertBefore(beforeSentinel, popup)
      parent.insertBefore(afterSentinel, popup.nextSibling)
    }

    beforeSentinelElement = beforeSentinel
    afterSentinelElement = afterSentinel

    return () => {
      detachBeforeSentinel()
      detachAfterSentinel()
      beforeSentinel.remove()
      afterSentinel.remove()
      beforeSentinelElement = null
      afterSentinelElement = null
    }
  }

  function blockTabWithNoTabbableContent(): (() => void) | void {
    const popup = popupElement.value
    if (!active.value || !popup || !modal.value || isUntrappedTypeableCombobox.value) return

    const onkeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const tabbableElements = tabbable(getFloatingFocusElement(popup))
      if (tabbableElements.length === 0) {
        event.preventDefault()
      }
    }

    return listen(popup, 'keydown', onkeydown, { capture: true })
  }

  function syncFloatingTabIndex(): (() => void) | void {
    const popup = popupElement.value
    if (!active.value || !popup) return

    const syncTabIndex = () => {
      applyTabIndex(getFloatingFocusElement(popup))
    }

    syncTabIndex()

    const observer = new MutationObserver(syncTabIndex)
    observer.observe(popup, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['tabindex', 'disabled', 'hidden', 'inert']
    })

    return () => {
      observer.disconnect()
      queueMicrotask(clearDisconnectedPreviouslyFocusedElements)
    }
  }

  effect(syncOutsideMarkers)
  effect(blurTypeableBeforeUnmount)
  effect(trackInteractionType)
  effect(trackReturnFocus)
  effect(applyInitialFocus)
  effect(closeOnFocusOutside)
  effect(restoreFocusInsidePopup)
  effect(renderFocusGuards)
  effect(blockTabWithNoTabbableContent)
  effect(syncFloatingTabIndex)
}
