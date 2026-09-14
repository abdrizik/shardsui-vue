<script setup lang="ts">
import {
  computed,
  mergeProps,
  onWatcherCleanup,
  useId,
  useTemplateRef,
  watch,
  watchPostEffect,
  type ShallowRef
} from 'vue'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { DirectionContext } from '@/internal/direction-context'
import FocusGuard from '@/internal/focus-guard.vue'
import type { PartProps } from '@/internal/types'
import { ownerVisuallyHidden } from '@/internal/visually-hidden'
import {
  NavigationMenuCompositeContext,
  NavigationMenuContext,
  NavigationMenuItemContext,
  type NavigationMenuTriggerState
} from './context'
import { useNavigationMenuTrigger } from './trigger'

type Props = PartProps & {
  disabled?: boolean
  onClick?: (event: MouseEvent) => void
  onMousedown?: (event: MouseEvent) => void
  onMouseenter?: (event: MouseEvent) => void
  onMousemove?: (event: MouseEvent) => void
  onPointerenter?: (event: PointerEvent) => void
  onPointerdown?: (event: PointerEvent) => void
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onKeyup?: (event: KeyboardEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'button',
  disabled = false,
  onClick,
  onMousedown,
  onMouseenter,
  onMousemove,
  onPointerenter,
  onPointerdown,
  onFocus,
  onBlur,
  onKeydown,
  onKeyup
} = defineProps<Props>()

defineSlots<{ default?: (state: NavigationMenuTriggerState) => any }>()

const uid = useId()

const navigationMenu = NavigationMenuContext.get()
const item = NavigationMenuItemContext.get()
const composite = NavigationMenuCompositeContext.getOr()
const direction = DirectionContext.get()

const element = useTemplateRef<HTMLElement>('element')
const beforeGuard = useTemplateRef<InstanceType<typeof FocusGuard>>('beforeGuard')
const afterGuard = useTemplateRef<InstanceType<typeof FocusGuard>>('afterGuard')

const trigger = useNavigationMenuTrigger(navigationMenu, item, composite, direction, {
  ref: element,
  triggerId: uid,
  disabled: () => disabled,
  as: () => as,
  onClick: () => onClick,
  onMousedown: () => onMousedown,
  onKeydown: () => onKeydown,
  onKeyup: () => onKeyup,
  onPointerdown: () => onPointerdown
})

watch(
  [element, () => item.value.value],
  ([el], _previous, onCleanup) => {
    if (!el) return
    onCleanup(trigger.registerTrigger(el))
  },
  { immediate: true, flush: 'sync' }
)

function publishGuardElement(
  guardRef: Readonly<ShallowRef<InstanceType<typeof FocusGuard> | null>>,
  target: ShallowRef<HTMLElement | null>
) {
  watchPostEffect(() => {
    const guard = guardRef.value?.element ?? null
    if (!guard) return
    target.value = guard
    onWatcherCleanup(() => {
      if (target.value === guard) target.value = null
    })
  })
}

publishGuardElement(beforeGuard, navigationMenu.beforeOutsideElement)
publishGuardElement(afterGuard, navigationMenu.afterOutsideElement)

const navigationMenuState = computed<NavigationMenuTriggerState>(() => ({
  open: trigger.isActive.value
}))

const stateAttrs = computed(() =>
  dataAttrs({ 'popup-open': trigger.isActive.value, pressed: trigger.isActive.value })
)

const ownAttrs = computed(() => ({
  'aria-expanded': trigger.isActive.value,
  'aria-controls': trigger.isActive.value ? navigationMenu.popupElement.value?.id : undefined,
  tabindex: 0,
  onMouseenter: chain(onMouseenter, trigger.onMouseenter),
  onMousemove: chain(onMousemove, trigger.onMousemove),
  onPointerenter: chain(onPointerenter, trigger.onPointerenter),
  onFocus: chain(onFocus, trigger.onFocus),
  onBlur: chain(onBlur, trigger.onBlur)
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(trigger.attrs.value, stateAttrs, ownAttrs, $attrs)"
  >
    <slot v-bind="navigationMenuState" />
  </component>

  <template v-if="trigger.isActive.value">
    <FocusGuard ref="beforeGuard" @focus="trigger.focusBeforeGuard" />
    <span :aria-owns="navigationMenu.viewportElement.value?.id" :style="ownerVisuallyHidden"></span>
    <FocusGuard ref="afterGuard" @focus="trigger.focusAfterGuard" />
  </template>
</template>
