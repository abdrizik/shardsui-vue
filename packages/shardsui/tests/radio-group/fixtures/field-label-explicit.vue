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
        <Radio.Root value="apple" />
        <Field.Label data-testid="label">Apple</Field.Label>
        <Field.Description data-testid="description">
          An apple is the round, edible fruit of an apple tree
        </Field.Description>
      </Field.Item>
      <Field.Item>
        <Radio.Root value="banana" />
        <Field.Label data-testid="label">Banana</Field.Label>
        <Field.Description data-testid="description">
          A banana is an elongated, edible fruit
        </Field.Description>
      </Field.Item>
    </RadioGroup>
  </Field.Root>
</template>
