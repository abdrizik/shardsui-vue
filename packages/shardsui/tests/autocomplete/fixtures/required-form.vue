<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'
import { Field } from '@/components/field'
import { Form } from '@/components/form'
</script>

<template>
  <Form>
    <Field.Root name="auto" data-testid="field">
      <Autocomplete.Root required>
        <Autocomplete.Input data-testid="input" />
      </Autocomplete.Root>
      <Field.Error match="valueMissing" data-testid="error">required</Field.Error>
    </Field.Root>
    <button type="submit" data-testid="submit">Submit</button>
  </Form>
</template>
