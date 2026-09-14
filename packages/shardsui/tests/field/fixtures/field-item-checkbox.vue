<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'

const { onValueChange } = defineProps<{ onValueChange?: (value: string[]) => void }>()
</script>

<template>
  <Field.Root name="apple">
    <CheckboxGroup :value="[]" @update:value="(next) => onValueChange?.(next)">
      <Field.Item disabled>
        <Checkbox.Root value="fuji-apple" />
      </Field.Item>
      <Field.Item>
        <Checkbox.Root value="gala-apple" />
      </Field.Item>
    </CheckboxGroup>
  </Field.Root>
</template>
