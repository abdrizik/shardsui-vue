<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field, type FieldValidator } from '@/components/field'
import { Form } from '@/components/form'

const { onFormSubmit, validate } = defineProps<{
  onFormSubmit: (values: Record<string, unknown>) => void
  validate: FieldValidator
}>()

const mounted = shallowRef(true)
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root name="group" :validate="validate">
      <CheckboxGroup :value="[]">
        <Checkbox.Root v-if="mounted" value="one" data-testid="checkbox" />
      </CheckboxGroup>
    </Field.Root>
    <button type="button" @click="mounted = false">Remove</button>
    <button type="submit">Submit</button>
  </Form>
</template>
