<script setup lang="ts">
import { Slider } from '@/components/slider'

const { value = [40, 60], format } = defineProps<{
  value?: number[]
  format?: Intl.NumberFormatOptions
}>()
</script>

<template>
  <Slider.Root :value="value" :format="format" data-testid="root">
    <Slider.Value v-slot="{ formattedValues, values }" data-testid="value">
      <span data-testid="formatted">{{ JSON.stringify(formattedValues) }}</span>
      <span data-testid="raw">{{ JSON.stringify(values) }}</span>
    </Slider.Value>
    <Slider.Control>
      <Slider.Track>
        <Slider.Thumb :index="0" />
        <Slider.Thumb :index="1" />
      </Slider.Track>
    </Slider.Control>
  </Slider.Root>
</template>
