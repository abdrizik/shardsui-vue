<script setup lang="ts">
import { mergeProps } from 'vue'
import type { PartProps } from '@/internal/types'
import type { AccordionItemState } from './accordion'
import { AccordionItemContext } from './context'

defineOptions({ inheritAttrs: false })

const { as = 'h3' } = defineProps<PartProps>()

defineSlots<{ default?: (state: AccordionItemState) => any }>()

const item = AccordionItemContext.get()
</script>

<template>
  <component :is="as" v-bind="mergeProps(item.stateAttrs.value, $attrs)">
    <slot v-bind="item.state.value" />
  </component>
</template>
