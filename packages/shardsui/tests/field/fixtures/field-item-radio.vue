<script setup lang="ts">
import { Field } from '@/components/field'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { onValueChange } = defineProps<{ onValueChange?: (value: unknown) => void }>()
</script>

<template>
  <Field.Root name="apple">
    <RadioGroup value="" @update:value="(next) => onValueChange?.(next)">
      <Field.Item disabled>
        <Radio.Root value="fuji-apple" />
      </Field.Item>
      <Field.Item>
        <Radio.Root value="gala-apple" />
      </Field.Item>
    </RadioGroup>
  </Field.Root>
</template>
