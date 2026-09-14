<script setup lang="ts">
import { computed, mergeProps, useId, useTemplateRef } from 'vue'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import type { PartProps } from '@/internal/types'
import type { MenuItemState } from './context'
import { useMenuItemBase } from './item-base'

type Props = PartProps & {
  id?: string
  disabled?: boolean
  closeOnClick?: boolean
  onClick?: (event: MouseEvent) => void
  onMousedown?: (event: MouseEvent) => void
  onMousemove?: (event: MouseEvent) => void
  onPointerleave?: (event: PointerEvent) => void
  onMouseup?: (event: MouseEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onKeyup?: (event: KeyboardEvent) => void
  onPointerdown?: (event: PointerEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  id: idProp,
  disabled = false,
  closeOnClick = true,
  onClick,
  onMousedown,
  onMousemove,
  onPointerleave,
  onMouseup,
  onKeydown,
  onKeyup,
  onPointerdown
} = defineProps<Props>()

defineSlots<{ default?: (state: MenuItemState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const element = useTemplateRef<HTMLElement>('element')

const item = useMenuItemBase({
  disabled: () => disabled,
  closeOnClick: () => closeOnClick,
  ref: element
})

const button = useButton({
  disabled: item.disabled,
  focusableWhenDisabled: true,
  as: () => as,
  composite: true,
  onClick: () => chain(onClick, item.onClick),
  onMousedown: () => onMousedown,
  onKeydown: () => chain(onKeydown, item.onKeydown),
  onKeyup: () => onKeyup,
  onPointerdown: () => onPointerdown
})

const itemState = computed<MenuItemState>(() => ({
  highlighted: item.highlighted.value,
  disabled: item.disabled.value
}))

const stateAttrs = computed(() =>
  dataAttrs({ highlighted: item.highlighted.value, disabled: item.disabled.value })
)

const ownAttrs = computed(() => ({
  id: id.value,
  role: 'menuitem',
  tabindex: item.tabindex.value,
  onMousemove: chain(onMousemove, item.onMousemove),
  onPointerleave: chain(onPointerleave, item.onPointerleave),
  onMouseup: chain(onMouseup, item.onMouseup)
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(button.attrs.value, stateAttrs, ownAttrs, $attrs)"
  >
    <slot v-bind="itemState" />
  </component>
</template>
