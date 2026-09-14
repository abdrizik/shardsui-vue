<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { onFormSubmit } = defineProps<{ onFormSubmit: (values: Record<string, unknown>) => void }>()

const mounted = shallowRef(true)
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root name="choice">
      <RadioGroup required>
        <Radio.Root v-if="mounted" value="a" />
      </RadioGroup>
    </Field.Root>
    <button type="button" @click="mounted = false">Remove</button>
    <button type="submit">Submit</button>
  </Form>
</template>
