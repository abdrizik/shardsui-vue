<script setup lang="ts">
import { Slider } from '@/components/slider'

type Value = number | readonly number[]

const {
  value = [20, 50],
  min = 0,
  max = 100,
  step = 1,
  largeStep = 10,
  minStepsBetweenValues = 0,
  thumbCollisionBehavior = 'push',
  onValueChange,
  onValueCommitted,
  disabled = false,
  orientation = 'horizontal',
  name,
  format,
  locale
} = defineProps<{
  value?: number[]
  min?: number
  max?: number
  step?: number
  largeStep?: number
  minStepsBetweenValues?: number
  thumbCollisionBehavior?: 'push' | 'swap' | 'none'
  onValueChange?: (value: Value) => void
  onValueCommitted?: (value: Value) => void
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
  name?: string
  format?: Intl.NumberFormatOptions
  locale?: string
}>()
</script>

<template>
  <Slider.Root
    :value="value"
    :min="min"
    :max="max"
    :step="step"
    :large-step="largeStep"
    :min-steps-between-values="minStepsBetweenValues"
    :thumb-collision-behavior="thumbCollisionBehavior"
    :disabled="disabled"
    :orientation="orientation"
    :name="name"
    :format="format"
    :locale="locale"
    data-testid="root"
    @update:value="(next) => onValueChange?.(next)"
    @value-committed="(next) => onValueCommitted?.(next)"
  >
    <Slider.Value data-testid="value" />
    <Slider.Control data-testid="control">
      <Slider.Track>
        <Slider.Indicator />
        <Slider.Thumb :index="0" data-testid="thumb" />
        <Slider.Thumb :index="1" data-testid="thumb" />
      </Slider.Track>
    </Slider.Control>
  </Slider.Root>
</template>
