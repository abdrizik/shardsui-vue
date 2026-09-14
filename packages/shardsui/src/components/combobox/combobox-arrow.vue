<script setup lang="ts">
import type { AnchoredArrowState } from '@/internal/anchored-state'
import PositionerArrow from '@/internal/positioner-arrow.vue'
import type { PartProps } from '@/internal/types'
import { ComboboxContext, ComboboxPositionerContext } from './context'

type Props = PartProps

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<Props>()

defineSlots<{ default?: (state: AnchoredArrowState) => any }>()

const combobox = ComboboxContext.get()
const positioner = ComboboxPositionerContext.get()
</script>

<template>
  <PositionerArrow :positioner="positioner" :as="as" :open="combobox.open.value" v-bind="$attrs">
    <template #default="state">
      <slot v-bind="state as AnchoredArrowState" />
    </template>
  </PositionerArrow>
</template>
