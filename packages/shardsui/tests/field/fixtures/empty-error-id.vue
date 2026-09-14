<script setup lang="ts">
import { Field } from '@/components/field'
</script>

<template>
  <Field.Root invalid>
    <Field.Control aria-describedby="external-description" />
    <Field.Error id="" :match="true">Message</Field.Error>
  </Field.Root>
</template>
