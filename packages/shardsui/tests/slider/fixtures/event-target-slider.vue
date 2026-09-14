<script setup lang="ts">
import { Slider } from '@/components/slider'

const {
  value = 0,
  onValueChange,
  onTouchstart,
  onMousedown
} = defineProps<{
  value?: number
  onValueChange?: (value: number) => void
  onTouchstart?: (event: TouchEvent) => void
  onMousedown?: (event: MouseEvent) => void
}>()
</script>

<template>
  <div @touchstart="onTouchstart" @mousedown="onMousedown">
    <Slider.Root :value="value" data-testid="root" @update:value="(next) => onValueChange?.(next)">
      <Slider.Control data-testid="control">
        <Slider.Track>
          <Slider.Indicator />
          <Slider.Thumb data-testid="thumb" />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  </div>
</template>
