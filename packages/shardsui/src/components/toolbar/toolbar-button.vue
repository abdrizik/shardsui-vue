<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { useCompositeItem } from '@/internal/floating/composite'
import { usePartElement } from '@/internal/part-element'
import { usePartTag } from '@/internal/part-tag'
import type { PartProps } from '@/internal/types'
import { ToolbarContext, ToolbarGroupContext, type ToolbarRootState } from './context'

type Props = PartProps & {
  disabled?: boolean
  onClick?: (event: MouseEvent) => void
  onMousedown?: (event: MouseEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onKeyup?: (event: KeyboardEvent) => void
  onPointerdown?: (event: PointerEvent) => void
  onFocus?: (event: FocusEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'button',
  disabled: disabledProp = false,
  onClick,
  onMousedown,
  onKeydown,
  onKeyup,
  onPointerdown,
  onFocus
} = defineProps<Props>()

defineSlots<{ default?: (state: ToolbarRootState) => any }>()

const toolbar = ToolbarContext.get()
const group = ToolbarGroupContext.getOr()

const disabled = computed(() => toolbar.disabled.value || group?.disabled.value || disabledProp)

const element = usePartElement()

const tag = usePartTag({ as: () => as, defaultTag: 'button', element })

const item = useCompositeItem({
  composite: toolbar.composite,
  ref: element,
  disabled: false
})

const button = useButton({
  disabled,
  focusableWhenDisabled: true,
  composite: true,
  as: tag,
  onClick: () => onClick,
  onMousedown: () => onMousedown,
  onKeydown: () => onKeydown,
  onKeyup: () => onKeyup,
  onPointerdown: () => onPointerdown
})

const state = computed<ToolbarRootState>(() => ({
  disabled: disabled.value,
  orientation: toolbar.orientation.value
}))

const stateAttrs = computed(() => dataAttrs(state.value))

const ownAttrs = computed(() => ({
  tabindex: item.tabindex.value,
  onFocus: chain(onFocus, item.onFocus)
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(button.attrs.value, stateAttrs, ownAttrs, $attrs)"
  >
    <slot v-bind="state" />
  </component>
</template>
