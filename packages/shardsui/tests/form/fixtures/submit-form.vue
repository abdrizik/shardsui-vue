<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Switch } from '@/components/switch'

defineProps<{ onFormSubmit?: (values: Record<string, unknown>) => void }>()
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root name="username">
      <Field.Label>Username</Field.Label>
      <Field.Control data-testid="username" value="alice" />
    </Field.Root>
    <Field.Root name="subscribe">
      <Switch.Root checked data-testid="subscribe" />
    </Field.Root>
    <button type="submit" data-testid="submit">Submit</button>
  </Form>
</template>
