<script setup lang="ts">
import { Field } from '@/components/field'
</script>

<template>
  <Field.Root>
    <Field.Item disabled data-testid="item">
      <Field.Label data-testid="label">Label</Field.Label>
      <Field.Description data-testid="description">Message</Field.Description>
    </Field.Item>
  </Field.Root>
</template>
