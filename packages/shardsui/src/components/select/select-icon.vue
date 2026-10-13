<script setup lang="ts">
import { computed } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import { mergeProps } from '@/internal/merge-props'
import type { PartProps } from '@/internal/types'
import { SelectContext, type SelectIconState } from './context'

defineOptions({ inheritAttrs: false })

const { as = 'span' } = defineProps<PartProps>()

const slots = defineSlots<{ default?: (state: SelectIconState) => any }>()

const select = SelectContext.get()

const stateAttrs = computed(() => dataAttrs({ 'popup-open': select.open.value }))

const ownAttrs = computed(() => ({ 'aria-hidden': 'true' }))
</script>

<template>
  <component :is="as" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)">
    <slot v-if="slots.default" :open="select.open.value" />
    <template v-else>▼</template>
  </component>
</template>
