<script setup lang="ts">
import { computed } from 'vue'
import { Field, type FieldValidator } from '@/components/field'
import { Form } from '@/components/form'
import { Slider } from '@/components/slider'

const {
  validate = () => null,
  range = false,
  value
} = defineProps<{
  validate?: FieldValidator
  range?: boolean
  value?: number | readonly number[]
}>()

const resolvedValue = computed(() => value ?? (range ? [5, 12] : 99))
</script>

<template>
  <Form>
    <Field.Root :validate="validate">
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
    <button type="submit">submit</button>
  </Form>
</template>
