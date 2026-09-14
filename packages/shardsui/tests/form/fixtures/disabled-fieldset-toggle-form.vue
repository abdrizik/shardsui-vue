<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Fieldset } from '@/components/fieldset'
import { Form } from '@/components/form'

defineProps<{ onFormSubmit?: (values: Record<string, unknown>) => void }>()

const disabled = shallowRef(false)
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Fieldset.Root :disabled="disabled">
      <Field.Root name="disabled">
        <Field.Control required data-testid="control" />
        <Field.Error data-testid="error" />
      </Field.Root>
    </Fieldset.Root>
    <button type="button" data-testid="disable" @click="disabled = true">Disable</button>
    <button type="submit" data-testid="submit">Submit</button>
  </Form>
</template>
