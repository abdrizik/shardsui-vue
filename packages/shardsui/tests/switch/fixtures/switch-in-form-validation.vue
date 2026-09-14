<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Switch } from '@/components/switch'

const { required = false } = defineProps<{ required?: boolean }>()
</script>

<template>
  <Form>
    <Field.Root>
      <Switch.Root :required="required" data-testid="switch" />
      <Field.Error data-testid="error" />
    </Field.Root>
    <button type="submit">submit</button>
  </Form>
</template>
