<script setup lang="ts">
import { computed, mergeProps, useId } from 'vue'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { usePartElement } from '@/internal/part-element'
import { usePartTag } from '@/internal/part-tag'
import type { PartProps } from '@/internal/types'
import { MenuCheckboxItemContext, type MenuCheckableItemState } from './context'
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
  closeOnClick = false,
  onClick,
  onMousedown,
  onMousemove,
  onPointerleave,
  onMouseup,
  onKeydown,
  onKeyup,
  onPointerdown
} = defineProps<Props>()

const checked = defineModel<boolean>('checked', { default: false })

defineSlots<{ default?: (state: MenuCheckableItemState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const element = usePartElement()

const tag = usePartTag({ as: () => as, defaultTag: 'div', element })

const item = useMenuItemBase({
  disabled: () => disabled,
  closeOnClick: () => closeOnClick,
  ref: element
})

function toggleOnClick(event: MouseEvent) {
  checked.value = !checked.value
  item.onClick(event)
}

const button = useButton({
  disabled: item.disabled,
  focusableWhenDisabled: true,
  as: tag,
  composite: true,
  onClick: () => chain(onClick, toggleOnClick),
  onMousedown: () => onMousedown,
  onKeydown: () => chain(onKeydown, item.onKeydown),
  onKeyup: () => onKeyup,
  onPointerdown: () => onPointerdown
})

const itemState = computed<MenuCheckableItemState>(() => ({
  checked: checked.value,
  highlighted: item.highlighted.value,
  disabled: item.disabled.value
}))

const stateAttrs = computed(() =>
  dataAttrs({
    checked: checked.value,
    unchecked: !checked.value,
    highlighted: item.highlighted.value,
    disabled: item.disabled.value
  })
)

MenuCheckboxItemContext.set({
  checked,
  disabled: item.disabled,
  highlighted: item.highlighted
})

const ownAttrs = computed(() => ({
  id: id.value,
  role: 'menuitemcheckbox',
  'aria-checked': checked.value,
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
