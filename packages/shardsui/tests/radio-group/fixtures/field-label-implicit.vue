<script setup lang="ts">
import { Field } from '@/components/field'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { onValueChange } = defineProps<{ onValueChange?: (value: unknown) => void }>()
</script>

<template>
  <Field.Root name="options">
    <RadioGroup @update:value="(next) => onValueChange?.(next)">
      <Field.Item>
        <Field.Label data-testid="label">
          <Radio.Root value="apple" />
          Apple
        </Field.Label>
      </Field.Item>
      <Field.Item>
        <Field.Label data-testid="label">
          <Radio.Root value="banana" />
          Banana
        </Field.Label>
      </Field.Item>
    </RadioGroup>
  </Field.Root>
</template>
