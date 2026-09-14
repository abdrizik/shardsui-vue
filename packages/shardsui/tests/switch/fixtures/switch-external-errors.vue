<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Switch } from '@/components/switch'
</script>

<template>
  <Form :errors="{ test: 'test' }">
    <Field.Root name="test">
      <Switch.Root data-testid="switch" />
      <Field.Error data-testid="error" />
    </Field.Root>
  </Form>
</template>
