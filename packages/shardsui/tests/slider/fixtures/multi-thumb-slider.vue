<script setup lang="ts">
import { Slider } from '@/components/slider'

const {
  value = [40, 60, 80, 95],
  min = 0,
  max = 100,
  step = 1,
  minStepsBetweenValues = 0,
  thumbCollisionBehavior = 'push'
} = defineProps<{
  value?: number[]
  min?: number
  max?: number
  step?: number
  minStepsBetweenValues?: number
  thumbCollisionBehavior?: 'push' | 'swap' | 'none'
}>()
</script>

<template>
  <Slider.Root
    :value="value"
    :min="min"
    :max="max"
    :step="step"
    :min-steps-between-values="minStepsBetweenValues"
    :thumb-collision-behavior="thumbCollisionBehavior"
    data-testid="root"
  >
    <Slider.Value data-testid="value" />
    <Slider.Control data-testid="control">
      <Slider.Track>
        <Slider.Indicator />
        <Slider.Thumb v-for="(_, i) in value" :key="i" :index="i" data-testid="thumb" />
      </Slider.Track>
    </Slider.Control>
  </Slider.Root>
</template>
