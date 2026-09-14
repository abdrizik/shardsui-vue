<script setup lang="ts">
import { Field } from '@/components/field'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'
</script>

<template>
  <Field.Root name="test" data-testid="field">
    <RadioGroup name="group">
      <Field.Item>
        <Radio.Root value="a" data-testid="item" />
      </Field.Item>
    </RadioGroup>
  </Field.Root>
</template>
