<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { formatNumber } from '@/internal/format-number'
import type { PartProps } from '@/internal/types'
import { SliderContext } from './context'

type Props = PartProps & {
  ariaLive?: 'off' | 'polite' | 'assertive'
}

defineOptions({ inheritAttrs: false })

const { as = 'output', ariaLive = 'off' } = defineProps<Props>()

defineSlots<{ default?: (props: { formattedValues: string[]; values: number[] }) => any }>()

const slider = SliderContext.get()

const formattedValues = computed(() =>
  slider.values.value.map((value) => formatNumber(value, slider.locale.value, slider.format.value))
)

const ownAttrs = computed(() => ({
  'aria-live': ariaLive,
  for: slider.thumbInputIds.value.join(' ') || undefined
}))
</script>

<template>
  <component :is="as" v-bind="mergeProps(slider.stateAttrs.value, ownAttrs, $attrs)">
    <slot :formatted-values="formattedValues" :values="slider.values.value">
      {{ formattedValues.join(' – ') }}
    </slot>
  </component>
</template>
