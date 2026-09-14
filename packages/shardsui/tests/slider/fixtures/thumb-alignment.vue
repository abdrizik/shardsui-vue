<script setup lang="ts">
import { computed } from 'vue'
import { DirectionProvider, type TextDirection } from '@/components/direction-provider'
import { Slider } from '@/components/slider'

type Value = number | readonly number[]

const {
  value = 50,
  min = 0,
  max = 100,
  orientation = 'horizontal',
  thumbAlignment = 'edge',
  direction = 'ltr',
  thumbSize = 16,
  controlSize = 200,
  showLastThumb = true,
  hidden = false
} = defineProps<{
  value?: Value
  min?: number
  max?: number
  orientation?: 'horizontal' | 'vertical'
  thumbAlignment?: 'center' | 'edge'
  direction?: TextDirection
  thumbSize?: number
  controlSize?: number
  showLastThumb?: boolean
  hidden?: boolean
}>()

const vertical = computed(() => orientation === 'vertical')
const controlStyle = computed(
  () =>
    `position: relative; box-sizing: border-box; width: ${vertical.value ? thumbSize : controlSize}px; height: ${vertical.value ? controlSize : thumbSize}px;`
)
const thumbStyle = computed(
  () => `box-sizing: border-box; width: ${thumbSize}px; height: ${thumbSize}px;`
)
const values = computed(() => (Array.isArray(value) ? value : [value]))
</script>

<template>
  <div :dir="direction" :style="{ display: hidden ? 'none' : 'block' }">
    <DirectionProvider :direction="direction">
      <Slider.Root
        :value="value"
        :min="min"
        :max="max"
        :orientation="orientation"
        :thumb-alignment="thumbAlignment"
        data-testid="root"
      >
        <Slider.Control data-testid="control" :style="controlStyle">
          <Slider.Track data-testid="track" style="position: relative; width: 100%; height: 100%">
            <Slider.Indicator data-testid="indicator" />
            <template v-for="(_, index) in values" :key="index">
              <Slider.Thumb
                v-if="showLastThumb || index < values.length - 1"
                :index="values.length > 1 ? index : undefined"
                :data-testid="`thumb-${index}`"
                :style="thumbStyle"
              />
            </template>
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </DirectionProvider>
  </div>
</template>
