<script setup lang="ts">
import { Slider } from '@/components/slider'

type Value = number | readonly number[]

const {
  value = [20, 80],
  thumbCollisionBehavior = 'push',
  onValueChange
} = defineProps<{
  value?: number[]
  thumbCollisionBehavior?: 'push' | 'swap' | 'none'
  onValueChange?: (value: Value) => void
}>()
</script>

<template>
  <Slider.Root
    :value="value"
    :thumb-collision-behavior="thumbCollisionBehavior"
    data-testid="root"
    @update:value="(next) => onValueChange?.(next)"
  >
    <Slider.Control data-testid="control">
      <Slider.Track>
        <Slider.Indicator />
        <Slider.Thumb :index="0" data-testid="thumb-0" />
        <Slider.Thumb :index="1" disabled data-testid="thumb-1" />
      </Slider.Track>
    </Slider.Control>
  </Slider.Root>
</template>
