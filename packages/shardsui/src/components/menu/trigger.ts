import {
  computed,
  onScopeDispose,
  onWatcherCleanup,
  toValue,
  watch,
  watchEffect,
  watchPostEffect,
  type ComputedRef,
  type MaybeRefOrGetter
} from 'vue'
import type { MenubarRoot } from '@/components/menubar/menubar'
import { useButton, type ButtonAttrs, type ButtonOptions } from '@/internal/button'
import { chain } from '@/internal/chain'
import { PATIENT_CLICK_THRESHOLD } from '@/internal/constants'
import { contains, getTarget, listen } from '@/internal/dom'
import { makeEventPreventable } from '@/internal/event-preventable'
import { useCompositeItem, type CompositeItem } from '@/internal/floating/composite'
import { matchesFocusVisible } from '@/internal/floating/element'
import {
  FloatingNodeContext,
  FloatingTreeContext,
  nextFloatingId,
  registerFloatingNode,
  type FloatingTree
} from '@/internal/floating/floating-tree'
import { hoverReferenceInteraction } from '@/internal/floating/hover/reference'
import { safePolygon } from '@/internal/floating/safe-polygon'
import { createTriggerFocusGuards } from '@/internal/floating/trigger-focus-guards'
import { isMouseWithinBounds } from '@/internal/pseudo-element-bounds'
import { REASONS } from '@/internal/reasons'
import { createTimeout } from '@/internal/timeout'
import type { MenuOpenChangeReason, MenuTreeEvents } from './context'
import { findRootOwnerId } from './find-root-owner-id'
import type { MenuRoot, MenuTriggerContext } from './menu'

// A press shorter than this is a plain click, not the start of a drag-release.
const MOUSE_UP_ARM_DELAY = 200

type MenuTriggerOptions<Payload = unknown> = Pick<
  ButtonOptions,
  'onClick' | 'onMousedown' | 'onKeydown' | 'onKeyup' | 'onPointerdown'
> & {
  ref: MaybeRefOrGetter<HTMLElement | null>
  id: MaybeRefOrGetter<string>
  as: ButtonOptions['as']
  disabled: MaybeRefOrGetter<boolean>
  openOnHover: MaybeRefOrGetter<boolean | undefined>
  delay: MaybeRefOrGetter<number>
  closeDelay: MaybeRefOrGetter<number>
  payload: () => Payload | undefined
  detached: MaybeRefOrGetter<boolean>
  rtl: MaybeRefOrGetter<boolean>
  preFocusGuardElement: MaybeRefOrGetter<HTMLElement | null>
}

export type MenuTrigger = {
  disabled: ComputedRef<boolean>
  open: ComputedRef<boolean>
  tabindex: ComputedRef<number | undefined>
  attrs: ComputedRef<ButtonAttrs>
  guards: ReturnType<typeof createTriggerFocusGuards>
  onMousedown: (event: MouseEvent) => void
  onMousemove: () => void
  onFocus: (event: FocusEvent) => void
}

export function useMenuTrigger<Payload = unknown>(
  menu: MenuRoot,
  menubar: MenubarRoot | undefined,
  options: MenuTriggerOptions<Payload>
): MenuTrigger {
  const allowMouseUpTimeout = createTimeout()
  let hoverOpenedAt = 0
  let ignoreNextClick = false

  const triggerContext: MenuTriggerContext = {
    tree: FloatingTreeContext.getOr() as FloatingTree<MenuTreeEvents> | undefined,
    parentNode: FloatingNodeContext.getOr(),
    nodeId: nextFloatingId(),
    menubar
  }

  const ref = computed(() => toValue(options.ref))

  const disabled = computed(
    () => toValue(options.disabled) || menu.disabled.value || (menubar?.disabled.value ?? false)
  )

  const open = computed(() => menu.open.value && menu.triggerElement.value === ref.value)

  const ownsPopup = computed(() => menu.nodeId.value === triggerContext.nodeId)

  registerFloatingNode<MenuTreeEvents>({
    tree: () => triggerContext.tree ?? menu.tree.value,
    id: () => triggerContext.nodeId,
    parentId: () => triggerContext.parentNode?.id ?? null,
    open: () => ownsPopup.value && menu.open.value,
    floating: () => (ownsPopup.value ? menu.popupElement.value : null)
  })

  // An already-mounted portal reads the tree while rendering, before the watcher below runs.
  if (menu.triggerElement.value == null) menu.adoptTriggerContext(triggerContext)
  watchEffect(() => {
    if (menu.triggerElement.value === ref.value) {
      menu.adoptTriggerContext(triggerContext)
    }
  })

  onScopeDispose(allowMouseUpTimeout.clear)

  const item: CompositeItem | undefined = menubar
    ? useCompositeItem({
        composite: menubar.composite,
        ref,
        disabled
      })
    : undefined

  const tabindex = computed(() => item?.tabindex.value)

  if (menubar) {
    watchPostEffect(() => {
      menu.keyboardEventRelay.value = menubar.composite.onKeydown
      onWatcherCleanup(() => {
        menu.keyboardEventRelay.value = undefined
      })
    })
  }

  watch(
    () => [ref.value, toValue(options.id)] as const,
    ([element, id], _previous, onCleanup) => {
      if (!element) return
      onCleanup(menu.triggerElements.add(id, element))
    },
    { immediate: true, flush: 'sync' }
  )

  watchPostEffect(() => {
    if (menu.triggerElement.value !== ref.value) return
    menu.hoverCloseDelay.value = toValue(options.closeDelay)
    if (ref.value) menu.payload.value = options.payload()
  })

  const safePolygonGuard = safePolygon({ blockPointerEvents: !menubar })
  hoverReferenceInteraction(menu, {
    enabled: () =>
      (toValue(options.openOnHover) ?? menubar?.hasSubmenuOpen.value ?? false) &&
      !disabled.value &&
      (!menubar || (menubar.hasSubmenuOpen.value && !open.value)),
    mouseOnly: true,
    move: false,
    closeGuard: () => safePolygonGuard,
    restMs: () => (menubar?.hasSubmenuOpen.value ? 0 : toValue(options.delay)),
    delay: () => ({ close: toValue(options.closeDelay) }),
    triggerElement: () => toValue(options.ref),
    tree: menu.tree,
    isActiveTrigger: () => menu.triggerElement.value === toValue(options.ref)
  })

  watchPostEffect(() => {
    if (menu.open.value && menu.openChangeReason.value === REASONS.triggerHover) {
      hoverOpenedAt = Date.now()
    }
  })

  watchPostEffect(() => {
    if (!open.value && menu.parentType.value === undefined) {
      menu.allowMouseUpTrigger.value = false
    }
  })

  watch(
    open,
    (isOpen, _previous, onCleanup) => {
      if (isOpen && menu.openChangeReason.value === REASONS.triggerHover) {
        onCleanup(listenForDocumentMouseUp())
      }
    },
    { immediate: true, flush: 'post' }
  )

  const guards = createTriggerFocusGuards({
    close: (event) => menu.setOpen(false, REASONS.focusOut, event),
    positionerElement: menu.positionerElement,
    popupElement: menu.popupElement,
    triggerFocusTargetElement: menu.triggerFocusTargetElement,
    preFocusGuardElement: () => toValue(options.preFocusGuardElement)
  })

  const button = useButton({
    disabled,
    as: options.as,
    composite: () => menubar != null,
    focusableWhenDisabled: false,
    onClick: () =>
      chain(
        options.onClick?.(),
        (event) => menu.openInteractionHandlers.value?.onClick(event),
        onClick
      ),
    onKeydown: () => chain(options.onKeydown?.(), onKeydown),
    onKeyup: options.onKeyup,
    onPointerdown: () => chain(options.onPointerdown?.(), onPointerdown)
  })

  function listenForDocumentMouseUp(): () => void {
    const doc = ref.value?.ownerDocument ?? document
    return listen(doc, 'mouseup', onMouseup, { once: true })
  }

  function onMouseup(mouseEvent: MouseEvent): void {
    const element = ref.value
    if (!element) return

    allowMouseUpTimeout.clear()
    menu.allowMouseUpTrigger.value = false

    const target = getTarget(mouseEvent)

    if (
      contains(element, target) ||
      contains(menu.positionerElement.value, target) ||
      findRootOwnerId(target) === menu.rootId.value
    ) {
      return
    }

    if (isMouseWithinBounds(mouseEvent, element)) return

    menu.tree.value.events.emit('close', { domEvent: mouseEvent, reason: REASONS.cancelOpen })
  }

  function claimTrigger(): void {
    menu.triggerElement.value = toValue(options.ref)
    menu.payload.value = options.payload()
  }

  function onMousedown(event: MouseEvent): void {
    const preventable = makeEventPreventable(event)
    options.onMousedown?.()?.(preventable)
    ignoreNextClick = preventable.shardsUIHandlerPrevented ?? false
    if (ignoreNextClick) return

    if (disabled.value || menu.open.value) return
    if (menubar) {
      ignoreNextClick = true
      claimTrigger()
      menu.setOpen(true, REASONS.triggerPress)
    }
    allowMouseUpTimeout.start(MOUSE_UP_ARM_DELAY, () => {
      menu.allowMouseUpTrigger.value = true
    })
    listenForDocumentMouseUp()
  }

  function onClick(event: MouseEvent): void {
    if (disabled.value) return
    if (ignoreNextClick) {
      ignoreNextClick = false
      return
    }
    const patientClickCandidate = menu.parentType.value === undefined && open.value
    if (
      patientClickCandidate &&
      menu.openChangeReason.value === REASONS.triggerHover &&
      Date.now() - hoverOpenedAt < PATIENT_CLICK_THRESHOLD
    ) {
      menu.setOpen(true, REASONS.triggerPress, event)
      return
    }
    // `open` tracks `triggerElement`, so the next state must be read before rebinding it.
    const nextOpen = !open.value
    claimTrigger()
    menu.setOpen(nextOpen, REASONS.triggerPress, event)
  }

  function onMousemove(): void {
    if (menu.mounted.value && menu.triggerElement.value === ref.value) {
      menu.allowMouseEnter.value = true
    }
    item?.focusOnHover()
  }

  function openAndFocusOnKey(
    which: 'first' | 'last',
    event: KeyboardEvent,
    reason: MenuOpenChangeReason
  ): void {
    claimTrigger()
    menu.openAndFocus(which, reason, toValue(options.detached) ? undefined : event)
  }

  function onKeydown(event: KeyboardEvent): void {
    if (disabled.value) return
    menu.isPointerModality = false

    if (menubar) {
      const openKey =
        menubar.orientation.value === 'horizontal'
          ? 'ArrowDown'
          : toValue(options.rtl)
            ? 'ArrowLeft'
            : 'ArrowRight'
      if (event.key === openKey) {
        event.preventDefault()
        event.stopPropagation()
        openAndFocusOnKey('first', event, REASONS.listNavigation)
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        openAndFocusOnKey('first', event, REASONS.triggerPress)
      }
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      openAndFocusOnKey('first', event, REASONS.listNavigation)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      openAndFocusOnKey('last', event, REASONS.listNavigation)
    } else if (event.key === 'Enter' || event.key === ' ') {
      if (!menu.open.value) menu.pendingFocus.value = 'first'
    }
  }

  function onFocus(event: FocusEvent): void {
    if (menubar && item && item.index.value > -1 && !disabled.value) {
      menubar.composite.setHighlightedIndex(item.index.value)
    }
    if (
      menubar &&
      menubar.hasSubmenuOpen.value &&
      !disabled.value &&
      !open.value &&
      matchesFocusVisible(getTarget(event))
    ) {
      claimTrigger()
      menu.setOpen(true, REASONS.triggerFocus)
    }
  }

  function onPointerdown(event: PointerEvent): void {
    menu.openInteractionHandlers.value?.onPointerdown(event)
  }

  return {
    disabled,
    open,
    tabindex,
    attrs: button.attrs,
    guards,
    onMousedown,
    onMousemove,
    onFocus
  }
}
