<script setup lang="ts">
import { Field } from '@/components/field'
import { Form, type FormErrors } from '@/components/form'
import { Slider } from '@/components/slider'

const { errors = { test: 'test' }, value = 50 } = defineProps<{
  errors?: FormErrors
  value?: number
}>()
</script>

<template>
  <Form :errors="errors">
    <Field.Root name="test" data-testid="field">
      <Slider.Root :value="value" data-testid="slider">
        <Slider.Value data-testid="value" />
        <Slider.Control data-testid="control">
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb data-testid="thumb" />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
      <Field.Error data-testid="error" />
    </Field.Root>
  </Form>
</template>
