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
    <fieldset :disabled="disabled">
      <Field.Root name="test">
        <RadioGroup required>
          <Radio.Root value="a" data-testid="item-a" />
          <Radio.Root value="b" />
        </RadioGroup>
        <Field.Error match="valueMissing">required</Field.Error>
      </Field.Root>
    </fieldset>
    <button type="button" @click="disabled = false">Enable</button>
    <button type="submit">Submit</button>
  </Form>
</template>
