<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field, type FieldValidator } from '@/components/field'
import { Form } from '@/components/form'

const { validateSpy } = defineProps<{ validateSpy: FieldValidator }>()
const checked = shallowRef(true)
</script>

<template>
  <Form>
    <input type="checkbox" data-testid="toggle" :checked="checked" @change="checked = !checked" />
    <Field.Root v-if="checked" name="input1">
      <Field.Control value="one" />
    </Field.Root>
    <Field.Root name="input2" :validate="validateSpy">
      <Field.Control value="two" />
    </Field.Root>
    <button type="submit">submit</button>
  </Form>
</template>
