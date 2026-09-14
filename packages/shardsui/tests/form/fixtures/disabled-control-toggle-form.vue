<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

defineProps<{ onFormSubmit?: (values: Record<string, unknown>) => void }>()

const disabled = shallowRef(false)
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root name="control">
      <Field.Control :disabled="disabled" required data-testid="control" />
    </Field.Root>
    <button type="button" data-testid="disable" @click="disabled = true">Disable</button>
    <button type="button" data-testid="enable" @click="disabled = false">Enable</button>
    <button type="submit" data-testid="submit">Submit</button>
  </Form>
</template>
