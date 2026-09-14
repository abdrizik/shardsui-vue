<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const { onFormSubmit } = defineProps<{ onFormSubmit: (values: Record<string, unknown>) => void }>()

const mounted = shallowRef(true)
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root name="group">
      <CheckboxGroup :value="[]">
        <Checkbox.Root v-if="mounted" value="one" required data-testid="checkbox" />
      </CheckboxGroup>
    </Field.Root>
    <button type="button" @click="mounted = false">Remove</button>
    <button type="submit">Submit</button>
  </Form>
</template>
