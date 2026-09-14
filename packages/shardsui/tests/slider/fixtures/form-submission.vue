<script setup lang="ts">
import { computed } from 'vue'
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Slider } from '@/components/slider'

type Value = number | readonly number[]

const {
  value = 25,
  format,
  onSubmit
} = defineProps<{
  value?: Value
  format?: Intl.NumberFormatOptions
  onSubmit?: (data: FormData) => void
}>()

const values = computed(() => (Array.isArray(value) ? value : [value]))

function handleSubmit(event: SubmitEvent) {
  event.preventDefault()
  onSubmit?.(new FormData(event.currentTarget as HTMLFormElement))
}
</script>

<template>
  <Form @submit="handleSubmit">
    <Field.Root name="slider">
      <Slider.Root :value="value" :format="format" data-testid="root">
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
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>
