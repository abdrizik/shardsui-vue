<script setup lang="ts">
import { Progress } from '@/components/progress'

const {
  value = 50,
  min,
  max,
  format,
  locale,
  rootStyle,
  labelText,
  labelId
} = defineProps<{
  value?: number | null
  min?: number
  max?: number
  format?: Intl.NumberFormatOptions
  locale?: Intl.LocalesArgument
  rootStyle?: string
  labelText?: string
  labelId?: string
}>()
</script>

<template>
  <Progress.Root
    :value="value"
    :min="min"
    :max="max"
    :format="format"
    :locale="locale"
    :style="rootStyle"
  >
    <Progress.Label v-if="labelText" :id="labelId" data-testid="label">
      {{ labelText }}
    </Progress.Label>
    <Progress.Track data-testid="track">
      <Progress.Indicator data-testid="indicator" />
    </Progress.Track>
    <Progress.Value data-testid="value" />
  </Progress.Root>
</template>
