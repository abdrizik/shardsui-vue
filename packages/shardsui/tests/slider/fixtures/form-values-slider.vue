<script setup lang="ts">
import { computed } from 'vue'
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Slider } from '@/components/slider'

type Value = number | readonly number[]

const {
  value = 25,
  min,
  max,
  onFormSubmit
} = defineProps<{
  value?: Value
  min?: number
  max?: number
  onFormSubmit?: (values: Record<string, unknown>) => void
}>()

const values = computed(() => (Array.isArray(value) ? value : [value]))
</script>

<template>
  <Form @form-submit="(next) => onFormSubmit?.(next)">
    <Field.Root name="slider">
      <Slider.Root :value="value" :min="min" :max="max" data-testid="root">
        <Slider.Control data-testid="control">
          <Slider.Track>
            <Slider.Thumb
              v-for="(_, index) in values"
              :key="index"
              :index="values.length > 1 ? index : undefined"
              data-testid="thumb"
            />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>
