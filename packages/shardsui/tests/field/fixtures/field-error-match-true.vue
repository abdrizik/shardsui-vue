<script setup lang="ts">
import { Field } from '@/components/field'
</script>

<template>
  <Field.Root>
    <Field.Control required />
    <Field.Error match>Message</Field.Error>
  </Field.Root>
</template>
