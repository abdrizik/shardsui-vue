<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { onFormSubmit, validate } = defineProps<{
  onFormSubmit: (values: Record<string, unknown>) => void
  validate: () => string | null
}>()

const mounted = shallowRef(true)
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root name="choice" :validate="validate">
      <RadioGroup>
        <Radio.Root v-if="mounted" value="a" />
      </RadioGroup>
      <Field.Error data-testid="error" />
    </Field.Root>
    <button type="button" @click="mounted = false">Remove</button>
    <button type="submit">Submit</button>
  </Form>
</template>
