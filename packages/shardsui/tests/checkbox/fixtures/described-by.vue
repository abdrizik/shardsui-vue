<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { Field } from '@/components/field'
</script>

<template>
  <Field.Root>
    <Checkbox.Root aria-describedby="external-description" />
    <Field.Description data-testid="description">Description</Field.Description>
  </Field.Root>
</template>
