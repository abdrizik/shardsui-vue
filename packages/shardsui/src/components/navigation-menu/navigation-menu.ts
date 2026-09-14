import {
  computed,
  shallowReactive,
  shallowRef,
  toValue,
  watch,
  watchPostEffect,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
  type ShallowRef
} from 'vue'
import { contains } from '@/internal/dom'
import { isClickLikeEvent } from '@/internal/floating/event'
import {
  attachFloatingNode,
  getNodeChildren,
  type FloatingTree
} from '@/internal/floating/floating-tree'
import { dispatchOpenChange } from '@/internal/floating/hover/interaction'
import type { FloatingContextData } from '@/internal/floating/types'
import { openChangeComplete } from '@/internal/open-change-complete'
import { createPopupTriggerMap, type PopupTriggerMap } from '@/internal/popup-trigger-map'
import { REASONS } from '@/internal/reasons'
import { useTransitionStatus, type TransitionStatus } from '@/internal/transition-status'
import { createPopupSizing, type PopupSizing } from './popup-sizing'

export type ActivationDirection = 'left' | 'right' | 'up' | 'down' | null

export type ContentStatus = 'starting' | 'idle' | 'ending'

type CloseReason =
  | typeof REASONS.triggerPress
  | typeof REASONS.triggerHover
  | typeof REASONS.outsidePress
  | typeof REASONS.listNavigation
  | typeof REASONS.focusOut
  | typeof REASONS.escapeKey
  | typeof REASONS.linkPress

const BLOCKED_RETURN_FOCUS_REASONS = new Set<CloseReason>([
  REASONS.triggerHover,
  REASONS.outsidePress,
  REASONS.focusOut
])

export type NavigationMenuRootOptions = {
  value: MaybeRefOrGetter<unknown>
  setValue: (value: unknown) => void
  delay: MaybeRefOrGetter<number>
  closeDelay: MaybeRefOrGetter<number>
  orientation: MaybeRefOrGetter<'horizontal' | 'vertical'>
  onOpenChangeComplete?: () => ((open: boolean) => void) | undefined
  parentRoot: MaybeRefOrGetter<NavigationMenuRoot | undefined>
  ref: MaybeRefOrGetter<HTMLElement | null>
}

export type NavigationMenuRoot = {
  data: FloatingContextData
  triggerElements: PopupTriggerMap
  activeTriggerElement: ShallowRef<HTMLElement | null>
  prevTriggerElement: ShallowRef<HTMLElement | null>
  popupElement: ShallowRef<HTMLElement | null>
  positionerElement: ShallowRef<HTMLElement | null>
  viewportElement: ShallowRef<HTMLElement | null>
  viewportTargetElement: ShallowRef<HTMLElement | null>
  viewportInert: ShallowRef<boolean>
  currentContentElement: ShallowRef<HTMLElement | null>
  beforeOutsideElement: ShallowRef<HTMLElement | null>
  afterOutsideElement: ShallowRef<HTMLElement | null>
  beforeInsideElement: ShallowRef<HTMLElement | null>
  afterInsideElement: ShallowRef<HTMLElement | null>
  sizing: PopupSizing
  floatingTree: FloatingTree
  floatingNodeId: string
  floatingParentNodeId: string | null
  rootElement: ComputedRef<HTMLElement | null>
  value: ComputedRef<unknown>
  delay: ComputedRef<number>
  closeDelay: ComputedRef<number>
  orientation: ComputedRef<'horizontal' | 'vertical'>
  parentRoot: ComputedRef<NavigationMenuRoot | undefined>
  mounted: Readonly<Ref<boolean>>
  transitionStatus: Readonly<Ref<TransitionStatus>>
  open: ComputedRef<boolean>
  nested: ComputedRef<boolean>
  domReferenceElement: Readonly<Ref<HTMLElement | null>>
  floatingElement: ComputedRef<HTMLElement | null>
  interactionsEnabled: ComputedRef<boolean>
  hoverInteractionsEnabled: ComputedRef<boolean>
  activationDirection: ComputedRef<ActivationDirection>
  setActivationDirection: (next: ActivationDirection) => void
  containsTrigger: (node: EventTarget | null | undefined) => boolean
  closeOnFocusOut: (element: Element | null, event: FocusEvent) => void
  setOpen: (nextOpen: boolean, reason?: string, event?: Event, trigger?: HTMLElement | null) => void
  setValue: (next: unknown, reason?: CloseReason, event?: Event) => void
  registerTrigger: (itemValue: unknown, id: string, element: HTMLElement) => () => void
}

export function useNavigationMenuRoot(options: NavigationMenuRootOptions): NavigationMenuRoot {
  const data: FloatingContextData = {}
  const triggerElements = createPopupTriggerMap()

  const activeTriggerElement = shallowRef<HTMLElement | null>(null)
  const prevTriggerElement = shallowRef<HTMLElement | null>(null)
  const popupElement = shallowRef<HTMLElement | null>(null)
  const positionerElement = shallowRef<HTMLElement | null>(null)
  const viewportElement = shallowRef<HTMLElement | null>(null)
  const viewportTargetElement = shallowRef<HTMLElement | null>(null)
  const viewportInert = shallowRef(false)
  const currentContentElement = shallowRef<HTMLElement | null>(null)

  const beforeOutsideElement = shallowRef<HTMLElement | null>(null)
  const afterOutsideElement = shallowRef<HTMLElement | null>(null)
  const beforeInsideElement = shallowRef<HTMLElement | null>(null)
  const afterInsideElement = shallowRef<HTMLElement | null>(null)

  const activationDirectionValue = shallowRef<ActivationDirection>(null)
  let closeReason: CloseReason | undefined

  const triggers = shallowReactive(new Map<unknown, HTMLElement>())

  const rootElement = computed(() => toValue(options.ref))
  const value = computed(() => toValue(options.value))
  const delay = computed(() => toValue(options.delay))
  const closeDelay = computed(() => toValue(options.closeDelay))
  const orientation = computed(() => toValue(options.orientation))
  const parentRoot = computed(() => toValue(options.parentRoot))

  const open = computed(() => value.value != null)
  const nested = computed(() => parentRoot.value != null)

  const transition = useTransitionStatus({
    open
  })
  const floatingElement = computed(() => positionerElement.value ?? viewportElement.value)

  const interactionsEnabled = computed(() => positionerElement.value != null || value.value == null)
  const hoverInteractionsEnabled = computed(
    () => floatingElement.value != null || value.value == null
  )

  const activationDirection = computed(() => (open.value ? activationDirectionValue.value : null))

  function setActivationDirection(next: ActivationDirection): void {
    activationDirectionValue.value = next
  }

  function resolveTriggerValue(trigger: HTMLElement | null | undefined): unknown {
    if (!trigger) return undefined
    for (const [itemValue, el] of triggers) {
      if (el.contains(trigger)) return itemValue
    }
    return undefined
  }

  function containsTrigger(node: EventTarget | null | undefined): boolean {
    if (triggerElements.containsNode(node)) return true
    return parentRoot.value?.containsTrigger(node) ?? false
  }

  function closeOnFocusOut(element: Element | null, event: FocusEvent): void {
    const popup = popupElement.value
    if (!positionerElement.value || !popup) return

    const relatedTarget = event.relatedTarget as Element | null
    const nodeChildrenContains = getNodeChildren(floatingNode.tree.nodes, floatingNode.nodeId).some(
      (node) => contains(node.floating, relatedTarget)
    )

    if (
      !contains(popup, element) &&
      !contains(popup, relatedTarget) &&
      !contains(rootElement.value, relatedTarget) &&
      !nodeChildrenContains
    ) {
      setValue(null, REASONS.focusOut, event)
    }
  }

  function isReturnFocusBlocked(): boolean {
    return closeReason ? BLOCKED_RETURN_FOCUS_REASONS.has(closeReason) : false
  }

  function completeClose(): void {
    if (!isReturnFocusBlocked() && prevTriggerElement.value && popupElement.value) {
      const activeEl = (rootElement.value?.ownerDocument ?? document).activeElement
      if (
        contains(popupElement.value, activeEl) ||
        activeEl === popupElement.value.ownerDocument.body
      ) {
        prevTriggerElement.value.focus({ preventScroll: true })
        prevTriggerElement.value = null
      }
    }

    transition.mounted.value = false
    options.onOpenChangeComplete?.()?.(false)
    setActivationDirection(null)
    currentContentElement.value = null
    closeReason = undefined
  }

  function setOpen(
    nextOpen: boolean,
    reason?: string,
    event?: Event,
    trigger?: HTMLElement | null
  ): void {
    if (positionerElement.value == null && value.value != null) return

    if (!nextOpen && value.value == null) return
    if (!nextOpen && trigger != null && value.value !== resolveTriggerValue(trigger)) return

    const wasOpen = open.value

    if (!nextOpen || !wasOpen || (event != null && isClickLikeEvent(event.type))) {
      data.openEvent = nextOpen ? event : undefined
    }
    if (nextOpen !== wasOpen) {
      dispatchOpenChange(data, nextOpen, reason)
    }

    if (nextOpen) {
      const itemValue = resolveTriggerValue(trigger)
      if (itemValue !== undefined) setValue(itemValue, reason as CloseReason, event)
    } else {
      setValue(null, reason as CloseReason, event)
    }
  }

  function setValue(next: unknown, reason?: CloseReason, event?: Event): void {
    if (next == null) {
      closeReason = reason
      setActivationDirection(null)
    }

    options.setValue(next)

    const parent = parentRoot.value
    if (parent && next == null && reason === REASONS.linkPress) {
      parent.setValue(null, reason, event)
    }
  }

  function registerTrigger(itemValue: unknown, id: string, element: HTMLElement): () => void {
    triggers.set(itemValue, element)
    const unregister = triggerElements.add(id, element)
    if (value.value != null && itemValue === value.value) {
      activeTriggerElement.value = element
    }
    return () => {
      if (triggers.get(itemValue) === element) {
        triggers.delete(itemValue)
      }
      unregister()
    }
  }

  openChangeComplete({
    open,
    element: popupElement,
    onComplete: () => {
      if (!open.value) completeClose()
    }
  })

  openChangeComplete({
    open,
    element: viewportTargetElement,
    onComplete: () => {
      if (!open.value) completeClose()
    }
  })

  const floatingNode = attachFloatingNode({
    open: () => positionerElement.value != null && open.value,
    floating: () => floatingElement.value
  })

  watch(
    value,
    () => {
      viewportInert.value = false
    },
    { flush: 'post' }
  )

  watchPostEffect(() => {
    if (value.value == null) {
      activeTriggerElement.value = null
      return
    }
    const el = triggers.get(value.value)
    if (el) {
      activeTriggerElement.value = el
    }
  })

  const sizing = createPopupSizing({
    popupElement,
    positionerElement,
    currentContentElement,
    value,
    mounted: transition.mounted,
    transitionStatus: transition.status
  })

  const root: NavigationMenuRoot = {
    data,
    triggerElements,
    activeTriggerElement,
    prevTriggerElement,
    popupElement,
    positionerElement,
    viewportElement,
    viewportTargetElement,
    viewportInert,
    currentContentElement,
    beforeOutsideElement,
    afterOutsideElement,
    beforeInsideElement,
    afterInsideElement,
    sizing,
    floatingTree: floatingNode.tree,
    floatingNodeId: floatingNode.nodeId,
    floatingParentNodeId: floatingNode.parentNodeId,
    rootElement,
    value,
    delay,
    closeDelay,
    orientation,
    parentRoot,
    mounted: transition.mounted,
    transitionStatus: transition.status,
    open,
    nested,
    domReferenceElement: activeTriggerElement,
    floatingElement,
    interactionsEnabled,
    hoverInteractionsEnabled,
    activationDirection,
    setActivationDirection,
    containsTrigger,
    closeOnFocusOut,
    setOpen,
    setValue,
    registerTrigger
  }

  return root
}
