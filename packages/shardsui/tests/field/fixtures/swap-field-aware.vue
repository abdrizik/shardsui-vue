<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Select } from '@/components/select'
import { Slider } from '@/components/slider'

defineProps<{ onFormSubmit: (values: Record<string, unknown>) => void }>()

const showSlider = shallowRef(false)
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root name="value">
      <Slider.Root v-if="showSlider" :value="12">
        <Slider.Control />
      </Slider.Root>
      <Select.Root v-else value="sans">
        <Select.Trigger>sans</Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Popup>
              <Select.Item value="sans">sans</Select.Item>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field.Root>
    <button type="button" @click="showSlider = true">Toggle</button>
    <button type="submit">submit</button>
  </Form>
</template>
