import {
  computed,
  onScopeDispose,
  shallowRef,
  toValue,
  watch,
  watchPostEffect,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
  type ShallowRef
} from 'vue'
import { PATIENT_CLICK_THRESHOLD } from '@/internal/constants'
import { createRootRegistrations } from '@/internal/detached-handle'
import {
  selectActiveTrigger,
  useDetachedTriggerSelectionById,
  type ActiveTriggerSelection
} from '@/internal/detached-trigger-selection'
import { isClickLikeEvent } from '@/internal/floating/event'
import { attachFloatingNode, type FloatingTree } from '@/internal/floating/floating-tree'
import { dispatchOpenChange } from '@/internal/floating/hover/interaction'
import type { FloatingContextData } from '@/internal/floating/types'
import { openChangeCompleteClose } from '@/internal/open-change-complete'
import {
  useOpenInteractionHandlers,
  type OpenInteractionHandlers
} from '@/internal/open-interaction-handlers'
import { createPopupTriggerMap, type PopupTriggerMap } from '@/internal/popup-trigger-map'
import { REASONS } from '@/internal/reasons'
import { createTimeout } from '@/internal/timeout'
import { useTransitionStatus, type TransitionStatus } from '@/internal/transition-status'
import type { PopoverOpenReason } from './context'

export type PopoverRootOptions = {
  open: MaybeRefOrGetter<boolean>
  setOpen: (open: boolean) => void
  modal: MaybeRefOrGetter<boolean | 'trap-focus'>
  onOpenChangeComplete: () => ((open: boolean) => void) | undefined
  triggerId: MaybeRefOrGetter<string | null>
  setTriggerId: (triggerId: string | null) => void
}

type Transition = ReturnType<typeof useTransitionStatus>

type PopoverRegistration = {
  options: PopoverRootOptions
  transition: Transition
  openInteraction: OpenInteractionHandlers
}

export type PopoverTriggerBindings = {
  payload: unknown
  disabled: boolean
  openOnHover: boolean
  closeDelay: number
}

export type PopoverInstantType = 'click' | 'dismiss' | 'focus' | 'trigger-change'

export type PopoverRoot<Payload = unknown> = {
  triggerElement: ShallowRef<HTMLElement | null>
  popupElement: ShallowRef<HTMLElement | null>
  positionerElement: ShallowRef<HTMLElement | null>
  triggerFocusTargetElement: ShallowRef<HTMLElement | null>
  popupId: ShallowRef<string | undefined>
  titleId: ShallowRef<string | undefined>
  descriptionId: ShallowRef<string | undefined>
  payload: ShallowRef<Payload | undefined>
  openChangeReason: ShallowRef<PopoverOpenReason | null>
  instantType: ShallowRef<PopoverInstantType | undefined>
  closePartCount: ShallowRef<number>
  stickIfOpen: boolean
  triggerDisabled: ShallowRef<boolean>
  openOnHover: ShallowRef<boolean>
  closeDelay: ShallowRef<number>
  hasViewport: ShallowRef<boolean>
  floatingTree: FloatingTree | undefined
  floatingNodeId: string | undefined
  data: FloatingContextData
  readonly triggerElements: PopupTriggerMap<PopoverTriggerBindings>
  attached: ComputedRef<boolean>
  open: ComputedRef<boolean>
  modal: ComputedRef<boolean | 'trap-focus'>
  onOpenChangeComplete: ComputedRef<((open: boolean) => void) | undefined>
  activeTriggerId: ComputedRef<string | null>
  openMethod: ComputedRef<string | null>
  openInteractionHandlers: Readonly<Ref<OpenInteractionHandlers | undefined>>
  domReferenceElement: Readonly<Ref<HTMLElement | null>>
  floatingElement: Readonly<Ref<HTMLElement | null>>
  mounted: ComputedRef<boolean>
  transitionStatus: ComputedRef<TransitionStatus>
  focusManagerModal: ComputedRef<boolean>
  setActiveTriggerId: (next: string | null) => void
  applyTriggerBindings: (bindings: PopoverTriggerBindings) => void
  containsTrigger: (target: Node) => boolean
  setOpen: (
    next: boolean,
    reason?: PopoverOpenReason,
    event?: Event,
    trigger?: HTMLElement | null
  ) => void
  register: (options: PopoverRootOptions) => void
}

export function createPopoverRoot<Payload = unknown>(): PopoverRoot<Payload> {
  const triggerElement = shallowRef<HTMLElement | null>(null)
  const popupElement = shallowRef<HTMLElement | null>(null)
  const positionerElement = shallowRef<HTMLElement | null>(null)
  const triggerFocusTargetElement = shallowRef<HTMLElement | null>(null)
  const popupId = shallowRef<string | undefined>(undefined)
  const titleId = shallowRef<string | undefined>(undefined)
  const descriptionId = shallowRef<string | undefined>(undefined)
  const payload = shallowRef<Payload | undefined>(undefined)

  const openChangeReason = shallowRef<PopoverOpenReason | null>(null)
  const instantType = shallowRef<PopoverInstantType | undefined>(undefined)
  const closePartCount = shallowRef(0)
  const triggerDisabled = shallowRef(false)
  const openOnHover = shallowRef(false)
  const closeDelay = shallowRef(0)
  const hasViewport = shallowRef(false)

  const data: FloatingContextData = {}
  const triggerElements = createPopupTriggerMap<PopoverTriggerBindings>()
  const stickIfOpenTimeout = createTimeout()

  const attachedOptions = shallowRef<PopoverRootOptions | null>(null)
  const transition = shallowRef<Transition | undefined>(undefined)
  const openInteraction = shallowRef<OpenInteractionHandlers | undefined>(undefined)
  const activeTriggerOverride = shallowRef<string | null>(null)

  const registrations = createRootRegistrations<PopoverRegistration>('Popover', (registration) => {
    attachedOptions.value = registration?.options ?? null
    transition.value = registration?.transition
    openInteraction.value = registration?.openInteraction
    if (registration) return
    payload.value = undefined
    triggerElement.value = null
  })

  const attached = computed(() => attachedOptions.value != null)
  const open = computed(() => toValue(attachedOptions.value?.open ?? false))
  const modal = computed(() => toValue(attachedOptions.value?.modal ?? false))
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

  const openMethod = computed(() => openInteraction.value?.openMethod.value ?? null)

  const mounted = computed(() => transition.value?.mounted.value ?? false)
  const transitionStatus = computed(() => transition.value?.status.value)

  const focusManagerModal = computed(() => modal.value !== false && closePartCount.value > 0)

  function setActiveTriggerId(next: string | null): void {
    attachedOptions.value?.setTriggerId(next)
    activeTriggerOverride.value = next
  }

  function applyTriggerBindings(bindings: PopoverTriggerBindings): void {
    payload.value = bindings.payload as Payload | undefined
    triggerDisabled.value = bindings.disabled
    openOnHover.value = bindings.openOnHover
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
    reason?: PopoverOpenReason,
    event?: Event,
    trigger?: HTMLElement | null
  ): void {
    if (!attachedOptions.value) return

    if (!next || !open.value || (event != null && isClickLikeEvent(event.type))) {
      data.openEvent = next ? event : undefined
    }
    dispatchOpenChange(data, next, reason)

    if (reason === REASONS.triggerHover) {
      root.stickIfOpen = true
      stickIfOpenTimeout.start(PATIENT_CLICK_THRESHOLD, () => {
        root.stickIfOpen = false
      })
    }

    attachedOptions.value?.setOpen(next)

    openChangeReason.value = reason ?? null

    selectActiveTrigger(triggerSelection, next, trigger)

    if (reason === REASONS.triggerPress) {
      instantType.value = event instanceof UIEvent && event.detail === 0 ? 'click' : undefined
    } else if (!next && (reason === REASONS.escapeKey || reason == null)) {
      instantType.value = 'dismiss'
    } else if (reason === REASONS.focusOut) {
      instantType.value = 'focus'
    } else {
      instantType.value = undefined
    }
  }

  function containsTrigger(target: Node): boolean {
    return triggerElements.containsNode(target)
  }

  function register(options: PopoverRootOptions): void {
    const interaction = useOpenInteractionHandlers({
      open
    })
    openInteraction.value = interaction

    attachedOptions.value = options

    useDetachedTriggerSelectionById({
      ...triggerSelection,
      triggerElements,
      triggerId: activeTriggerId,
      open,
      activeTriggerId,
      triggerElement
    })

    const ownTransition = useTransitionStatus({
      open
    })
    transition.value = ownTransition

    const detach = registrations.add({
      options,
      transition: ownTransition,
      openInteraction: interaction
    })
    onScopeDispose(detach)

    watchPostEffect(() => {
      if (!open.value) stickIfOpenTimeout.clear()
    })

    openChangeCompleteClose({
      open,
      element: popupElement,
      transition: ownTransition,
      onOpenChangeComplete: () => onOpenChangeComplete.value,
      onClosed: () => {
        root.stickIfOpen = true
        openChangeReason.value = null
        setActiveTriggerId(null)
      }
    })

    const floatingNode = attachFloatingNode({
      open: () => open.value,
      floating: () => positionerElement.value
    })
    root.floatingTree = floatingNode.tree
    root.floatingNodeId = floatingNode.nodeId

    onScopeDispose(stickIfOpenTimeout.clear)
  }

  const root: PopoverRoot<Payload> = {
    triggerElement,
    popupElement,
    positionerElement,
    triggerFocusTargetElement,
    popupId,
    titleId,
    descriptionId,
    payload,
    openChangeReason,
    instantType,
    closePartCount,
    stickIfOpen: true,
    triggerDisabled,
    openOnHover,
    closeDelay,
    hasViewport,
    floatingTree: undefined,
    floatingNodeId: undefined,
    data,
    triggerElements,
    attached,
    open,
    modal,
    onOpenChangeComplete,
    activeTriggerId,
    openMethod,
    openInteractionHandlers: openInteraction,
    domReferenceElement: triggerElement,
    floatingElement: positionerElement,
    mounted,
    transitionStatus,
    focusManagerModal,
    setActiveTriggerId,
    applyTriggerBindings,
    containsTrigger,
    setOpen,
    register
  }

  return root
}
