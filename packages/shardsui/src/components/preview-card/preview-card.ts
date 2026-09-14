import {
  computed,
  onScopeDispose,
  shallowRef,
  toValue,
  watch,
  watchEffect,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
  type ShallowRef
} from 'vue'
import { createRootRegistrations } from '@/internal/detached-handle'
import {
  selectActiveTrigger,
  useDetachedTriggerSelectionById,
  type ActiveTriggerSelection
} from '@/internal/detached-trigger-selection'
import { isClickLikeEvent } from '@/internal/floating/event'
import { attachFloatingNode, type FloatingTree } from '@/internal/floating/floating-tree'
import { dispatchOpenChange } from '@/internal/floating/hover/interaction'
import type { InlineRectCoords } from '@/internal/floating/inline-rect'
import type { FloatingContextData } from '@/internal/floating/types'
import { openChangeCompleteClose } from '@/internal/open-change-complete'
import { createPopupTriggerMap, type PopupTriggerMap } from '@/internal/popup-trigger-map'
import { REASONS } from '@/internal/reasons'
import { useTransitionStatus, type TransitionStatus } from '@/internal/transition-status'
import type { PreviewCardOpenReason } from './context'

export const OPEN_DELAY = 600
export const CLOSE_DELAY = 300

export type PreviewCardRootOptions = {
  open: MaybeRefOrGetter<boolean>
  setOpen: (open: boolean) => void
  onOpenChangeComplete: () => ((open: boolean) => void) | undefined
  triggerId: MaybeRefOrGetter<string | null>
  setTriggerId: (triggerId: string | null) => void
}

type Transition = ReturnType<typeof useTransitionStatus>

type PreviewCardRegistration = {
  options: PreviewCardRootOptions
  transition: Transition
}

export type PreviewCardTriggerBindings = {
  payload: unknown
  closeDelay: number
}

export type PreviewCardInstantType = 'dismiss' | 'focus'

export type PreviewCardRoot<Payload = unknown> = {
  triggerElement: ShallowRef<HTMLElement | null>
  popupElement: ShallowRef<HTMLElement | null>
  positionerElement: ShallowRef<HTMLElement | null>
  payload: ShallowRef<Payload | undefined>
  instantType: ShallowRef<PreviewCardInstantType | undefined>
  closeDelay: ShallowRef<number>
  openChangeReason: ShallowRef<PreviewCardOpenReason | null>
  hasViewport: ShallowRef<boolean>
  inlineRectCoords: InlineRectCoords | undefined
  floatingTree: FloatingTree | undefined
  floatingNodeId: string | undefined
  data: FloatingContextData
  readonly triggerElements: PopupTriggerMap<PreviewCardTriggerBindings>
  attached: ComputedRef<boolean>
  open: ComputedRef<boolean>
  onOpenChangeComplete: ComputedRef<((open: boolean) => void) | undefined>
  activeTriggerId: ComputedRef<string | null>
  mounted: ComputedRef<boolean>
  transitionStatus: ComputedRef<TransitionStatus>
  domReferenceElement: Readonly<Ref<HTMLElement | null>>
  floatingElement: Readonly<Ref<HTMLElement | null>>
  setActiveTriggerId: (next: string | null) => void
  applyTriggerBindings: (bindings: PreviewCardTriggerBindings) => void
  setOpen: (
    next: boolean,
    reason?: PreviewCardOpenReason,
    event?: Event,
    trigger?: HTMLElement | null
  ) => boolean
  containsTrigger: (target: Node) => boolean
  register: (options: PreviewCardRootOptions) => void
}

export function createPreviewCardRoot<Payload = unknown>(): PreviewCardRoot<Payload> {
  const triggerElement = shallowRef<HTMLElement | null>(null)
  const popupElement = shallowRef<HTMLElement | null>(null)
  const positionerElement = shallowRef<HTMLElement | null>(null)
  const payload = shallowRef<Payload | undefined>(undefined)
  const instantType = shallowRef<PreviewCardInstantType | undefined>(undefined)
  const closeDelay = shallowRef(CLOSE_DELAY)
  const openChangeReason = shallowRef<PreviewCardOpenReason | null>(null)
  const hasViewport = shallowRef(false)

  const data: FloatingContextData = {}
  const triggerElements = createPopupTriggerMap<PreviewCardTriggerBindings>()

  const attachedOptions = shallowRef<PreviewCardRootOptions | null>(null)
  const transition = shallowRef<Transition | undefined>(undefined)
  const activeTriggerOverride = shallowRef<string | null>(null)

  const registrations = createRootRegistrations<PreviewCardRegistration>(
    'PreviewCard',
    (registration) => {
      attachedOptions.value = registration?.options ?? null
      transition.value = registration?.transition
      if (registration) return
      payload.value = undefined
      triggerElement.value = null
    }
  )

  const attached = computed(() => attachedOptions.value != null)
  const open = computed(() => toValue(attachedOptions.value?.open ?? false))
  const onOpenChangeComplete = computed(() => attachedOptions.value?.onOpenChangeComplete())
  const activeTriggerId = computed(
    () => activeTriggerOverride.value ?? toValue(attachedOptions.value?.triggerId ?? null)
  )

  watch(
    () => toValue(attachedOptions.value?.triggerId ?? null),
    () => {
      activeTriggerOverride.value = null
    },
    { flush: 'sync' }
  )

  const mounted = computed(() => transition.value?.mounted.value ?? false)
  const transitionStatus = computed(() => transition.value?.status.value)

  function setActiveTriggerId(next: string | null): void {
    attachedOptions.value?.setTriggerId(next)
    activeTriggerOverride.value = next
  }

  function applyTriggerBindings(bindings: PreviewCardTriggerBindings): void {
    payload.value = bindings.payload as Payload | undefined
    closeDelay.value = bindings.closeDelay
  }

  function applyTriggerBindingsById(id: string | null): void {
    if (!id) return
    const bindings = triggerElements.getTriggerBindingsById(id)
    if (bindings) applyTriggerBindings(bindings)
  }

  const triggerSelection: ActiveTriggerSelection = {
    setActiveTriggerId,
    setTriggerElement: (element) => {
      triggerElement.value = element
    },
    applyTriggerBindings: applyTriggerBindingsById
  }

  function setOpen(
    next: boolean,
    reason?: PreviewCardOpenReason,
    event?: Event,
    trigger?: HTMLElement | null
  ): boolean {
    if (!attachedOptions.value) return false

    if (!next || !open.value || (event != null && isClickLikeEvent(event.type))) {
      data.openEvent = next ? event : undefined
    }
    dispatchOpenChange(data, next, reason)

    attachedOptions.value?.setOpen(next)

    openChangeReason.value = reason ?? null

    if (next && reason === REASONS.triggerFocus) {
      instantType.value = 'focus'
    } else if (!next && (reason === REASONS.triggerPress || reason === REASONS.escapeKey)) {
      instantType.value = 'dismiss'
    } else if (reason === REASONS.triggerHover) {
      instantType.value = undefined
    }

    selectActiveTrigger(triggerSelection, next, trigger)

    return open.value === next
  }

  function containsTrigger(target: Node): boolean {
    return triggerElements.containsNode(target)
  }

  function register(options: PreviewCardRootOptions): void {
    attachedOptions.value = options

    const floatingNode = attachFloatingNode({
      open: () => open.value,
      floating: () => popupElement.value
    })
    root.floatingTree = floatingNode.tree
    root.floatingNodeId = floatingNode.nodeId

    const ownTransition = useTransitionStatus({
      open
    })
    transition.value = ownTransition

    const detach = registrations.add({ options, transition: ownTransition })
    onScopeDispose(detach)

    openChangeCompleteClose({
      open,
      element: popupElement,
      transition: ownTransition,
      onOpenChangeComplete: () => onOpenChangeComplete.value,
      onClosed: () => {
        root.inlineRectCoords = undefined
        setActiveTriggerId(null)
      }
    })

    useDetachedTriggerSelectionById({
      ...triggerSelection,
      triggerElements,
      triggerId: activeTriggerId,
      open,
      activeTriggerId,
      triggerElement,
      closeOnActiveTriggerUnmount: () => setOpen(false, REASONS.none)
    })

    watchEffect(() => {
      if (open.value && activeTriggerId.value == null) {
        payload.value = undefined
      }
    })
  }

  const root: PreviewCardRoot<Payload> = {
    triggerElement,
    popupElement,
    positionerElement,
    payload,
    instantType,
    closeDelay,
    openChangeReason,
    hasViewport,
    inlineRectCoords: undefined,
    floatingTree: undefined,
    floatingNodeId: undefined,
    data,
    triggerElements,
    attached,
    open,
    onOpenChangeComplete,
    activeTriggerId,
    mounted,
    transitionStatus,
    domReferenceElement: triggerElement,
    floatingElement: popupElement,
    setActiveTriggerId,
    applyTriggerBindings,
    setOpen,
    containsTrigger,
    register
  }

  return root
}
