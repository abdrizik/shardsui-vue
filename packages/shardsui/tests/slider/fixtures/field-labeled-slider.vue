<script setup lang="ts">
import { Field } from '@/components/field'
import { Slider } from '@/components/slider'

const { value = 50, showThumb = true } = defineProps<{ value?: number; showThumb?: boolean }>()
</script>

<template>
  <Field.Root>
    <Slider.Root :value="value" data-testid="root">
      <Slider.Label data-testid="label">Volume</Slider.Label>
      <Slider.Control data-testid="control">
        <template v-if="showThumb">
          <input aria-label="Unrelated range" type="range" />
          <Slider.Thumb data-testid="thumb" />
        </template>
      </Slider.Control>
    </Slider.Root>
  </Field.Root>
</template>
