<script setup lang="ts">
import { Field } from '@/components/field'

const { controlId = 'control-a' } = defineProps<{ controlId?: string }>()
</script>

<template>
  <Field.Root>
    <Field.Label data-testid="label">Label</Field.Label>
    <Field.Control data-testid="control" :id="controlId" />
  </Field.Root>
</template>
