<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import type { PartProps } from '@/internal/types'
import { visuallyHidden } from '@/internal/visually-hidden'
import { ProgressContext } from './context'
import { useProgressRoot, type ProgressState } from './progress'

type Props = PartProps & {
  value: number | null
  min?: number
  max?: number
  format?: Intl.NumberFormatOptions
  locale?: Intl.LocalesArgument
}

defineOptions({ inheritAttrs: false })

const { as = 'div', value, min = 0, max = 100, format, locale } = defineProps<Props>()

defineSlots<{ default?: (state: ProgressState) => any }>()

const progress = useProgressRoot({
  value: () => value,
  min: () => min,
  max: () => max,
  format: () => format,
  locale: () => locale
})

ProgressContext.set(progress)

const ariaValueText = computed(() =>
  progress.status.value === 'indeterminate'
    ? 'indeterminate progress'
    : progress.formattedValue.value
)

const ownAttrs = computed(() => ({
  role: 'progressbar',
  'aria-valuenow': progress.clampedValue.value ?? undefined,
  'aria-valuemin': min,
  'aria-valuemax': max,
  'aria-valuetext': ariaValueText.value,
  'aria-labelledby': progress.labelId.value
}))
</script>

<template>
  <component :is="as" v-bind="mergeProps(progress.stateAttrs.value, ownAttrs, $attrs)">
    <slot v-bind="progress.state.value" />
    <!-- force NVDA to read the label -->
    <span role="presentation" :style="visuallyHidden">x</span>
  </component>
</template>
