<script setup lang="ts">
import { Progress } from '@/components/progress'

const {
  value = 30,
  format,
  onRender
} = defineProps<{
  value?: number | null
  format?: Intl.NumberFormatOptions
  onRender?: (formattedValue: string, value: number | null) => void
}>()
</script>

<template>
  <Progress.Root :value="value" :format="format">
    <Progress.Value v-slot="{ formattedValue, value: slotValue }" data-testid="value">
      {{ onRender?.(formattedValue, slotValue) }}{{ formattedValue }}
    </Progress.Value>
  </Progress.Root>
</template>
