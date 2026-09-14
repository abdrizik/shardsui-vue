<script setup lang="ts">
import { Field } from '@/components/field'
</script>

<template>
  <Field.Root validation-mode="onChange">
    <Field.Control data-testid="control" value="value" required />
    <Field.Error match="valueMissing">Required</Field.Error>
  </Field.Root>
</template>
