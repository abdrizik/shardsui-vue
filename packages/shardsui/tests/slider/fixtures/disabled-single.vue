<script setup lang="ts">
import { Slider } from '@/components/slider'

type Value = number | readonly number[]

const { value = 20, onValueChange } = defineProps<{
  value?: number
  onValueChange?: (value: Value) => void
}>()
</script>

<template>
  <Slider.Root :value="value" data-testid="root" @update:value="(next) => onValueChange?.(next)">
    <Slider.Control data-testid="control">
      <Slider.Track>
        <Slider.Indicator />
        <Slider.Thumb disabled data-testid="thumb" />
      </Slider.Track>
    </Slider.Control>
  </Slider.Root>
</template>
