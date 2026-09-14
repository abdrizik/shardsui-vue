<script setup lang="ts">
import { Slider } from '@/components/slider'

const {
  value = [20, 20],
  onFocus,
  onBlur
} = defineProps<{
  value?: number[]
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
}>()
</script>

<template>
  <Slider.Root :value="value" data-testid="root">
    <Slider.Control>
      <Slider.Track>
        <Slider.Thumb :index="0" data-testid="thumb-0" @focus="onFocus" @blur="onBlur" />
        <Slider.Thumb :index="1" data-testid="thumb-1" @focus="onFocus" @blur="onBlur" />
      </Slider.Track>
    </Slider.Control>
  </Slider.Root>
</template>
