<script setup lang="ts">
import { Field } from '@/components/field'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'
</script>

<template>
  <Field.Root name="apple">
    <RadioGroup aria-describedby="external-description">
      <Field.Description data-testid="group-description">Group description</Field.Description>
      <Field.Item>
        <Field.Label>
          <Radio.Root value="fuji-apple" aria-describedby="radio-description" />
          Fuji
        </Field.Label>
      </Field.Item>
    </RadioGroup>
  </Field.Root>
</template>
