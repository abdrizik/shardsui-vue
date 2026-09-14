<script setup lang="ts">
import type { AnchoredArrowState } from '@/internal/anchored-state'
import PositionerArrow from '@/internal/positioner-arrow.vue'
import type { PartProps } from '@/internal/types'
import { PreviewCardContext, PreviewCardPositionerContext } from './context'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: (state: AnchoredArrowState) => any }>()

const previewCard = PreviewCardContext.get()
const positioner = PreviewCardPositionerContext.get()
</script>

<template>
  <PositionerArrow :positioner="positioner" :as="as" :open="previewCard.open.value" v-bind="$attrs">
    <template #default="state">
      <slot v-bind="state as AnchoredArrowState" />
    </template>
  </PositionerArrow>
</template>
