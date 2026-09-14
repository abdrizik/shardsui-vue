import {
  computed,
  onScopeDispose,
  shallowRef,
  toValue,
  watchPostEffect,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
  type ShallowRef,
  type WritableComputedRef
} from 'vue'
import type { ContextMenuRoot } from '@/components/context-menu/context'
import { ContextMenuContext } from '@/components/context-menu/context'
import { MenubarContext } from '@/components/menubar/context'
import type { MenubarRoot } from '@/components/menubar/menubar'
import { createRootRegistrations } from '@/internal/detached-handle'
import { useDetachedTriggerSelection } from '@/internal/detached-trigger-selection'
import { isClickLikeEvent } from '@/internal/floating/event'
import {
  FloatingNodeContext,
  FloatingTreeContext,
  createFloatingTree,
  nextFloatingId,
  registerFloatingNode,
  type FloatingNodeContextValue,
  type FloatingTree
} from '@/internal/floating/floating-tree'
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
import {
  MenuContext,
  MenuSubmenuContext,
  type MenuInstantType,
  type MenuOpenChangeReason,
  type MenuTreeEvents
} from './context'
import { createMenuItemRegistry, type MenuItemRegistry } from './item-registry'

// A `mousedown`-based outside press fires right after a long press opens a context menu, so the
// dismissal is ignored until the gesture is certainly over.
const OUTSIDE_PRESS_GRACE_MS = 500
// Mobile browsers can dispatch `focus` before the `click` of the same tap; the focus-opened menu
// must not be closed by that trailing click.
const TOUCH_CLOSE_GRACE_MS = 300

export type MenuRootOptions = {
  open: MaybeRefOrGetter<boolean>
  setOpen: (open: boolean) => void
  disabled: MaybeRefOrGetter<boolean>
  modal: MaybeRefOrGetter<boolean>
  loopFocus: MaybeRefOrGetter<boolean>
  orientation: MaybeRefOrGetter<'horizontal' | 'vertical'>
  closeParentOnEsc: MaybeRefOrGetter<boolean>
  highlightItemOnHover: MaybeRefOrGetter<boolean>
  onOpenChangeComplete: () => ((open: boolean) => void) | undefined
  triggerId: MaybeRefOrGetter<string | null>
  setTriggerId: (triggerId: string | null) => void
  ownId: MaybeRefOrGetter<string>
}

export type MenuParentType = 'menu' | 'menubar' | 'context-menu' | undefined

export type MenuTriggerContext = {
  tree: FloatingTree<MenuTreeEvents> | undefined
  parentNode: FloatingNodeContextValue | undefined
  nodeId: string
  menubar: MenubarRoot | undefined
}

type Transition = ReturnType<typeof useTransitionStatus>

export type MenuRoot<Payload = unknown> = {
  triggerElement: WritableComputedRef<HTMLElement | null>
  triggerFocusTargetElement: ShallowRef<HTMLElement | null>
  payload: ShallowRef<Payload | undefined>
  popupElement: ShallowRef<HTMLElement | null>
  positionerElement: ShallowRef<HTMLElement | null>
  internalBackdropElement: ShallowRef<HTMLElement | null>
  backdropElement: ShallowRef<HTMLElement | null>
  popupId: ShallowRef<string | undefined>
  hoverEnabled: ShallowRef<boolean>
  allowMouseEnter: ShallowRef<boolean>
  pendingFocus: ShallowRef<'first' | 'last' | null>
  hasViewport: ShallowRef<boolean>
  typing: ShallowRef<boolean>
  instantType: ShallowRef<MenuInstantType | undefined>
  hoverCloseDelay: ShallowRef<number>
  openChangeReason: ShallowRef<MenuOpenChangeReason | null>
  lastCloseEvent: ShallowRef<Event | null>
  isPointerModality: boolean
  keyboardEventRelay: WritableComputedRef<((event: KeyboardEvent) => void) | undefined>
  allowMouseUpTrigger: WritableComputedRef<boolean>
  parent: MenuRoot | undefined
  parentType: ShallowRef<MenuParentType>
  menubar: ShallowRef<MenubarRoot | undefined>
  contextMenu: ContextMenuRoot | undefined
  insideContextMenu: ContextMenuRoot | undefined
  nodeId: ShallowRef<string>
  providesFloatingTree: boolean
  tree: ComputedRef<FloatingTree<MenuTreeEvents>>
  parentNodeId: ComputedRef<string | null>
  data: FloatingContextData
  readonly triggerElements: PopupTriggerMap
  items: MenuItemRegistry
  attached: ComputedRef<boolean>
  open: ComputedRef<boolean>
  loopFocus: ComputedRef<boolean>
  orientation: ComputedRef<'horizontal' | 'vertical'>
  closeParentOnEsc: ComputedRef<boolean>
  onOpenChangeComplete: ComputedRef<((open: boolean) => void) | undefined>
  rootId: ComputedRef<string>
  disabled: ComputedRef<boolean>
  modal: ComputedRef<boolean>
  highlightItemOnHover: ComputedRef<boolean>
  openMethod: ComputedRef<string | null | undefined>
  openInteractionHandlers: Readonly<Ref<OpenInteractionHandlers | undefined>>
  mounted: ComputedRef<boolean>
  transitionStatus: ComputedRef<TransitionStatus>
  domReferenceElement: ComputedRef<Element | null>
  floatingElement: ComputedRef<HTMLElement | null>
  adoptTriggerContext: (context: MenuTriggerContext) => void
  containsTrigger: (target: Node) => boolean
  allowsOutsidePress: () => boolean
  openAndFocus: (which: 'first' | 'last', reason?: MenuOpenChangeReason, event?: Event) => void
  setOpen: (
    next: boolean,
    reason?: MenuOpenChangeReason,
    event?: Event,
    trigger?: HTMLElement | null
  ) => void
  register: (options: MenuRootOptions) => void
}

export function createMenuRoot<Payload = unknown>(): MenuRoot<Payload> {
  const triggerElementValue = shallowRef<HTMLElement | null>(null)
  const triggerFocusTargetElement = shallowRef<HTMLElement | null>(null)
  const payload = shallowRef<Payload | undefined>(undefined)
  const popupElement = shallowRef<HTMLElement | null>(null)
  const positionerElement = shallowRef<HTMLElement | null>(null)
  const internalBackdropElement = shallowRef<HTMLElement | null>(null)
  const backdropElement = shallowRef<HTMLElement | null>(null)
  const popupId = shallowRef<string | undefined>(undefined)
  const hoverEnabled = shallowRef(true)
  const allowMouseEnter = shallowRef(false)
  const pendingFocus = shallowRef<'first' | 'last' | null>(null)
  const hasViewport = shallowRef(false)
  const typing = shallowRef(false)
  const instantType = shallowRef<MenuInstantType | undefined>(undefined)
  const hoverCloseDelay = shallowRef(0)
  const openChangeReason = shallowRef<MenuOpenChangeReason | null>(null)
  const lastCloseEvent = shallowRef<Event | null>(null)

  const ownAllowMouseUpTrigger = shallowRef(false)
  const ownKeyboardEventRelay = shallowRef<((event: KeyboardEvent) => void) | undefined>(undefined)

  let allowOutsidePressDismissal = true
  const outsidePressTimeout = createTimeout()
  let allowTouchToClose = true
  const touchCloseTimeout = createTimeout()

  const parentType = shallowRef<MenuParentType>(undefined)
  const menubar = shallowRef<MenubarRoot | undefined>(undefined)
  const ownTree = createFloatingTree<MenuTreeEvents>()
  const joinedTree = shallowRef<FloatingTree<MenuTreeEvents> | undefined>(undefined)
  const parentNode = shallowRef<FloatingNodeContextValue | undefined>(undefined)
  const nodeId = shallowRef('')
  const tree = computed(() => joinedTree.value ?? ownTree)
  const parentNodeId = computed(() => (joinedTree.value ? (parentNode.value?.id ?? null) : null))

  const data: FloatingContextData = {}
  const triggerElements = createPopupTriggerMap()

  const attachedOptions = shallowRef<MenuRootOptions | null>(null)
  const registrations = createRootRegistrations<MenuRootOptions>('Menu', (registered) => {
    attachedOptions.value = registered
  })

  const attached = computed(() => attachedOptions.value != null)

  const transition = shallowRef<Transition | undefined>(undefined)
  const openInteraction = shallowRef<OpenInteractionHandlers | undefined>(undefined)

  const options = computed<Partial<MenuRootOptions>>(() => attachedOptions.value ?? {})
  const detachedOpen = shallowRef(false)
  const open = computed(() =>
    attached.value ? (toValue(options.value.open) ?? false) : detachedOpen.value
  )
  const disabledOption = computed(() => toValue(options.value.disabled) ?? false)
  const loopFocus = computed(() => toValue(options.value.loopFocus) ?? true)
  const orientation = computed(() => toValue(options.value.orientation) ?? 'vertical')
  const closeParentOnEsc = computed(() => toValue(options.value.closeParentOnEsc) ?? false)
  const modalOption = computed(() => toValue(options.value.modal) ?? true)
  const onOpenChangeComplete = computed(() => options.value.onOpenChangeComplete?.())

  const items = createMenuItemRegistry({
    loopFocus,
    container: popupElement
  })

  const triggerElement = computed<HTMLElement | null>({
    get: () => triggerElementValue.value,
    set: (element) => {
      triggerElementValue.value = element
      options.value.setTriggerId?.(element?.id ?? null)
    }
  })

  const rootId = computed(() =>
    root.parent
      ? root.parent.rootId.value
      : (menubar.value?.rootId.value ?? toValue(options.value.ownId) ?? '')
  )

  const disabled = computed(() => (menubar.value?.disabled.value ?? false) || disabledOption.value)
  const modal = computed(
    () =>
      (parentType.value === undefined || parentType.value === 'context-menu') && modalOption.value
  )
  const highlightItemOnHover = computed(() => toValue(options.value.highlightItemOnHover) ?? true)

  const openMethod = computed(() => openInteraction.value?.openMethod.value)
  const mounted = computed(() => transition.value?.mounted.value ?? false)
  const transitionStatus = computed(() => transition.value?.status.value)
  const domReferenceElement = computed<Element | null>(() => triggerElementValue.value)
  const floatingElement = computed(() => positionerElement.value ?? popupElement.value)

  const keyboardEventRelay = computed<((event: KeyboardEvent) => void) | undefined>({
    get: () => {
      if (ownKeyboardEventRelay.value) return ownKeyboardEventRelay.value
      if (parentType.value === 'menu') return root.parent?.keyboardEventRelay.value
      return undefined
    },
    set: (value) => {
      ownKeyboardEventRelay.value = value
    }
  })

  function mouseUpTriggerOwner(): { allowMouseUpTrigger: Ref<boolean> } | undefined {
    return root.parent ?? root.contextMenu ?? menubar.value
  }

  const allowMouseUpTrigger = computed<boolean>({
    get: () => mouseUpTriggerOwner()?.allowMouseUpTrigger.value ?? ownAllowMouseUpTrigger.value,
    set: (value) => {
      const owner = mouseUpTriggerOwner()
      if (owner) owner.allowMouseUpTrigger.value = value
      else ownAllowMouseUpTrigger.value = value
    }
  })

  function adoptTriggerContext(context: MenuTriggerContext): void {
    joinedTree.value = context.tree
    parentNode.value = context.parentNode
    nodeId.value = context.nodeId
    menubar.value = context.menubar
    parentType.value = context.menubar ? 'menubar' : undefined
  }

  function containsTrigger(target: Node): boolean {
    return triggerElements.containsNode(target)
  }

  function allowsOutsidePress(): boolean {
    if (parentType.value !== 'context-menu' || data.openEvent?.type === 'contextmenu') {
      return true
    }
    return allowOutsidePressDismissal
  }

  function openAndFocus(
    which: 'first' | 'last',
    reason?: MenuOpenChangeReason,
    event?: Event
  ): void {
    pendingFocus.value = which
    setOpen(true, reason, event)
  }

  function resolveInstantType(
    next: boolean,
    reason: MenuOpenChangeReason | undefined,
    event: Event | undefined
  ): MenuInstantType | undefined {
    if (
      menubar.value &&
      (reason === REASONS.triggerFocus ||
        reason === REASONS.focusOut ||
        reason === REASONS.triggerHover ||
        reason === REASONS.listNavigation ||
        reason === REASONS.siblingOpen)
    ) {
      return 'group'
    }

    const isKeyboardClick =
      (reason === REASONS.triggerPress || reason === REASONS.itemPress) &&
      event instanceof UIEvent &&
      event.detail === 0
    if (isKeyboardClick) return 'click'

    const isDismissClose = !next && (reason === REASONS.escapeKey || reason == null)
    if (isDismissClose) return 'dismiss'

    return undefined
  }

  function setOpen(
    next: boolean,
    reason?: MenuOpenChangeReason,
    event?: Event,
    trigger?: HTMLElement | null
  ): void {
    if (next && trigger) triggerElement.value = trigger

    if (!next && !open.value) return

    if (
      next === open.value &&
      trigger === triggerElementValue.value &&
      openChangeReason.value === (reason ?? null)
    ) {
      return
    }

    if (!next || !open.value || (event != null && isClickLikeEvent(event.type))) {
      data.openEvent = next ? event : undefined
    }

    dispatchOpenChange(data, next, reason)

    if (
      !next &&
      event?.type === 'click' &&
      'pointerType' in event &&
      event.pointerType === 'touch' &&
      !allowTouchToClose
    ) {
      return
    }

    if (next && reason === REASONS.triggerFocus) {
      allowTouchToClose = false
      touchCloseTimeout.start(TOUCH_CLOSE_GRACE_MS, () => {
        allowTouchToClose = true
      })
    } else {
      allowTouchToClose = true
      touchCloseTimeout.clear()
    }

    detachedOpen.value = next
    options.value.setOpen?.(next)

    openChangeReason.value = reason ?? null
    lastCloseEvent.value = next ? null : (event ?? null)

    if (!next) {
      items.highlightedIndex.value = -1
      pendingFocus.value = null
      items.clearQueuedFocus()
    }

    instantType.value = resolveInstantType(next, reason, event)
  }

  function register(rootOptions: MenuRootOptions): void {
    attachedOptions.value = rootOptions
    const detach = registrations.add(rootOptions)
    onScopeDispose(detach)

    const parent = MenuContext.getOr()
    const isSubmenu = parent !== undefined && MenuSubmenuContext.getOr() === true
    const inheritedMenubar = !isSubmenu ? MenubarContext.getOr() : undefined
    const insideContextMenu = ContextMenuContext.getOr()
    const contextMenu = !parent && !inheritedMenubar ? insideContextMenu : undefined
    root.providesFloatingTree = !isSubmenu && !inheritedMenubar

    if (isSubmenu || contextMenu) {
      parentType.value = isSubmenu ? 'menu' : 'context-menu'
      if (isSubmenu) {
        joinedTree.value = FloatingTreeContext.getOr() as FloatingTree<MenuTreeEvents> | undefined
        parentNode.value = FloatingNodeContext.getOr()
      }
      nodeId.value = nextFloatingId()
      registerFloatingNode<MenuTreeEvents>({
        tree: () => tree.value,
        id: () => nodeId.value,
        parentId: () => parentNodeId.value,
        open: () => open.value,
        floating: () => popupElement.value
      })
    }

    root.parent = isSubmenu ? parent : undefined
    root.contextMenu = contextMenu
    root.insideContextMenu = insideContextMenu

    openInteraction.value = useOpenInteractionHandlers({
      open
    })

    const ownTransition = useTransitionStatus({
      open
    })
    transition.value = ownTransition

    watchPostEffect(() => {
      if (!open.value && !hoverEnabled.value) hoverEnabled.value = true
    })

    onScopeDispose(outsidePressTimeout.clear)
    onScopeDispose(touchCloseTimeout.clear)

    items.observeContainer()

    watchPostEffect(() => {
      if (parentType.value !== 'context-menu') return
      if (!open.value) {
        outsidePressTimeout.clear()
        allowOutsidePressDismissal = false
        return
      }
      outsidePressTimeout.start(OUTSIDE_PRESS_GRACE_MS, () => {
        allowOutsidePressDismissal = true
      })
    })

    openChangeCompleteClose({
      open,
      element: popupElement,
      transition: ownTransition,
      onOpenChangeComplete: () => onOpenChangeComplete.value,
      onClosed: () => {
        allowMouseEnter.value = false
      }
    })

    useDetachedTriggerSelection({
      triggerElements,
      triggerId: rootOptions.triggerId,
      open,
      triggerElement: triggerElementValue,
      setTriggerElement: (element) => {
        triggerElement.value = element
      }
    })

    watchPostEffect(() => {
      if (!open.value || pendingFocus.value === null || items.count.value === 0) return
      const which = pendingFocus.value
      pendingFocus.value = null
      items.applyPendingFocus(which)
    })

    onScopeDispose(() => {
      items.clearQueuedFocus()
    })
  }

  const root: MenuRoot<Payload> = {
    triggerElement,
    triggerFocusTargetElement,
    payload,
    popupElement,
    positionerElement,
    internalBackdropElement,
    backdropElement,
    popupId,
    hoverEnabled,
    allowMouseEnter,
    pendingFocus,
    hasViewport,
    typing,
    instantType,
    hoverCloseDelay,
    openChangeReason,
    lastCloseEvent,
    isPointerModality: true,
    keyboardEventRelay,
    allowMouseUpTrigger,
    parent: undefined,
    parentType,
    menubar,
    contextMenu: undefined,
    insideContextMenu: undefined,
    nodeId,
    providesFloatingTree: false,
    tree,
    parentNodeId,
    data,
    triggerElements,
    items,
    attached,
    open,
    loopFocus,
    orientation,
    closeParentOnEsc,
    onOpenChangeComplete,
    rootId,
    disabled,
    modal,
    highlightItemOnHover,
    openMethod,
    openInteractionHandlers: openInteraction,
    mounted,
    transitionStatus,
    domReferenceElement,
    floatingElement,
    adoptTriggerContext,
    containsTrigger,
    allowsOutsidePress,
    openAndFocus,
    setOpen,
    register
  }

  return root
}
