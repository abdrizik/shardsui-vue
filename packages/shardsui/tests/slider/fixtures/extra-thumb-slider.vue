<script setup lang="ts">
import { Slider } from '@/components/slider'

const {
  value = [10, 20],
  onValueChange,
  onValueCommitted
} = defineProps<{
  value?: number[]
  onValueChange?: (value: number[]) => void
  onValueCommitted?: (value: number[]) => void
}>()
</script>

<template>
  <Slider.Root
    :value="value"
    data-testid="root"
    @update:value="(next) => onValueChange?.(next)"
    @value-committed="(next) => onValueCommitted?.(next)"
  >
    <Slider.Control data-testid="control">
      <Slider.Track>
        <Slider.Thumb />
        <Slider.Thumb />
        <Slider.Thumb />
      </Slider.Track>
    </Slider.Control>
  </Slider.Root>
</template>
