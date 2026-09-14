<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const { onFormSubmit } = defineProps<{ onFormSubmit: (values: Record<string, unknown>) => void }>()

const external = shallowRef(false)
</script>

<template>
  <form id="external-form"></form>
  <Form @form-submit="onFormSubmit">
    <Field.Root name="group">
      <CheckboxGroup :value="[]">
        <Checkbox.Root value="checkbox" :form="external ? 'external-form' : undefined" required />
      </CheckboxGroup>
    </Field.Root>
    <button type="button" @click="external = true">Move</button>
    <button type="submit">Submit</button>
  </Form>
</template>
