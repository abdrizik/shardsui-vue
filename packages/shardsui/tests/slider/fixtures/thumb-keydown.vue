<script setup lang="ts">
import { Slider } from '@/components/slider'

const { value = 50, onKeydown } = defineProps<{
  value?: number
  onKeydown?: (event: KeyboardEvent) => void
}>()
</script>

<template>
  <Slider.Root :value="value" data-testid="root">
    <Slider.Control>
      <Slider.Track>
        <Slider.Thumb data-testid="thumb" @keydown="onKeydown" />
      </Slider.Track>
    </Slider.Control>
  </Slider.Root>
</template>
