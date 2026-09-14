<script setup lang="ts" generic="Payload = unknown">
import { computed, mergeProps, onWatcherCleanup, useId, useTemplateRef, watchPostEffect } from 'vue'
import { MenubarContext } from '@/components/menubar/context'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { DirectionContext } from '@/internal/direction-context'
import FocusGuard from '@/internal/focus-guard.vue'
import type { PartProps } from '@/internal/types'
import { MenuContext, type MenuTriggerState } from './context'
import type { MenuHandle } from './handle'
import type { MenuRoot } from './menu'
import { useMenuTrigger } from './trigger'

type Props = PartProps & {
  id?: string
  disabled?: boolean
  openOnHover?: boolean
  delay?: number
  closeDelay?: number
  handle?: MenuHandle<Payload>
  payload?: Payload
  onClick?: (event: MouseEvent) => void
  onMousedown?: (event: MouseEvent) => void
  onMousemove?: (event: MouseEvent) => void
  onPointerdown?: (event: PointerEvent) => void
  onFocus?: (event: FocusEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onKeyup?: (event: KeyboardEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'button',
  id: idProp,
  disabled: disabledProp = false,
  openOnHover = undefined,
  delay = 100,
  closeDelay = 0,
  handle,
  payload,
  onClick,
  onMousedown,
  onMousemove,
  onPointerdown,
  onFocus,
  onKeydown,
  onKeyup
} = defineProps<Props>()

defineSlots<{ default?: (state: MenuTriggerState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const menu: MenuRoot = handle ? (handle.state as MenuRoot) : MenuContext.get()
const menubar = MenubarContext.getOr()
const direction = DirectionContext.get()

const element = useTemplateRef<HTMLElement>('element')
const preGuard = useTemplateRef<InstanceType<typeof FocusGuard>>('preGuard')
const afterGuard = useTemplateRef<InstanceType<typeof FocusGuard>>('afterGuard')

const trigger = useMenuTrigger<Payload>(menu, menubar, {
  ref: element,
  id,
  as: () => as,
  rtl: () => direction.direction.value === 'rtl',
  disabled: () => disabledProp,
  openOnHover: () => openOnHover,
  delay: () => delay,
  closeDelay: () => closeDelay,
  payload: () => payload,
  detached: () => handle != null,
  preFocusGuardElement: () => preGuard.value?.element ?? null,
  onClick: () => onClick,
  onMousedown: () => onMousedown,
  onKeydown: () => onKeydown,
  onKeyup: () => onKeyup,
  onPointerdown: () => onPointerdown
})

watchPostEffect(() => {
  const guard = afterGuard.value?.element ?? null
  if (!guard) return
  menu.triggerFocusTargetElement.value = guard
  onWatcherCleanup(() => {
    if (menu.triggerFocusTargetElement.value === guard) {
      menu.triggerFocusTargetElement.value = null
    }
  })
})

const showGuards = computed(() => trigger.open.value && !menubar)

const triggerState = computed<MenuTriggerState>(() => ({
  disabled: trigger.disabled.value,
  open: trigger.open.value
}))

const stateAttrs = computed(() =>
  dataAttrs({
    'popup-open': trigger.open.value,
    pressed: trigger.open.value,
    disabled: trigger.disabled.value
  })
)

const ownAttrs = computed(() => ({
  id: id.value,
  'aria-haspopup': 'menu',
  'aria-expanded': trigger.open.value,
  'aria-controls': trigger.open.value ? menu.popupId.value : undefined,
  ...(menubar ? { tabindex: trigger.tabindex.value, role: 'menuitem' } : undefined),
  onMousedown: trigger.onMousedown,
  onMousemove: chain(onMousemove, trigger.onMousemove),
  onFocus: chain(onFocus, trigger.onFocus)
}))
</script>

<template>
  <FocusGuard v-if="showGuards" ref="preGuard" @focus="trigger.guards.closeAndFocusBefore" />
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(trigger.attrs.value, stateAttrs, ownAttrs, $attrs)"
  >
    <slot v-bind="triggerState" />
  </component>
  <FocusGuard v-if="showGuards" ref="afterGuard" @focus="trigger.guards.closeAndFocusAfter" />
</template>
