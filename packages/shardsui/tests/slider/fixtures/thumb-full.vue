<script setup lang="ts">
import { Slider } from '@/components/slider'

type Value = number | readonly number[]

const {
  value = 50,
  min = 0,
  max = 100,
  step = 1,
  largeStep = 10,
  disabled = false,
  name,
  format,
  locale,
  ariaLabelledby,
  thumbAriaLabelledby,
  thumbAriaValuetext,
  thumbTabindex,
  thumbOnfocus,
  thumbOnblur,
  showChild = false,
  onValueChange,
  onValueCommitted
} = defineProps<{
  value?: Value
  min?: number
  max?: number
  step?: number
  largeStep?: number
  disabled?: boolean
  name?: string
  format?: Intl.NumberFormatOptions
  locale?: string
  ariaLabelledby?: string
  thumbAriaLabelledby?: string
  thumbAriaValuetext?: string
  thumbTabindex?: number
  thumbOnfocus?: (event: FocusEvent) => void
  thumbOnblur?: (event: FocusEvent) => void
  showChild?: boolean
  onValueChange?: (value: Value) => void
  onValueCommitted?: (value: Value) => void
}>()
</script>

<template>
  <Slider.Root
    :value="value"
    :min="min"
    :max="max"
    :step="step"
    :large-step="largeStep"
    :disabled="disabled"
    :name="name"
    :format="format"
    :locale="locale"
    :aria-labelledby="ariaLabelledby"
    data-testid="root"
    @update:value="(next) => onValueChange?.(next)"
    @value-committed="(next) => onValueCommitted?.(next)"
  >
    <Slider.Value data-testid="value" />
    <Slider.Control data-testid="control">
      <Slider.Track data-testid="track">
        <Slider.Indicator data-testid="indicator" />
        <Slider.Thumb
          data-testid="thumb"
          :aria-labelledby="thumbAriaLabelledby"
          :aria-valuetext="thumbAriaValuetext"
          :tabindex="thumbTabindex"
          @focus="thumbOnfocus"
          @blur="thumbOnblur"
        >
          <span v-if="showChild" data-testid="child"></span>
        </Slider.Thumb>
      </Slider.Track>
    </Slider.Control>
  </Slider.Root>
</template>
