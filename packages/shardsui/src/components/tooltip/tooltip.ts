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
import { useDismiss } from '@/internal/floating/dismiss'
import { isClickLikeEvent } from '@/internal/floating/event'
import { dispatchOpenChange } from '@/internal/floating/hover/interaction'
import type { FloatingContextData } from '@/internal/floating/types'
import { openChangeCompleteClose } from '@/internal/open-change-complete'
import { createPopupTriggerMap, type PopupTriggerMap } from '@/internal/popup-trigger-map'
import { REASONS } from '@/internal/reasons'
import { useTransitionStatus, type TransitionStatus } from '@/internal/transition-status'
import type { TooltipOpenReason } from './context'

export type TooltipRootOptions = {
  open: MaybeRefOrGetter<boolean>
  setOpen: (open: boolean) => void
  disabled: MaybeRefOrGetter<boolean>
  disableHoverablePopup: MaybeRefOrGetter<boolean>
  trackCursorAxis: MaybeRefOrGetter<'none' | 'x' | 'y' | 'both'>
  onOpenChangeComplete: () => ((open: boolean) => void) | undefined
  triggerId: MaybeRefOrGetter<string | null>
  setTriggerId: (triggerId: string | null) => void
  floatingId: MaybeRefOrGetter<string>
}

type Transition = ReturnType<typeof useTransitionStatus>

type TooltipRegistration = {
  options: TooltipRootOptions
  transition: Transition
}

export type TooltipTriggerBindings = {
  payload: unknown
  closeDelay: number
  closeOnClick: boolean
}

export type TooltipInstantType = 'delay' | 'dismiss' | 'focus'

export type TooltipRoot<Payload = unknown> = {
  triggerElement: ShallowRef<HTMLElement | null>
  popupElement: ShallowRef<HTMLElement | null>
  positionerElement: ShallowRef<HTMLElement | null>
  payload: ShallowRef<Payload | undefined>
  cursorX: ShallowRef<number | null>
  cursorY: ShallowRef<number | null>
  openedByMouseEvent: ShallowRef<boolean>
  instantType: ShallowRef<TooltipInstantType | undefined>
  hasViewport: ShallowRef<boolean>
  openChangeReason: ShallowRef<TooltipOpenReason | null>
  closeOnClick: ShallowRef<boolean>
  closeDelay: ShallowRef<number>
  isInstantPhase: ShallowRef<boolean>
  data: FloatingContextData
  readonly triggerElements: PopupTriggerMap<TooltipTriggerBindings>
  attached: ComputedRef<boolean>
  floatingId: ComputedRef<string | undefined>
  disabled: ComputedRef<boolean>
  disableHoverablePopup: ComputedRef<boolean>
  trackCursorAxis: ComputedRef<'none' | 'x' | 'y' | 'both'>
  onOpenChangeComplete: ComputedRef<((open: boolean) => void) | undefined>
  activeTriggerId: ComputedRef<string | null>
  open: ComputedRef<boolean>
  mounted: ComputedRef<boolean>
  transitionStatus: ComputedRef<TransitionStatus>
  domReferenceElement: Readonly<Ref<HTMLElement | null>>
  floatingElement: Readonly<Ref<HTMLElement | null>>
  setActiveTriggerId: (next: string | null) => void
  applyTriggerBindings: (bindings: TooltipTriggerBindings) => void
  setOpen: (
    next: boolean,
    reason?: TooltipOpenReason,
    event?: Event,
    trigger?: HTMLElement | null
  ) => boolean
  cancelPendingOpen: () => void
  setCursorPosition: (x: number, y: number) => void
  register: (options: TooltipRootOptions) => void
}

export function createTooltipRoot<Payload = unknown>(): TooltipRoot<Payload> {
  const triggerElement = shallowRef<HTMLElement | null>(null)
  const popupElement = shallowRef<HTMLElement | null>(null)
  const positionerElement = shallowRef<HTMLElement | null>(null)
  const payload = shallowRef<Payload | undefined>(undefined)
  const cursorX = shallowRef<number | null>(null)
  const cursorY = shallowRef<number | null>(null)
  const openedByMouseEvent = shallowRef(true)
  const instantType = shallowRef<TooltipInstantType | undefined>(undefined)
  const hasViewport = shallowRef(false)
  const openChangeReason = shallowRef<TooltipOpenReason | null>(null)
  const closeOnClick = shallowRef(true)
  const closeDelay = shallowRef(0)
  const isInstantPhase = shallowRef(false)

  const data: FloatingContextData = {}
  const triggerElements = createPopupTriggerMap<TooltipTriggerBindings>()

  const attachedOptions = shallowRef<TooltipRootOptions | null>(null)
  const transition = shallowRef<Transition | undefined>(undefined)
  let previousInstantType: TooltipInstantType | undefined | null = null
  const activeTriggerOverride = shallowRef<string | null>(null)

  const registrations = createRootRegistrations<TooltipRegistration>('Tooltip', (registration) => {
    attachedOptions.value = registration?.options ?? null
    transition.value = registration?.transition
    if (registration) return
    payload.value = undefined
    triggerElement.value = null
  })

  const attached = computed(() => attachedOptions.value != null)
  const openState = computed(() => toValue(attachedOptions.value?.open ?? false))
  const floatingId = computed(() => toValue(attachedOptions.value?.floatingId))
  const disabled = computed(() => toValue(attachedOptions.value?.disabled ?? false))
  const disableHoverablePopup = computed(() =>
    toValue(attachedOptions.value?.disableHoverablePopup ?? false)
  )
  const trackCursorAxis = computed(() => toValue(attachedOptions.value?.trackCursorAxis ?? 'none'))
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

  const open = computed(() => (disabled.value ? false : openState.value))

  const mounted = computed(() => transition.value?.mounted.value ?? false)
  const transitionStatus = computed(() => transition.value?.status.value)

  function setActiveTriggerId(next: string | null): void {
    attachedOptions.value?.setTriggerId(next)
    activeTriggerOverride.value = next
  }

  function applyTriggerBindings(bindings: TooltipTriggerBindings): void {
    payload.value = bindings.payload as Payload | undefined
    closeDelay.value = bindings.closeDelay
    closeOnClick.value = bindings.closeOnClick
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
    reason?: TooltipOpenReason,
    event?: Event,
    trigger?: HTMLElement | null
  ): boolean {
    if (!attachedOptions.value) return false
    if (disabled.value && next) return false

    if (!next || !open.value || (event != null && isClickLikeEvent(event.type))) {
      data.openEvent = next ? event : undefined
    }
    if (next) {
      openedByMouseEvent.value = event == null || 'clientX' in event
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

  function cancelPendingOpen(): void {
    dispatchOpenChange(data, false, REASONS.triggerPress)
  }

  function setCursorPosition(x: number, y: number): void {
    cursorX.value = x
    cursorY.value = y
  }

  function register(options: TooltipRootOptions): void {
    attachedOptions.value = options

    useDetachedTriggerSelectionById({
      ...triggerSelection,
      triggerElements,
      triggerId: activeTriggerId,
      open,
      activeTriggerId,
      triggerElement,
      closeOnActiveTriggerUnmount: () => setOpen(false, REASONS.none)
    })

    const ownTransition = useTransitionStatus({
      open
    })
    transition.value = ownTransition

    const detach = registrations.add({ options, transition: ownTransition })
    onScopeDispose(detach)

    watchEffect(() => {
      const status = transitionStatus.value
      const instantPhase = isInstantPhase.value
      const reason = openChangeReason.value
      const currentInstantType = instantType.value

      if (
        (status === 'ending' && reason === REASONS.none) ||
        (status !== 'ending' && instantPhase)
      ) {
        if (currentInstantType !== 'delay') {
          previousInstantType = currentInstantType
        }
        instantType.value = 'delay'
      } else if (previousInstantType !== null) {
        instantType.value = previousInstantType
        previousInstantType = null
      }
    })

    watchEffect(() => {
      if (openState.value && disabled.value) {
        setOpen(false, REASONS.disabled)
      }
    })

    watchEffect(() => {
      if (open.value && activeTriggerId.value == null) {
        payload.value = undefined
      }
    })

    useDismiss({
      open,
      onClose: (reason, event) => {
        setOpen(false, reason, event)
      },
      enabled: () => !disabled.value,
      triggerPress: closeOnClick,
      popupElement,
      referenceElement: triggerElement,
      isInsideElement: (target) => triggerElements.containsNode(target)
    })

    openChangeCompleteClose({
      open,
      element: popupElement,
      transition: ownTransition,
      onOpenChangeComplete: () => onOpenChangeComplete.value,
      onClosed: () => {
        setActiveTriggerId(null)
      }
    })
  }

  return {
    triggerElement,
    popupElement,
    positionerElement,
    payload,
    cursorX,
    cursorY,
    openedByMouseEvent,
    instantType,
    hasViewport,
    openChangeReason,
    closeOnClick,
    closeDelay,
    isInstantPhase,
    data,
    triggerElements,
    attached,
    floatingId,
    disabled,
    disableHoverablePopup,
    trackCursorAxis,
    onOpenChangeComplete,
    activeTriggerId,
    open,
    mounted,
    transitionStatus,
    domReferenceElement: triggerElement,
    floatingElement: popupElement,
    setActiveTriggerId,
    applyTriggerBindings,
    setOpen,
    cancelPendingOpen,
    setCursorPosition,
    register
  }
}
