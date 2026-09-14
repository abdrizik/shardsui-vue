<script setup lang="ts">
import type { AnchoredArrowState } from '@/internal/anchored-state'
import PositionerArrow from '@/internal/positioner-arrow.vue'
import type { PartProps } from '@/internal/types'
import { MenuContext, MenuPositionerContext } from './context'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: (state: AnchoredArrowState) => any }>()

const menu = MenuContext.get()
const positioner = MenuPositionerContext.get()
</script>

<template>
  <PositionerArrow :positioner="positioner" :as="as" :open="menu.open.value" v-bind="$attrs">
    <template #default="state">
      <slot v-bind="state as AnchoredArrowState" />
    </template>
  </PositionerArrow>
</template>
