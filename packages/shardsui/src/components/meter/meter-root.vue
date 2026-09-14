<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import type { PartProps } from '@/internal/types'
import { visuallyHidden } from '@/internal/visually-hidden'
import { MeterContext } from './context'
import { useMeterRoot } from './meter'

type Props = PartProps & {
  value: number
  min?: number
  max?: number
  format?: Intl.NumberFormatOptions
  locale?: Intl.LocalesArgument
}

defineOptions({ inheritAttrs: false })

const { as = 'div', value, min = 0, max = 100, format, locale } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const meter = useMeterRoot({
  value: () => value,
  min: () => min,
  max: () => max,
  format: () => format,
  locale: () => locale
})

MeterContext.set(meter)

const ownAttrs = computed(() => ({
  role: 'meter',
  'aria-valuenow': meter.clampedValue.value,
  'aria-valuemin': min,
  'aria-valuemax': max,
  'aria-valuetext': meter.formattedValue.value,
  'aria-labelledby': meter.labelId.value
}))
</script>

<template>
  <component :is="as" v-bind="mergeProps(ownAttrs, $attrs)">
    <slot />
    <!-- force NVDA to read the label -->
    <span role="presentation" :style="visuallyHidden">x</span>
  </component>
</template>
