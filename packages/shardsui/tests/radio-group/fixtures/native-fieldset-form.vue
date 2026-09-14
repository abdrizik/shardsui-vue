<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { onFormSubmit } = defineProps<{ onFormSubmit: (values: Record<string, unknown>) => void }>()

const disabled = shallowRef(true)
</script>

<template>
  <Form @form-submit="onFormSubmit" data-testid="form">
    <fieldset :disabled="disabled">
      <Field.Root name="choice">
        <RadioGroup value="a">
          <Radio.Root value="a" data-testid="item-a" />
          <Radio.Root value="b" data-testid="item-b" />
        </RadioGroup>
      </Field.Root>
    </fieldset>
    <button type="button" @click="disabled = false">Enable</button>
    <button type="submit">Submit</button>
  </Form>
</template>
