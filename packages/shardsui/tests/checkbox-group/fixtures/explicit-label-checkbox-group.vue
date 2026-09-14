<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'

const { onCheckedChangeGala } = defineProps<{ onCheckedChangeGala?: (checked: boolean) => void }>()
</script>

<template>
  <Field.Root name="apple">
    <CheckboxGroup :value="['fuji-apple', 'gala-apple']">
      <Field.Item>
        <Checkbox.Root value="fuji-apple" />
        <Field.Label data-testid="label">Fuji</Field.Label>
        <Field.Description data-testid="description"
          >A fuji apple is the round, edible fruit of an apple tree</Field.Description
        >
      </Field.Item>
      <Field.Item>
        <Checkbox.Root value="gala-apple" @update:checked="(c) => onCheckedChangeGala?.(c)" />
        <Field.Label data-testid="label">Gala</Field.Label>
        <Field.Description data-testid="description"
          >A gala apple is the round, edible fruit of an apple tree</Field.Description
        >
      </Field.Item>
    </CheckboxGroup>
  </Field.Root>
</template>
