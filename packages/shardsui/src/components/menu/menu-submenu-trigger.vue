<script setup lang="ts">
import {
  computed,
  mergeProps,
  onWatcherCleanup,
  shallowRef,
  useId,
  watch,
  watchEffect,
  watchPostEffect
} from 'vue'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { isIOS, isMac } from '@/internal/detect-browser'
import { DirectionContext } from '@/internal/direction-context'
import { isVirtualPointerEvent } from '@/internal/floating/event'
import { hoverReferenceInteraction } from '@/internal/floating/hover/reference'
import { safePolygon } from '@/internal/floating/safe-polygon'
import { usePartElement } from '@/internal/part-element'
import { usePartTag } from '@/internal/part-tag'
import { REASONS } from '@/internal/reasons'
import type { PartProps } from '@/internal/types'
import { MenuContext, type MenuSubmenuTriggerState } from './context'
import { useMenuItemRegistration } from './item-base'

type Props = PartProps & {
  id?: string
  disabled?: boolean
  delay?: number
  closeDelay?: number
  openOnHover?: boolean
  onClick?: (event: MouseEvent) => void
  onMousedown?: (event: MouseEvent) => void
  onMousemove?: (event: MouseEvent) => void
  onPointerleave?: (event: PointerEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onKeyup?: (event: KeyboardEvent) => void
  onPointerdown?: (event: PointerEvent) => void
  onBlur?: (event: FocusEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  id: idProp,
  disabled: disabledProp = false,
  delay = 100,
  closeDelay = 0,
  openOnHover = true,
  onClick,
  onMousedown,
  onMousemove,
  onPointerleave,
  onKeydown,
  onKeyup,
  onPointerdown,
  onBlur
} = defineProps<Props>()

defineSlots<{ default?: (state: MenuSubmenuTriggerState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const menu = MenuContext.get()
const direction = DirectionContext.get()

const parentMenu = menu.parent

const element = usePartElement()

const tag = usePartTag({ as: () => as, defaultTag: 'div', element })

let pointerType: string | undefined
const openedByKeyboard = shallowRef(false)

const disabled = computed(
  () => disabledProp || menu.disabled.value || (parentMenu?.disabled.value ?? false)
)

const registration = useMenuItemRegistration({
  menu: parentMenu,
  ref: element,
  disabled
})

watchEffect(() => {
  menu.hoverCloseDelay.value = closeDelay
})

watch(
  () => [element.value, id.value] as const,
  ([el, triggerId], _previous, onCleanup) => {
    if (!el) return
    onCleanup(menu.triggerElements.add(triggerId, el))
  },
  { immediate: true, flush: 'sync' }
)

watchPostEffect(() => {
  menu.triggerElement.value = element.value
  onWatcherCleanup(() => {
    if (menu.triggerElement.value === element.value) menu.triggerElement.value = null
  })
})

const safePolygonGuard = safePolygon({ blockPointerEvents: true })
hoverReferenceInteraction(menu, {
  enabled: () => openOnHover && !disabled.value && menu.hoverEnabled.value,
  mouseOnly: true,
  move: true,
  closeGuard: () => safePolygonGuard,
  restMs: () => delay,
  delay: () => ({ open: delay, close: closeDelay }),
  shouldAllowOpen: () => (delay > 0 ? (parentMenu?.allowMouseEnter.value ?? false) : true),
  triggerElement: element,
  isActiveTrigger: () => menu.triggerElement.value === element.value,
  // Chrome can drop the trigger's `mouseleave` during a fast pointer sweep,
  // leaving a stale submenu open — cancel from `mouseout` too.
  guardStaleOpen: true
})

function trackPointerType(event: PointerEvent) {
  pointerType = isVirtualPointerEvent(event) ? '' : event.pointerType
}

function openOnPress(event: MouseEvent) {
  if (event.button !== 0) return
  if (openOnHover && (pointerType === 'mouse' || pointerType === 'pen')) return
  openSubmenu()
}

function openOnClick() {
  if (pointerType !== undefined) {
    pointerType = undefined
    return
  }
  openSubmenu()
}

function openSubmenu() {
  openedByKeyboard.value = false
  menu.setOpen(openOnHover ? true : !menu.open.value, REASONS.triggerPress)
}

function openOnKey(event: KeyboardEvent) {
  pointerType = undefined
  const rtl = direction.direction.value === 'rtl'
  const parentOrientation = parentMenu?.orientation.value ?? 'vertical'
  const openKey =
    parentOrientation === 'horizontal' ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight'
  if (event.key === ' ' && parentMenu?.typing.value) {
    event.preventDefault()
    return
  }
  if (event.key === openKey || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    if (event.key === openKey) event.stopPropagation()
    const reason = event.key === openKey ? REASONS.listNavigation : REASONS.triggerPress
    openedByKeyboard.value = true
    menu.openAndFocus('first', reason, event)
  }
}

function clearHighlightOnBlur() {
  if (parentMenu && registration.highlighted.value) {
    parentMenu.items.highlightedIndex.value = -1
  }
}

const button = useButton({
  disabled,
  focusableWhenDisabled: true,
  as: tag,
  composite: true,
  onPointerdown: () => chain(onPointerdown, trackPointerType),
  onClick: () => chain(onClick, openOnClick),
  onMousedown: () => chain(onMousedown, openOnPress),
  onKeydown: () => chain(onKeydown, openOnKey),
  onKeyup: () => onKeyup
})

const omitExpandedForVoiceOver = computed(
  () =>
    menu.open.value &&
    (isMac || isIOS) &&
    (menu.openChangeReason.value === REASONS.listNavigation ||
      (menu.openChangeReason.value === REASONS.triggerPress && openedByKeyboard.value))
)

const triggerState = computed<MenuSubmenuTriggerState>(() => ({
  disabled: disabled.value,
  highlighted: registration.highlighted.value,
  open: menu.open.value
}))

const stateAttrs = computed(() =>
  dataAttrs({
    'popup-open': menu.open.value,
    highlighted: registration.highlighted.value,
    disabled: disabled.value
  })
)

const ownAttrs = computed(() => ({
  id: id.value,
  'aria-haspopup': 'menu',
  'aria-expanded': omitExpandedForVoiceOver.value ? undefined : menu.open.value,
  'aria-controls': menu.open.value ? menu.popupId.value : undefined,
  role: 'menuitem',
  tabindex: menu.open.value || registration.highlighted.value ? 0 : -1,
  onMousemove: chain(onMousemove, registration.highlightOnHover),
  onPointerleave: chain(onPointerleave, registration.clearHighlightOnLeave),
  onBlur: chain(onBlur, clearHighlightOnBlur)
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(button.attrs.value, stateAttrs, ownAttrs, $attrs)"
  >
    <slot v-bind="triggerState" />
  </component>
</template>
