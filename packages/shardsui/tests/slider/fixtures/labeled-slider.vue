<script setup lang="ts">
import { computed } from 'vue'
import { Slider } from '@/components/slider'

const {
  value = 50,
  id,
  label = 'Volume',
  useAriaLabel = false
} = defineProps<{
  value?: number | readonly number[]
  id?: string
  label?: string
  useAriaLabel?: boolean
}>()

const isRange = computed(() => Array.isArray(value))
</script>

<template>
  <Slider.Root :value="value" :id="id" data-testid="root">
    <Slider.Label data-testid="label">{{ label }}</Slider.Label>
    <Slider.Control data-testid="control">
      <Slider.Track>
        <template v-if="isRange">
          <Slider.Thumb :index="0" :aria-label="useAriaLabel ? 'Minimum price' : undefined" />
          <Slider.Thumb :index="1" :aria-label="useAriaLabel ? 'Maximum price' : undefined" />
        </template>
        <Slider.Thumb v-else :aria-label="useAriaLabel ? 'Minimum price' : undefined" />
      </Slider.Track>
    </Slider.Control>
  </Slider.Root>
</template>
