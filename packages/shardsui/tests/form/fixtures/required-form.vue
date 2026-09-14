<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'

defineProps<{ onSubmit?: (event: SubmitEvent) => void }>()
</script>

<template>
  <Form :on-submit="onSubmit">
    <Field.Root>
      <Field.Control required />
      <Field.Error data-testid="error" />
    </Field.Root>
    <button>Submit</button>
  </Form>
</template>
