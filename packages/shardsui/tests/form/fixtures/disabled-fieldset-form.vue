<script setup lang="ts">
import { Field } from '@/components/field'
import { Fieldset } from '@/components/fieldset'
import { Form } from '@/components/form'

defineProps<{ onFormSubmit?: (values: Record<string, unknown>) => void }>()
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Fieldset.Root disabled>
      <Field.Root name="disabled">
        <Field.Control required data-testid="disabled" />
      </Field.Root>
    </Fieldset.Root>
    <Field.Root name="enabled">
      <Field.Control value="sent" data-testid="enabled" />
    </Field.Root>
    <button type="submit" data-testid="submit">Submit</button>
  </Form>
</template>
