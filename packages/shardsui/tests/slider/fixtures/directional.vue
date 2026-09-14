<script setup lang="ts">
import { computed } from 'vue'
import { DirectionProvider, type TextDirection } from '@/components/direction-provider'
import { Slider } from '@/components/slider'

type Value = number | readonly number[]

const {
  direction = 'ltr',
  orientation = 'horizontal',
  value = 20,
  min = 0,
  max = 100,
  step = 1,
  largeStep = 10,
  onValueChange
} = defineProps<{
  direction?: TextDirection
  orientation?: 'horizontal' | 'vertical'
  value?: Value
  min?: number
  max?: number
  step?: number
  largeStep?: number
  onValueChange?: (value: Value) => void
}>()

const values = computed(() => (Array.isArray(value) ? value : [value]))
</script>

<template>
  <div :dir="direction">
    <DirectionProvider :direction="direction">
      <Slider.Root
        :value="value"
        :min="min"
        :max="max"
        :step="step"
        :large-step="largeStep"
        :orientation="orientation"
        data-testid="root"
        @update:value="(next) => onValueChange?.(next)"
      >
        <Slider.Control data-testid="control">
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb
              v-for="(_, index) in values"
              :key="index"
              :index="values.length > 1 ? index : undefined"
              data-testid="thumb"
            />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </DirectionProvider>
  </div>
</template>
