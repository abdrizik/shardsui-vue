<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { useCompositeItem } from '@/internal/floating/composite'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import { ToolbarContext, type ToolbarLinkState } from './context'

type Props = PartProps & {
  onFocus?: (event: FocusEvent) => void
}

defineOptions({ inheritAttrs: false })

const { as = 'a', onFocus } = defineProps<Props>()

defineSlots<{ default?: (state: ToolbarLinkState) => any }>()

const toolbar = ToolbarContext.get()

const element = usePartElement()

const item = useCompositeItem({
  composite: toolbar.composite,
  ref: element,
  disabled: false
})

const state = computed<ToolbarLinkState>(() => ({ orientation: toolbar.orientation.value }))

const stateAttrs = computed(() => dataAttrs(state.value))

const ownAttrs = computed(() => ({
  tabindex: item.tabindex.value,
  onFocus: chain(onFocus, item.onFocus)
}))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)">
    <slot v-bind="state" />
  </component>
</template>
