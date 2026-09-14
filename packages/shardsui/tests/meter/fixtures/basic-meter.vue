<script setup lang="ts">
import { Meter } from '@/components/meter'

const {
  value = 50,
  min,
  max,
  format,
  locale,
  rootStyle,
  label,
  labelId,
  rootAs,
  labelAs,
  trackAs,
  indicatorAs,
  valueAs
} = defineProps<{
  value?: number
  min?: number
  max?: number
  format?: Intl.NumberFormatOptions
  locale?: Intl.LocalesArgument
  rootStyle?: string
  label?: string
  labelId?: string
  rootAs?: keyof HTMLElementTagNameMap
  labelAs?: keyof HTMLElementTagNameMap
  trackAs?: keyof HTMLElementTagNameMap
  indicatorAs?: keyof HTMLElementTagNameMap
  valueAs?: keyof HTMLElementTagNameMap
}>()
</script>

<template>
  <Meter.Root
    :as="rootAs"
    :value="value"
    :min="min"
    :max="max"
    :format="format"
    :locale="locale"
    :style="rootStyle"
  >
    <Meter.Label v-if="label" :as="labelAs" :id="labelId">{{ label }}</Meter.Label>
    <Meter.Value :as="valueAs" data-testid="value" />
    <Meter.Track :as="trackAs" data-testid="track">
      <Meter.Indicator :as="indicatorAs" data-testid="indicator" />
    </Meter.Track>
  </Meter.Root>
</template>
