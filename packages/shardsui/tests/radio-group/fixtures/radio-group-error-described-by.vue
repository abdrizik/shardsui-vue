<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'
</script>

<template>
  <Form>
    <Field.Root name="test" data-testid="field">
      <RadioGroup name="group" required>
        <Field.Item>
          <Radio.Root value="a" />
          <Field.Description>description</Field.Description>
        </Field.Item>
      </RadioGroup>
      <Field.Error match="valueMissing" data-testid="error" />
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>
