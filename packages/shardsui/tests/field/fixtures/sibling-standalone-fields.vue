<script setup lang="ts">
import { Field, type FieldValidator } from '@/components/field'

const { validate } = defineProps<{ validate: FieldValidator }>()
</script>

<template>
  <Field.Root name="first" :validate="validate" validation-mode="onChange">
    <Field.Control data-testid="first" />
  </Field.Root>

  <Field.Root name="second">
    <Field.Control data-testid="second" value="second-value" />
  </Field.Root>
</template>
