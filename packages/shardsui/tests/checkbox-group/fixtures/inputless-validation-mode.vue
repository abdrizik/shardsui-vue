<script setup lang="ts">
import { shallowRef } from 'vue'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const { validationMode, validate } = defineProps<{
  validationMode: 'onSubmit' | 'onBlur'
  validate: () => string | null
}>()

const value = shallowRef<string[]>([])
</script>

<template>
  <Form>
    <Field.Root name="group" :validation-mode="validationMode" :validate="validate">
      <CheckboxGroup :value="value" />
    </Field.Root>
    <button type="button" @click="value = ['one']">Select one</button>
    <button type="button" @click="value = ['two']">Select two</button>
    <button type="submit">Submit</button>
  </Form>
</template>
