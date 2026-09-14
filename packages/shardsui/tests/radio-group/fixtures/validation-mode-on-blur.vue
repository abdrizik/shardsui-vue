<script setup lang="ts">
import { Field, type FieldValidator } from '@/components/field'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { validate } = defineProps<{ validate: FieldValidator }>()
</script>

<template>
  <Field.Root validation-mode="onBlur" :validate="validate">
    <RadioGroup value="a">
      <Radio.Root value="a" data-testid="radio-a" />
      <Radio.Root value="b" data-testid="radio-b" />
    </RadioGroup>
  </Field.Root>
  <button type="button">Outside</button>
</template>
