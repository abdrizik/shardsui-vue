<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const showFirst = shallowRef(true)
const errors = shallowRef<Record<string, string | string[]>>({})

function onSubmit(event: SubmitEvent) {
  event.preventDefault()
  showFirst.value = false
  errors.value = { group: 'server error' }
}
</script>

<template>
  <Form :errors="errors" :on-submit="onSubmit">
    <Field.Root name="group">
      <CheckboxGroup :value="[]">
        <Checkbox.Root v-if="showFirst" value="one" data-testid="first" />
        <Checkbox.Root value="two" data-testid="second" />
      </CheckboxGroup>
      <Field.Error />
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>
