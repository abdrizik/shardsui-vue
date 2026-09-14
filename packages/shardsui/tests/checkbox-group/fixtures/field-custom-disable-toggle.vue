<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field, type FieldValidator } from '@/components/field'

const disabled = shallowRef(false)

const validate: FieldValidator = (nextValue) =>
  Array.isArray(nextValue) && nextValue.length >= 2 ? null : 'pick two'
</script>

<template>
  <Field.Root name="protocols" validation-mode="onChange" :validate="validate">
    <CheckboxGroup :value="[]">
      <Field.Item>
        <Checkbox.Root value="http" data-testid="cb-http" :disabled="disabled" />
      </Field.Item>
      <Field.Item>
        <Checkbox.Root value="https" data-testid="cb-https" />
      </Field.Item>
    </CheckboxGroup>
    <button type="button" @click="disabled = true">disable</button>
  </Field.Root>
</template>
