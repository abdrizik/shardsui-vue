<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const errors = shallowRef<Record<string, string | string[]>>({})

function onSubmit(event: SubmitEvent) {
  event.preventDefault()
  errors.value = { group: 'server error' }
}
</script>

<template>
  <Form :errors="errors" :on-submit="onSubmit">
    <Field.Root name="group">
      <CheckboxGroup :value="[]">
        <fieldset disabled>
          <Checkbox.Root value="disabled" data-testid="disabled" />
        </fieldset>
        <Checkbox.Root value="enabled" data-testid="enabled" />
      </CheckboxGroup>
      <Field.Error />
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>
