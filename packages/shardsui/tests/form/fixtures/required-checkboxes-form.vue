<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { Field } from '@/components/field'
import { Form } from '@/components/form'
</script>

<template>
  <Form>
    <Field.Root name="a">
      <Checkbox.Root required data-testid="a" />
    </Field.Root>
    <Field.Root name="b">
      <Checkbox.Root required data-testid="b" />
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>
