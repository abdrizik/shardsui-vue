<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import { useItemIndicator } from '@/internal/item-indicator'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import type { MenuCheckableItemContext, MenuItemIndicatorState } from './context'

type Props = PartProps & {
  item: MenuCheckableItemContext
  keepMounted?: boolean
}

defineOptions({ inheritAttrs: false })

const { as = 'span', item, keepMounted = false } = defineProps<Props>()

defineSlots<{ default?: (state: MenuItemIndicatorState) => any }>()

const element = usePartElement()

const indicator = useItemIndicator({
  keepMounted: () => keepMounted,
  element,
  open: item.checked
})

const menuState = computed<MenuItemIndicatorState>(() => ({
  checked: item.checked.value,
  disabled: item.disabled.value,
  highlighted: item.highlighted.value,
  transitionStatus: indicator.transitionStatus.value
}))

const stateAttrs = computed(() =>
  dataAttrs({
    checked: item.checked.value,
    unchecked: !item.checked.value,
    disabled: item.disabled.value,
    highlighted: item.highlighted.value
  })
)

const ownAttrs = { 'aria-hidden': 'true' }
</script>

<template>
  <component
    :is="as"
    v-if="indicator.shouldRender.value"
    ref="element"
    v-bind="mergeProps(stateAttrs, indicator.stateAttrs.value, ownAttrs, $attrs)"
  >
    <slot v-bind="menuState" />
  </component>
</template>
