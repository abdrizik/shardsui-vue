<script setup lang="ts">
import { computed } from 'vue'
import { Field, type FieldValidator } from '@/components/field'
import type { FormValidationMode } from '@/components/form'
import { Slider } from '@/components/slider'

const {
  validate = () => null,
  validationMode,
  range = false,
  value
} = defineProps<{
  validate?: FieldValidator
  validationMode?: FormValidationMode
  range?: boolean
  value?: number | readonly number[]
}>()

const resolvedValue = computed(() => value ?? (range ? [0, 5] : 0))
</script>

<template>
  <Field.Root :validate="validate" :validation-mode="validationMode">
    <Slider.Root :value="resolvedValue" data-testid="root">
      <Slider.Control data-testid="control">
        <Slider.Track>
          <template v-if="range">
            <Slider.Thumb :index="0" data-testid="thumb" />
            <Slider.Thumb :index="1" data-testid="thumb-1" />
          </template>
          <Slider.Thumb v-else data-testid="thumb" />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
    <Field.Error data-testid="error" />
  </Field.Root>
</template>
