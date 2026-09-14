<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'

const { validationMode = 'onChange' } = defineProps<{
  validationMode?: 'onSubmit' | 'onBlur' | 'onChange'
}>()
</script>

<template>
  <Field.Root name="protocols" :validation-mode="validationMode">
    <CheckboxGroup :value="[]">
      <Field.Item>
        <Checkbox.Root value="http" data-testid="cb-http" required />
      </Field.Item>
      <Field.Item>
        <Checkbox.Root value="https" data-testid="cb-https" required />
      </Field.Item>
    </CheckboxGroup>
    <Field.Error match="valueMissing" data-testid="error">required</Field.Error>
  </Field.Root>
</template>
