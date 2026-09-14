<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

defineProps<{ onFormSubmit: (values: Record<string, unknown>) => void }>()

const name = shallowRef<string | undefined>('fruits')
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root :name="name">
      <CheckboxGroup :value="['apple']">
        <Field.Item>
          <Checkbox.Root value="apple" />
        </Field.Item>
        <Field.Item>
          <Checkbox.Root value="banana" />
        </Field.Item>
      </CheckboxGroup>
    </Field.Root>
    <button type="button" @click="name = undefined">Clear name</button>
    <button type="submit">submit</button>
  </Form>
</template>
