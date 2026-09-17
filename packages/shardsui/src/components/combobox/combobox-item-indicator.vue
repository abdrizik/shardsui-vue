<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import { useItemIndicator } from '@/internal/item-indicator'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import { ComboboxItemContext, type ComboboxItemIndicatorState } from './context'

type Props = PartProps & {
  keepMounted?: boolean
}

defineOptions({ inheritAttrs: false })

const { as = 'span', keepMounted = false } = defineProps<Props>()

const slots = defineSlots<{ default?: (state: ComboboxItemIndicatorState) => any }>()

const item = ComboboxItemContext.get()

const element = usePartElement()

const indicator = useItemIndicator({
  keepMounted: () => keepMounted,
  element,
  open: item.selected
})

const indicatorState = computed<ComboboxItemIndicatorState>(() => ({
  selected: item.selected.value,
  transitionStatus: indicator.transitionStatus.value
}))

const stateAttrs = computed(() => dataAttrs({ selected: item.selected.value }))

const ownAttrs = { 'aria-hidden': 'true' }
</script>

<template>
  <component
    :is="as"
    v-if="indicator.shouldRender.value"
    ref="element"
    v-bind="mergeProps(stateAttrs, indicator.stateAttrs.value, ownAttrs, $attrs)"
  >
    <slot v-if="slots.default" v-bind="indicatorState" />
    <template v-else>✔️</template>
  </component>
</template>
