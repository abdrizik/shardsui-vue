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
    <Field.Root name="fruits">
      <CheckboxGroup :value="['apple', 'banana']">
        <Checkbox.Root value="apple" />
        <Checkbox.Root v-if="mounted" value="banana" data-testid="banana" />
      </CheckboxGroup>
    </Field.Root>
    <button type="button" @click="mounted = !mounted">Toggle</button>
    <button type="submit">Submit</button>
  </Form>
</template>
