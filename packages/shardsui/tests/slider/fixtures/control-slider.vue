<script setup lang="ts">
import { computed, shallowRef, watchSyncEffect } from 'vue'
import { Slider } from '@/components/slider'

type Value = number | readonly number[]

const {
  value: valueProp = 50,
  min = 0,
  max = 100,
  orientation = 'horizontal',
  thumbAlignment = 'center',
  thumbCollisionBehavior = 'push',
  minStepsBetweenValues = 0,
  thumbCount,
  trackText = false,
  nextValue,
  writeBack = false,
  onValueChange,
  onValueCommitted
} = defineProps<{
  value?: Value
  min?: number
  max?: number
  orientation?: 'horizontal' | 'vertical'
  thumbAlignment?: 'center' | 'edge'
  thumbCollisionBehavior?: 'push' | 'swap' | 'none'
  minStepsBetweenValues?: number
  thumbCount?: number
  trackText?: boolean
  nextValue?: Value
  writeBack?: boolean
  onValueChange?: (value: Value) => void
  onValueCommitted?: (value: Value) => void
}>()

const value = shallowRef<Value>(valueProp)
watchSyncEffect(() => {
  value.value = valueProp
})

const values = computed(() => (Array.isArray(value.value) ? value.value : [value.value]))
const thumbs = computed(() =>
  Array.from({ length: thumbCount ?? values.value.length }, (_, index) => index)
)

function handleValueChange(next: Value) {
  onValueChange?.(next)
  if (writeBack) value.value = next
}
</script>

<template>
  <button v-if="nextValue !== undefined" type="button" @click="value = nextValue">set</button>

  <Slider.Root
    :value="value"
    :min="min"
    :max="max"
    :orientation="orientation"
    :thumb-alignment="thumbAlignment"
    :thumb-collision-behavior="thumbCollisionBehavior"
    :min-steps-between-values="minStepsBetweenValues"
    data-testid="root"
    @update:value="handleValueChange"
    @value-committed="(next) => onValueCommitted?.(next)"
  >
    <Slider.Control data-testid="control">
      <span v-if="trackText" data-testid="track-text">Track</span>
      <Slider.Thumb
        v-for="index in thumbs"
        :key="index"
        :index="values.length > 1 ? index : undefined"
        :data-testid="`thumb-${index}`"
      />
    </Slider.Control>
  </Slider.Root>
</template>
