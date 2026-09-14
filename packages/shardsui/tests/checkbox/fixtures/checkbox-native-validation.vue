<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { Field } from '@/components/field'
import { Form } from '@/components/form'
</script>

<template>
  <Form>
    <Field.Root name="test">
      <Checkbox.Root required />
      <Field.Error match="valueMissing" data-testid="error">required</Field.Error>
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>
