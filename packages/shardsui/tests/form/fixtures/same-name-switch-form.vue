<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Switch } from '@/components/switch'

defineProps<{ onSubmit?: (event: SubmitEvent) => void }>()
</script>

<template>
  <Form :on-submit="onSubmit">
    <Field.Root name="shared">
      <Switch.Root required data-testid="first" />
      <Field.Error data-testid="first-error" />
    </Field.Root>
    <Field.Root name="shared">
      <Switch.Root required checked data-testid="second" />
      <Field.Error data-testid="second-error" />
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>
