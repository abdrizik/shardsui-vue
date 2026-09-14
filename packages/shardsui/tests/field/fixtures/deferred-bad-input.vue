<script setup lang="ts">
import { Field, type FieldValidityState } from '@/components/field'

const { onValidity } = defineProps<{ onValidity: (data: FieldValidityState) => void }>()
</script>

<template>
  <Field.Root validation-mode="onBlur" :validate="() => 'custom error'">
    <Field.Control type="number" required data-testid="control" />
    <Field.Error match="valueMissing">Required</Field.Error>
    <Field.Error match="badInput">Invalid number</Field.Error>
    <Field.Validity v-slot="data">{{ onValidity(data) }}</Field.Validity>
  </Field.Root>
</template>
