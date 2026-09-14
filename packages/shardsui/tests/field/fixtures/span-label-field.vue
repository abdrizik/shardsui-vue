<script setup lang="ts">
import { Field } from '@/components/field'
</script>

<template>
  <Field.Root>
    <Field.Label data-testid="label" as="span">Label</Field.Label>
    <Field.Control data-testid="control" />
  </Field.Root>
</template>
