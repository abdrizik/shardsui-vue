<script setup lang="ts">
import PositionerArrow from '@/internal/positioner-arrow.vue'
import type { PartProps } from '@/internal/types'
import { TooltipContext, TooltipPositionerContext, type TooltipArrowState } from './context'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: (state: TooltipArrowState) => any }>()

const tooltip = TooltipContext.get()
const positioner = TooltipPositionerContext.get()
</script>

<template>
  <PositionerArrow
    :positioner="positioner"
    :as="as"
    :open="tooltip.open.value"
    :instant="tooltip.instantType.value"
    v-bind="$attrs"
  >
    <template #default="state">
      <slot v-bind="state as TooltipArrowState" />
    </template>
  </PositionerArrow>
</template>
