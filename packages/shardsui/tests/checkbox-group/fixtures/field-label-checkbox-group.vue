<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'

const { onCheckedChangeGrannySmith } = defineProps<{
  onCheckedChangeGrannySmith?: (checked: boolean) => void
}>()
</script>

<template>
  <Field.Root name="apple">
    <CheckboxGroup :value="['fuji-apple', 'gala-apple']">
      <Field.Item>
        <Field.Label data-testid="label">
          <Checkbox.Root value="fuji-apple" />
          Fuji
        </Field.Label>
      </Field.Item>
      <Field.Item>
        <Field.Label data-testid="label">
          <Checkbox.Root value="gala-apple" />
          Gala
        </Field.Label>
      </Field.Item>
      <Field.Item>
        <Field.Label data-testid="label">
          <Checkbox.Root
            value="granny-smith-apple"
            @update:checked="(c) => onCheckedChangeGrannySmith?.(c)"
          />
          Granny Smith
        </Field.Label>
      </Field.Item>
    </CheckboxGroup>
  </Field.Root>
</template>
