import {
  computed,
  onScopeDispose,
  onWatcherCleanup,
  shallowRef,
  toValue,
  watch,
  watchEffect,
  watchPostEffect,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
  type ShallowRef
} from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import { createRootRegistrations } from '@/internal/detached-handle'
import { attachFloatingNode } from '@/internal/floating/floating-tree'
import { openChangeCompleteClose } from '@/internal/open-change-complete'
import {
  useOpenInteractionHandlers,
  type OpenInteractionHandlers
} from '@/internal/open-interaction-handlers'
import { createPopupTriggerMap, type PopupTriggerMap } from '@/internal/popup-trigger-map'
import { useTransitionStatus, type TransitionStatus } from '@/internal/transition-status'
import { DialogContext, type DialogOpenReason, type DialogRole } from './context'

export type DialogRootOptions = {
  open: MaybeRefOrGetter<boolean>
  setOpen: (open: boolean) => void
  modal: MaybeRefOrGetter<boolean | 'trap-focus'>
  disablePointerDismissal: MaybeRefOrGetter<boolean>
  role?: MaybeRefOrGetter<DialogRole | undefined>
  isDrawer?: MaybeRefOrGetter<boolean | undefined>
  detachedRoot?: MaybeRefOrGetter<DialogRoot | undefined>
  onOpenChangeComplete: () => ((open: boolean) => void) | undefined
  triggerId: MaybeRefOrGetter<string | null>
  setTriggerId: (triggerId: string | null) => void
}

type Transition = ReturnType<typeof useTransitionStatus>

type DialogRegistration = {
  options: DialogRootOptions
  transition: Transition
  openInteraction: OpenInteractionHandlers
}

export type DialogRoot<Payload = unknown> = {
  triggerElement: ShallowRef<HTMLElement | null>
  popupElement: ShallowRef<HTMLElement | null>
  backdropElement: ShallowRef<HTMLElement | null>
  internalBackdropElement: ShallowRef<HTMLElement | null>
  viewportElement: ShallowRef<HTMLElement | null>
  popupId: ShallowRef<string | undefined>
  titleId: ShallowRef<string | undefined>
  descriptionId: ShallowRef<string | undefined>
  payload: ShallowRef<Payload | undefined>
  nestedOpenCount: ShallowRef<number>
  nestedOpenDrawerCount: ShallowRef<number>
  outsidePressEnabled: ShallowRef<boolean>
  nested: ShallowRef<boolean>
  openChangeReason: ShallowRef<DialogOpenReason | null>
  lastCloseEvent: ShallowRef<Event | null>
  readonly triggerElements: PopupTriggerMap
  attached: ComputedRef<boolean>
  open: ComputedRef<boolean>
  modal: ComputedRef<boolean | 'trap-focus'>
  disablePointerDismissal: ComputedRef<boolean>
  role: ComputedRef<DialogRole>
  onOpenChangeComplete: ComputedRef<((open: boolean) => void) | undefined>
  activeTriggerId: ComputedRef<string | null>
  openMethod: ComputedRef<string | null>
  openInteractionHandlers: Readonly<Ref<OpenInteractionHandlers | undefined>>
  mounted: ComputedRef<boolean>
  transitionStatus: ComputedRef<TransitionStatus>
  transitionAttrs: ComputedRef<Record<string, string | undefined>>
  nestedAttrs: ComputedRef<Record<string, string | undefined>>
  activeTrigger: ComputedRef<HTMLElement | null>
  readonly current: DialogRoot<Payload>
  setActiveTriggerId: (next: string | null) => void
  follow: (target: DialogRoot<Payload>) => void
  registerTrigger: (id: string, element: HTMLElement) => () => void
  containsTrigger: (target: Node) => boolean
  setOpen: (next: boolean, reason?: DialogOpenReason, event?: Event) => void
  register: (options: DialogRootOptions) => void
}

export function createDialogRoot<Payload = unknown>(): DialogRoot<Payload> {
  const triggerElement = shallowRef<HTMLElement | null>(null)
  const popupElement = shallowRef<HTMLElement | null>(null)
  const backdropElement = shallowRef<HTMLElement | null>(null)
  const internalBackdropElement = shallowRef<HTMLElement | null>(null)
  const viewportElement = shallowRef<HTMLElement | null>(null)
  const popupId = shallowRef<string | undefined>(undefined)
  const titleId = shallowRef<string | undefined>(undefined)
  const descriptionId = shallowRef<string | undefined>(undefined)
  const payload = shallowRef<Payload | undefined>(undefined)

  const nestedOpenCount = shallowRef(0)
  const nestedOpenDrawerCount = shallowRef(0)

  const outsidePressEnabled = shallowRef(true)
  const nested = shallowRef(false)

  const openChangeReason = shallowRef<DialogOpenReason | null>(null)
  const lastCloseEvent = shallowRef<Event | null>(null)

  const triggerElements = createPopupTriggerMap()

  const attachedOptions = shallowRef<DialogRootOptions | null>(null)
  const transition = shallowRef<Transition | undefined>(undefined)
  const openInteraction = shallowRef<OpenInteractionHandlers | undefined>(undefined)
  const redirect = shallowRef<DialogRoot<Payload> | null>(null)
  const activeTriggerOverride = shallowRef<string | null>(null)

  const registrations = createRootRegistrations<DialogRegistration>('Dialog', (registration) => {
    attachedOptions.value = registration?.options ?? null
    transition.value = registration?.transition
    openInteraction.value = registration?.openInteraction
    if (registration) return
    payload.value = undefined
    triggerElement.value = null
  })

  const attached = computed(() => attachedOptions.value != null)
  const open = computed(() => toValue(attachedOptions.value?.open ?? false))
  const modal = computed(() => toValue(attachedOptions.value?.modal ?? true))
  const disablePointerDismissal = computed(() =>
    toValue(attachedOptions.value?.disablePointerDismissal ?? false)
  )
  const role = computed<DialogRole>(() => toValue(attachedOptions.value?.role) ?? 'dialog')
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

  const transitionAttrs = computed(() =>
    dataAttrs({
      open: open.value,
      closed: !open.value,
      'starting-style': transitionStatus.value === 'starting',
      'ending-style': transitionStatus.value === 'ending'
    })
  )
  const nestedAttrs = computed(() =>
    dataAttrs({
      nested: nested.value,
      'nested-dialog-open': nestedOpenCount.value > 0
    })
  )

  const activeTrigger = computed(() => (mounted.value ? triggerElement.value : null))

  function setActiveTriggerId(next: string | null): void {
    attachedOptions.value?.setTriggerId(next)
    activeTriggerOverride.value = next
  }

  function follow(target: DialogRoot<Payload>): void {
    if (target !== root) redirect.value = target
  }

  function registerTrigger(id: string, element: HTMLElement): () => void {
    return triggerElements.add(id, element)
  }

  function containsTrigger(target: Node): boolean {
    return triggerElements.containsNode(target)
  }

  function setOpen(next: boolean, reason?: DialogOpenReason, event?: Event): void {
    if (!attachedOptions.value) return
    openChangeReason.value = reason ?? null
    lastCloseEvent.value = next ? null : (event ?? null)
    attachedOptions.value?.setOpen(next)
    if (next) setActiveTriggerId(triggerElement.value?.id ?? null)
  }

  function register(options: DialogRootOptions): void {
    attachedOptions.value = options

    watchEffect(() => {
      toValue(options.detachedRoot)?.follow(root as DialogRoot)
    })

    const parent = DialogContext.getOr()
    const isDrawer = toValue(options.isDrawer) ?? false

    nested.value = Boolean(parent)

    const interaction = useOpenInteractionHandlers({
      open
    })
    openInteraction.value = interaction

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
      if (!parent) return
      const currentOpen = open.value
      if (!currentOpen && !mounted.value) return
      if (currentOpen) {
        parent.nestedOpenCount.value = nestedOpenCount.value + 1
        parent.nestedOpenDrawerCount.value = nestedOpenDrawerCount.value + (isDrawer ? 1 : 0)
      } else {
        parent.nestedOpenCount.value = 0
        parent.nestedOpenDrawerCount.value = 0
      }
      onWatcherCleanup(() => {
        if (currentOpen) {
          parent.nestedOpenCount.value = 0
          parent.nestedOpenDrawerCount.value = 0
        }
      })
    })

    watch(
      () => [open.value, activeTriggerId.value, triggerElements.size] as const,
      ([isOpen, activeId, size]) => {
        if (!isOpen || activeId != null || size !== 1) return
        const [[triggerId, element]] = triggerElements.entries()
        setActiveTriggerId(triggerId)
        triggerElement.value = element
      },
      { immediate: true, flush: 'post' }
    )

    openChangeCompleteClose({
      open,
      element: popupElement,
      transition: ownTransition,
      onOpenChangeComplete: () => onOpenChangeComplete.value,
      onClosed: () => {
        setActiveTriggerId(null)
      }
    })

    attachFloatingNode({
      open: () => open.value,
      floating: () => popupElement.value
    })
  }

  const root: DialogRoot<Payload> = {
    triggerElement,
    popupElement,
    backdropElement,
    internalBackdropElement,
    viewportElement,
    popupId,
    titleId,
    descriptionId,
    payload,
    nestedOpenCount,
    nestedOpenDrawerCount,
    outsidePressEnabled,
    nested,
    openChangeReason,
    lastCloseEvent,
    triggerElements,
    attached,
    open,
    modal,
    disablePointerDismissal,
    role,
    onOpenChangeComplete,
    activeTriggerId,
    openMethod,
    openInteractionHandlers: openInteraction,
    mounted,
    transitionStatus,
    transitionAttrs,
    nestedAttrs,
    activeTrigger,
    get current() {
      return redirect.value ?? root
    },
    setActiveTriggerId,
    follow,
    registerTrigger,
    containsTrigger,
    setOpen,
    register
  }

  return root
}
