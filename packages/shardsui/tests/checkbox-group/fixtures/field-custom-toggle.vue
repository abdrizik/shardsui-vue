<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field, type FieldValidator } from '@/components/field'

const { validate } = defineProps<{ validate?: FieldValidator }>()
</script>

<template>
  <Field.Root name="protocols" validation-mode="onChange" :validate="validate">
    <CheckboxGroup :value="[]">
      <Field.Item>
        <Checkbox.Root value="http" data-testid="cb-http" />
      </Field.Item>
      <Field.Item>
        <Checkbox.Root value="https" data-testid="cb-https" />
      </Field.Item>
    </CheckboxGroup>
  </Field.Root>
</template>
