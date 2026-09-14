<script setup lang="ts">
import { Meter } from '@/components/meter'

const {
  value = 30,
  format,
  onRender
} = defineProps<{
  value?: number
  format?: Intl.NumberFormatOptions
  onRender?: (formattedValue: string, rawValue: number) => void
}>()
</script>

<template>
  <Meter.Root :value="value" :format="format">
    <Meter.Value v-slot="{ formattedValue, value: rawValue }" data-testid="value">
      {{ onRender?.(formattedValue, rawValue) }}{{ formattedValue }}
    </Meter.Value>
  </Meter.Root>
</template>
