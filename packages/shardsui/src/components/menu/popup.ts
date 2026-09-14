import {
  computed,
  onWatcherCleanup,
  toValue,
  watchEffect,
  watchPostEffect,
  type ComputedRef,
  type MaybeRefOrGetter
} from 'vue'
import { COMPOSITE_KEYS } from '@/internal/composite'
import type { DirectionContextValue } from '@/internal/direction-context'
import { contains } from '@/internal/dom'
import type { AnchorPositioning } from '@/internal/floating/anchor-positioning'
import { useDismiss } from '@/internal/floating/dismiss'
import { useFocusManager, type FocusTarget } from '@/internal/floating/focus-manager'
import { hoverFloatingInteraction } from '@/internal/floating/hover/floating'
import { publishCloseGuardContext } from '@/internal/floating/publish-close-guard-context'
import { createTypeahead } from '@/internal/floating/typeahead'
import { getDisabledMountTransitionStyles } from '@/internal/get-disabled-mount-transition-styles'
import { openChangeComplete } from '@/internal/open-change-complete'
import { REASONS } from '@/internal/reasons'
import { isStationaryWebKitPointer } from '@/internal/stationary-pointer'
import type { MenuOpenChangeReason } from './context'
import { findRootOwnerId } from './find-root-owner-id'
import type { MenuRoot } from './menu'

type MenuPopupOptions = {
  ref: MaybeRefOrGetter<HTMLElement | null>
  id: MaybeRefOrGetter<string>
  finalFocus: () => FocusTarget | undefined
}

export type MenuPopup = {
  side: ComputedRef<AnchorPositioning['side']['value']>
  align: ComputedRef<AnchorPositioning['align']['value']>
  nested: ComputedRef<boolean>
  style: ComputedRef<ReturnType<typeof getDisabledMountTransitionStyles>>
  onKeydown: (event: KeyboardEvent) => void
  onMousemove: () => void
  onPointermove: (event: PointerEvent) => void
  onClick: () => void
  onFocusout: (event: FocusEvent) => void
}

export function useMenuPopup(
  menu: MenuRoot,
  positioner: AnchorPositioning | undefined,
  direction: DirectionContextValue,
  insideToolbar: boolean,
  options: MenuPopupOptions
): MenuPopup {
  const ref = computed(() => toValue(options.ref))

  const isContextMenu = computed(() => menu.parentType.value === 'context-menu')

  const side = computed(() => positioner?.side.value ?? 'bottom')
  const align = computed(() => positioner?.align.value ?? 'start')
  const nested = computed(() => menu.parentType.value === 'menu')

  const style = computed(() => getDisabledMountTransitionStyles(menu.transitionStatus.value))

  const returnFocus = computed<FocusTarget>(() => {
    const finalFocus = options.finalFocus()
    if (finalFocus !== undefined) return finalFocus
    if (
      menu.parentType.value === undefined ||
      isContextMenu.value ||
      menu.triggerElement.value ||
      (menu.parentType.value === 'menubar' && menu.openChangeReason.value !== REASONS.outsidePress)
    ) {
      return true
    }
    return false
  })

  const navigationKeys = computed(() => {
    const horizontal = menu.orientation.value === 'horizontal'
    const isRtl = direction.direction.value === 'rtl'
    return {
      next: horizontal ? (isRtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown',
      previous: horizontal ? (isRtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp',
      closeSubmenu: horizontal ? 'ArrowUp' : isRtl ? 'ArrowRight' : 'ArrowLeft'
    }
  })

  watchEffect(() => {
    menu.popupId.value = toValue(options.id)
    onWatcherCleanup(() => {
      menu.popupId.value = undefined
    })
  })

  watchPostEffect(() => {
    menu.popupElement.value = ref.value
    onWatcherCleanup(() => {
      menu.popupElement.value = null
    })
  })

  openChangeComplete({
    open: menu.open,
    element: ref,
    onComplete: () => {
      if (menu.open.value) menu.onOpenChangeComplete.value?.(true)
    }
  })

  useFocusManager({
    open: menu.open,
    modal: isContextMenu,
    enabled: () => menu.mounted.value && !!ref.value,
    popupElement: ref,
    triggerElement: menu.triggerElement,
    initialFocus: () => (menu.parentType.value !== 'menu' ? undefined : false),
    finalFocus: () => returnFocus.value,
    openMethod: menu.openMethod,
    closeEvent: menu.lastCloseEvent,
    closeReason: menu.openChangeReason,
    restoreFocus: true,
    closeOnFocusOut: true,
    onFocusOut: () => (event) => {
      if (findRootOwnerId(event.relatedTarget) === menu.rootId.value) return
      menu.setOpen(false, REASONS.focusOut, event)
    },
    getNextFocusableElement: () =>
      menu.parentType.value === undefined ? menu.triggerFocusTargetElement.value : null
  })

  publishCloseGuardContext({
    data: menu.data,
    side: () => positioner?.renderedSide.value ?? 'bottom',
    domReference: menu.domReferenceElement,
    floating: menu.floatingElement,
    nodeId: menu.nodeId
  })

  const typeahead = createTypeahead({
    enabled: () => !menu.disabled.value,
    items: () => menu.items.labels(),
    elements: () => menu.items.elements(),
    activeIndex: menu.items.highlightedIndex,
    referenceElement: menu.domReferenceElement,
    floatingElement: menu.floatingElement,
    onMatch: (i) => menu.items.focusItem(i),
    onTyping: () => (isTyping) => {
      menu.typing.value = isTyping
    }
  })

  useDismiss({
    open: menu.open,
    enabled: () => !menu.disabled.value,
    tree: menu.tree,
    nodeId: menu.nodeId,
    popupElement: menu.floatingElement,
    referenceElement: menu.domReferenceElement,
    bubbles: () => ({ escapeKey: menu.closeParentOnEsc.value && menu.parentType.value === 'menu' }),
    outsidePress: () => menu.allowsOutsidePress,
    onClose: (reason, event) => {
      const closeReason = reason === REASONS.escapeKey ? REASONS.escapeKey : REASONS.outsidePress
      menu.setOpen(false, closeReason, event)
    },
    isInsideElement: (target) => contains(ref.value, target) || menu.containsTrigger(target)
  })

  hoverFloatingInteraction(menu, {
    enabled: () =>
      menu.hoverEnabled.value &&
      !menu.disabled.value &&
      menu.parentType.value !== 'menubar' &&
      menu.parentType.value !== 'context-menu',
    closeDelay: menu.hoverCloseDelay,
    tree: menu.tree,
    nodeId: menu.nodeId,
    parentId: menu.parentNodeId
  })

  watchPostEffect(() => {
    function onTreeClose(event: { domEvent: Event; reason: MenuOpenChangeReason }) {
      menu.setOpen(false, event.reason, event.domEvent)
    }
    onWatcherCleanup(menu.tree.value.events.on('close', onTreeClose))
  })

  function currentIndex(): number {
    const element = ref.value
    const active = element ? element.ownerDocument.activeElement : null
    const focusedIndex = menu.items.indexOf(active)
    return focusedIndex >= 0 ? focusedIndex : menu.items.highlightedIndex.value
  }

  function moveHighlight(direction: 1 | -1): void {
    const items = menu.items
    const current = currentIndex()
    const start = current < 0 ? (direction === 1 ? -1 : items.count.value) : current
    items.focusItem(items.stepIndex(start, direction))
  }

  function closeSubmenu(): boolean {
    menu.setOpen(false, REASONS.listNavigation)
    menu.triggerElement.value?.focus()
    const parentOrientation =
      menu.parent?.orientation.value ?? menu.menubar.value?.orientation.value ?? 'vertical'
    return parentOrientation === menu.orientation.value
  }

  function applyKeyDown(event: KeyboardEvent): boolean {
    const keys = navigationKeys.value

    if (!menu.open.value) return false

    if (menu.parentType.value !== undefined && event.key === keys.closeSubmenu) {
      event.preventDefault()
      return closeSubmenu()
    }
    if (event.key === keys.next) {
      event.preventDefault()
      moveHighlight(1)
      return true
    }
    if (event.key === keys.previous) {
      event.preventDefault()
      moveHighlight(-1)
      return true
    }
    if (event.key === 'Home') {
      event.preventDefault()
      menu.items.focusItem(menu.items.firstIndex())
      return true
    }
    if (event.key === 'End') {
      event.preventDefault()
      menu.items.focusItem(menu.items.lastIndex())
      return true
    }
    if (event.key === 'Tab' && event.shiftKey) {
      event.preventDefault()
      event.stopPropagation()
      menu.setOpen(false, REASONS.focusOut, event)
      menu.triggerElement.value?.focus()
      return true
    }
    typeahead.matchKey(event)
    return false
  }

  function onKeydown(event: KeyboardEvent): void {
    menu.isPointerModality = false

    const consumedByToolbar = insideToolbar && COMPOSITE_KEYS.has(event.key)
    if (consumedByToolbar) {
      event.stopPropagation()
    }

    if (applyKeyDown(event) || consumedByToolbar) return

    menu.keyboardEventRelay.value?.(event)
  }

  function onMousemove(): void {
    menu.allowMouseEnter.value = true
    if (menu.parentType.value === 'menu') {
      menu.hoverEnabled.value = false
    }
  }

  function onPointermove(event: PointerEvent): void {
    if (isStationaryWebKitPointer(event)) return
    menu.isPointerModality = true
  }

  function onClick(): void {
    menu.hoverEnabled.value = false
  }

  function onFocusout(event: FocusEvent): void {
    typeahead.resetOnFocusLeave(event)
  }

  return { side, align, nested, style, onKeydown, onMousemove, onPointermove, onClick, onFocusout }
}
