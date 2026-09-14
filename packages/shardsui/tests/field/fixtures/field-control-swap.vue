<script setup lang="ts">
import { Field } from '@/components/field'

const { which = 'a' } = defineProps<{ which?: 'a' | 'b' }>()
</script>

<template>
  <Field.Root>
    <Field.Label data-testid="label">Label</Field.Label>
    <Field.Control v-if="which === 'a'" id="control-a" data-testid="control-a" />
    <Field.Control v-else id="control-b" data-testid="control-b" />
  </Field.Root>
</template>
