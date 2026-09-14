<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const { onSubmit } = defineProps<{ onSubmit?: (event: SubmitEvent) => void }>()
</script>

<template>
  <Form :on-submit="onSubmit">
    <Field.Root name="test-checkbox">
      <Checkbox.Root />
    </Field.Root>
    <button type="submit" disabled>Disabled</button>
    <button type="submit">Enabled</button>
  </Form>
</template>
