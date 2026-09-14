import { computed, toValue, watch, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import { isMac } from '@/internal/detect-browser'
import { dispatchClickWithModifiers } from '@/internal/dispatch-click-with-modifiers'
import { contains, isHTMLElement } from '@/internal/dom'
import { REASONS } from '@/internal/reasons'
import { isStationaryWebKitPointer } from '@/internal/stationary-pointer'
import { MenuContext } from './context'
import type { MenuRoot } from './menu'

type MenuItemRegistrationOptions = {
  menu: MaybeRefOrGetter<MenuRoot | undefined>
  ref: MaybeRefOrGetter<HTMLElement | null>
  disabled: MaybeRefOrGetter<boolean>
}

export type MenuItemRegistration = {
  highlighted: ComputedRef<boolean>
  highlightOnHover: (event: MouseEvent) => void
  clearHighlightOnLeave: (event: PointerEvent) => void
}

export function useMenuItemRegistration(
  options: MenuItemRegistrationOptions
): MenuItemRegistration {
  const menu = computed(() => toValue(options.menu))
  const ref = computed(() => toValue(options.ref))

  const index = computed(() => menu.value?.items.indexOf(ref.value) ?? -1)
  const highlighted = computed(
    () => menu.value?.items.highlightedIndex.value === index.value && index.value >= 0
  )

  watch(
    () => [menu.value, ref.value] as const,
    ([currentMenu, element], _previous, onCleanup) => {
      if (!currentMenu || !element) return
      onCleanup(
        currentMenu.items.registerItem(element, { label: element.textContent?.trim() ?? '' })
      )
    },
    { immediate: true, flush: 'sync' }
  )

  function highlightOnHover(event: MouseEvent): void {
    const currentMenu = menu.value
    const element = ref.value
    if (!currentMenu || !element) return
    if (
      !isStationaryWebKitPointer(event) &&
      !toValue(options.disabled) &&
      currentMenu.highlightItemOnHover.value &&
      index.value >= 0
    ) {
      currentMenu.items.focusItem(index.value, false)
    }
    currentMenu.tree.value.events.emit('itemhover', {
      nodeId: currentMenu.nodeId.value,
      target: element
    })
  }

  function clearHighlightOnLeave(event: PointerEvent): void {
    const currentMenu = menu.value
    if (
      !currentMenu ||
      !currentMenu.open.value ||
      !currentMenu.isPointerModality ||
      event.pointerType === 'touch'
    ) {
      return
    }
    if (!currentMenu.highlightItemOnHover.value) return

    const relatedTarget = event.relatedTarget
    if (isHTMLElement(relatedTarget) && currentMenu.items.indexOf(relatedTarget) !== -1) return

    currentMenu.items.clearQueuedFocus()
    currentMenu.items.highlightedIndex.value = -1

    const popup = currentMenu.popupElement.value
    if (popup && contains(popup, popup.ownerDocument.activeElement)) {
      popup.focus({ preventScroll: true })
    }
  }

  return { highlighted, highlightOnHover, clearHighlightOnLeave }
}

type MenuItemBaseOptions = {
  disabled: MaybeRefOrGetter<boolean>
  closeOnClick: MaybeRefOrGetter<boolean>
  ref: MaybeRefOrGetter<HTMLElement | null>
}

export type MenuItemBase = {
  disabled: ComputedRef<boolean>
  highlighted: ComputedRef<boolean>
  tabindex: ComputedRef<number>
  onMousemove: (event: MouseEvent) => void
  onPointerleave: (event: PointerEvent) => void
  onMouseup: (event: MouseEvent) => void
  onKeydown: (event: KeyboardEvent) => void
  onClick: (event: MouseEvent) => void
}

export function useMenuItemBase(options: MenuItemBaseOptions): MenuItemBase {
  const menu = MenuContext.get()

  const disabled = computed(() => toValue(options.disabled) || menu.disabled.value)

  const registration = useMenuItemRegistration({
    menu,
    ref: options.ref,
    disabled
  })

  const tabindex = computed(() => (menu.open.value && registration.highlighted.value ? 0 : -1))

  function onMousemove(event: MouseEvent) {
    registration.highlightOnHover(event)
  }

  function onPointerleave(event: PointerEvent) {
    registration.clearHighlightOnLeave(event)
  }

  function onMouseup(event: MouseEvent) {
    const contextMenu = menu.insideContextMenu
    if (contextMenu) {
      const openPoint = contextMenu.initialCursorPoint.value
      contextMenu.initialCursorPoint.value = null
      if (
        openPoint &&
        Math.abs(event.clientX - openPoint.x) <= 1 &&
        Math.abs(event.clientY - openPoint.y) <= 1
      ) {
        return
      }
      // On non-macOS platforms this mouseup belongs to the right-click gesture that opened the menu.
      if (!isMac && event.button === 2) return
    }

    const ref = toValue(options.ref)
    if (ref && menu.allowMouseUpTrigger.value && (!contextMenu || event.button === 2)) {
      dispatchClickWithModifiers(ref, event, { detail: 1 })
    }
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === ' ' && menu.typing.value) {
      event.preventDefault()
    }
  }

  function onClick(event: MouseEvent) {
    if (toValue(options.closeOnClick)) {
      menu.tree.value.events.emit('close', { domEvent: event, reason: REASONS.itemPress })
    }
  }

  return {
    disabled,
    highlighted: registration.highlighted,
    tabindex,
    onMousemove,
    onPointerleave,
    onMouseup,
    onKeydown,
    onClick
  }
}
