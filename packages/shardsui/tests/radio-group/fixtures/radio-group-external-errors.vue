<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'
</script>

<template>
  <Form :errors="{ test: 'test' }">
    <Field.Root name="test" data-testid="field">
      <RadioGroup data-testid="radio-group">
        <Field.Item>
          <Radio.Root value="a" data-testid="item-a" />
        </Field.Item>
        <Field.Item>
          <Radio.Root value="b" data-testid="item-b" />
        </Field.Item>
      </RadioGroup>
      <Field.Error data-testid="error" />
    </Field.Root>
  </Form>
</template>
