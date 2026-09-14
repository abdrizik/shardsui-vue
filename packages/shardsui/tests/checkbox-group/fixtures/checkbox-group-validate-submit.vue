<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field, type FieldValidator } from '@/components/field'
import { Form } from '@/components/form'

const { validate } = defineProps<{ validate: FieldValidator }>()

function onSubmit(event: SubmitEvent) {
  event.preventDefault()
}
</script>

<template>
  <Form :on-submit="onSubmit">
    <Field.Root name="apple" :validate="validate">
      <CheckboxGroup :value="['fuji-apple', 'gala-apple']">
        <Field.Item>
          <Checkbox.Root value="fuji-apple" data-testid="button-1" />
        </Field.Item>
        <Field.Item>
          <Checkbox.Root value="gala-apple" data-testid="button-2" />
        </Field.Item>
        <Field.Item>
          <Checkbox.Root value="granny-smith-apple" data-testid="button-3" />
        </Field.Item>
      </CheckboxGroup>
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>
