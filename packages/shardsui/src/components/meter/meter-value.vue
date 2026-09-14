<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import type { PartProps } from '@/internal/types'
import { MeterContext } from './context'
import type { MeterValueSlotState } from './meter'

type Props = PartProps

defineOptions({ inheritAttrs: false })

const { as = 'span' } = defineProps<Props>()

const slots = defineSlots<{ default?: (state: MeterValueSlotState) => any }>()

const meter = MeterContext.get()

const ownAttrs = computed(() => ({ 'aria-hidden': 'true' }))

const valueState = computed<MeterValueSlotState>(() => ({
  formattedValue: meter.formattedValue.value,
  value: meter.value.value
}))
</script>

<template>
  <component :is="as" v-bind="mergeProps(ownAttrs, $attrs)">
    <slot v-if="slots.default" v-bind="valueState" />
    <template v-else>{{ meter.formattedValue.value }}</template>
  </component>
</template>
