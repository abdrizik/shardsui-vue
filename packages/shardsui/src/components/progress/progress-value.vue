<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import type { PartProps } from '@/internal/types'
import { ProgressContext } from './context'
import type { ProgressValueSlotState } from './progress'

type Props = PartProps

defineOptions({ inheritAttrs: false })

const { as = 'span' } = defineProps<Props>()

const slots = defineSlots<{ default?: (state: ProgressValueSlotState) => any }>()

const progress = ProgressContext.get()

const indeterminate = computed(() => progress.status.value === 'indeterminate')

const ownAttrs = computed(() => ({ 'aria-hidden': 'true' }))

const valueState = computed<ProgressValueSlotState>(() => ({
  formattedValue: indeterminate.value ? 'indeterminate' : progress.formattedValue.value,
  value: progress.value.value
}))
</script>

<template>
  <component :is="as" v-bind="mergeProps(progress.stateAttrs.value, ownAttrs, $attrs)">
    <slot v-if="slots.default" v-bind="valueState" />
    <template v-else-if="!indeterminate">{{ progress.formattedValue.value }}</template>
  </component>
</template>
