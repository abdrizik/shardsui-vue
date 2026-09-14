<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { onFormSubmit, initialDisabled = false } = defineProps<{
  onFormSubmit?: (values: Record<string, unknown>) => void
  initialDisabled?: boolean
}>()

const disabled = shallowRef(initialDisabled)
</script>

<template>
  <Form @form-submit="onFormSubmit" data-testid="form">
    <Field.Root name="test">
      <RadioGroup name="group" value="a">
        <Radio.Root value="a" :disabled="disabled" data-testid="item-a" />
        <Radio.Root value="b" data-testid="item-b" />
      </RadioGroup>
    </Field.Root>
    <button type="button" data-testid="toggle" @click="disabled = !disabled">Toggle</button>
    <button type="submit" data-testid="submit">Submit</button>
  </Form>
</template>
