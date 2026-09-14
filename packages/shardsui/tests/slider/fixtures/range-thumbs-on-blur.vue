<script setup lang="ts">
import { Field, type FieldValidator } from '@/components/field'
import { Slider } from '@/components/slider'

const {
  validate = () => null,
  value = [20, 50],
  showHelp = false
} = defineProps<{
  validate?: FieldValidator
  value?: number[]
  showHelp?: boolean
}>()
</script>

<template>
  <Field.Root validation-mode="onBlur" :validate="validate" data-testid="field">
    <Slider.Root :value="value" data-testid="root">
      <Slider.Control data-testid="control">
        <Slider.Track>
          <Slider.Thumb :index="0" data-testid="thumb-0" />
          <Slider.Thumb :index="1" data-testid="thumb-1" />
        </Slider.Track>
        <button v-if="showHelp" type="button">Help</button>
      </Slider.Control>
    </Slider.Root>
  </Field.Root>
  <button type="button">after</button>
</template>
