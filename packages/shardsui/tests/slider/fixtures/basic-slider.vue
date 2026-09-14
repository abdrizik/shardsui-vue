<script setup lang="ts">
import { Slider } from '@/components/slider'

type Value = number | readonly number[]

const {
  value = 50,
  min = 0,
  max = 100,
  step = 1,
  largeStep = 10,
  orientation = 'horizontal',
  disabled = false,
  name,
  form,
  format,
  locale,
  minStepsBetweenValues = 0,
  onValueChange,
  onValueCommitted,
  thumbAriaDescribedby,
  thumbAriaLabel
} = defineProps<{
  value?: Value
  min?: number
  max?: number
  step?: number
  largeStep?: number
  orientation?: 'horizontal' | 'vertical'
  disabled?: boolean
  name?: string
  form?: string
  format?: Intl.NumberFormatOptions
  locale?: string
  minStepsBetweenValues?: number
  onValueChange?: (value: Value) => void
  onValueCommitted?: (value: Value) => void
  thumbAriaDescribedby?: string
  thumbAriaLabel?: string
}>()
</script>

<template>
  <Slider.Root
    :value="value"
    :min="min"
    :max="max"
    :step="step"
    :large-step="largeStep"
    :orientation="orientation"
    :disabled="disabled"
    :name="name"
    :form="form"
    :format="format"
    :locale="locale"
    :min-steps-between-values="minStepsBetweenValues"
    data-testid="root"
    @update:value="(next) => onValueChange?.(next)"
    @value-committed="(next) => onValueCommitted?.(next)"
  >
    <Slider.Value data-testid="value" />
    <Slider.Control data-testid="control">
      <Slider.Track>
        <Slider.Indicator />
        <Slider.Thumb
          data-testid="thumb"
          :aria-describedby="thumbAriaDescribedby"
          :aria-label="thumbAriaLabel"
        />
      </Slider.Track>
    </Slider.Control>
  </Slider.Root>
</template>
