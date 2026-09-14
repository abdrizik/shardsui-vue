<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const disabled = shallowRef(true)
</script>

<template>
  <Form>
    <Field.Root name="test">
      <RadioGroup name="group" required>
        <Radio.Root value="a" :disabled="disabled" data-testid="item-a" />
        <Radio.Root value="b" :disabled="disabled" data-testid="item-b" />
      </RadioGroup>
    </Field.Root>
    <button type="button" @click="disabled = false">Enable</button>
    <button type="submit">Submit</button>
  </Form>
</template>
