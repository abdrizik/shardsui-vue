<script setup lang="ts">
import { Field } from '@/components/field'
</script>

<template>
  <Field.Root validation-mode="onBlur">
    <Field.Control type="email" required data-testid="control" />
    <Field.Error match="typeMismatch" data-testid="type-error">Invalid email</Field.Error>
    <Field.Error match="valueMissing" data-testid="required-error">Required</Field.Error>
  </Field.Root>
</template>
