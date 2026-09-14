<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Switch } from '@/components/switch'

defineProps<{ onSubmit?: (event: SubmitEvent) => void }>()
</script>

<template>
  <Form :on-submit="onSubmit">
    <Field.Root>
      <Switch.Root required />
      <Field.Error data-testid="error" />
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>
