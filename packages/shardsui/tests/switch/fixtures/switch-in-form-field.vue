<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Switch } from '@/components/switch'

const { required = false } = defineProps<{ required?: boolean }>()
</script>

<template>
  <Form>
    <Field.Root name="test">
      <Switch.Root :required="required" data-testid="switch" />
      <Field.Error match="valueMissing" data-testid="error">required</Field.Error>
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>
