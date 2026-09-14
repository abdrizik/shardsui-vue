<script setup lang="ts">
import { Field } from '@/components/field'
import { Slider } from '@/components/slider'

const { disabled = false, name = undefined } = defineProps<{
  disabled?: boolean
  name?: string
}>()

const value = defineModel<number | readonly number[]>('value', { default: 50 })
</script>

<template>
  <Field.Root :disabled="disabled" :name="name">
    <Slider.Root v-model:value="value" data-testid="slider">
      <Slider.Control data-testid="control">
        <Slider.Track>
          <Slider.Thumb data-testid="thumb" />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
    <Field.Label data-testid="label">Volume</Field.Label>
    <Field.Description data-testid="description">Adjust the volume</Field.Description>
  </Field.Root>
</template>
