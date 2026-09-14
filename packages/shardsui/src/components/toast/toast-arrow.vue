<script setup lang="ts">
import PositionerArrow from '@/internal/positioner-arrow.vue'
import type { PartProps } from '@/internal/types'
import { ToastPositionerContext, type ToastArrowState } from './context'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: (state: ToastArrowState) => any }>()

const positioner = ToastPositionerContext.get()
</script>

<template>
  <PositionerArrow :positioner="positioner" :as="as" v-bind="$attrs">
    <template #default="state">
      <slot v-bind="state" />
    </template>
  </PositionerArrow>
</template>
