<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Slider } from '@/components/slider'

const { onFormSubmit } = defineProps<{ onFormSubmit?: (values: Record<string, unknown>) => void }>()
</script>

<template>
  <Form @form-submit="(next) => onFormSubmit?.(next)">
    <Field.Root name="slider">
      <Slider.Root :value="30" data-testid="root">
        <Slider.Thumb data-testid="thumb" />
      </Slider.Root>
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>
