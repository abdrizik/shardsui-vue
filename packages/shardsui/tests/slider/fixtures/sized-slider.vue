<script setup lang="ts">
import { computed } from 'vue'
import { Slider } from '@/components/slider'

type Value = number | readonly number[]

const { width = 1000, nextValue } = defineProps<{
  width?: number
  nextValue?: Value
}>()

const value = defineModel<Value>('value', { default: 50 })

const values = computed(() => (Array.isArray(value.value) ? value.value : [value.value]))
</script>

<template>
  <button v-if="nextValue !== undefined" type="button" @click="value = nextValue">set</button>

  <Slider.Root v-model:value="value" :style="{ width: `${width}px` }" data-testid="root">
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
</template>
