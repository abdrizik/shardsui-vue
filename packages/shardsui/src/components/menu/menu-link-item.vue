<script setup lang="ts">
import { computed, mergeProps, useId } from 'vue'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { usePartElement } from '@/internal/part-element'
import { usePartTag } from '@/internal/part-tag'
import type { PartProps } from '@/internal/types'
import type { MenuLinkItemState } from './context'
import { useMenuItemBase } from './item-base'

type Props = PartProps & {
  id?: string
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
  as = 'a',
  id: idProp,
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

defineSlots<{ default?: (state: MenuLinkItemState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const element = usePartElement()

const tag = usePartTag({ as: () => as, defaultTag: 'a', element })

const item = useMenuItemBase({
  disabled: false,
  closeOnClick: () => closeOnClick,
  ref: element
})

const button = useButton({
  as: tag,
  composite: true,
  onClick: () => chain(onClick, item.onClick),
  onMousedown: () => onMousedown,
  onKeydown: () => chain(onKeydown, item.onKeydown),
  onKeyup: () => onKeyup,
  onPointerdown: () => onPointerdown
})

const itemState = computed<MenuLinkItemState>(() => ({ highlighted: item.highlighted.value }))

const stateAttrs = computed(() => dataAttrs({ highlighted: item.highlighted.value }))

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
