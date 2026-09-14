<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const { validationMode, validate } = defineProps<{
  validationMode: 'onSubmit' | 'onBlur'
  validate: () => string | null
}>()

const mounted = shallowRef(true)
const value = shallowRef<string[]>([])
</script>

<template>
  <Form>
    <Field.Root name="group" :validation-mode="validationMode" :validate="validate">
      <CheckboxGroup :value="value">
        <Checkbox.Root v-if="mounted" value="one" />
      </CheckboxGroup>
    </Field.Root>
    <button type="button" @click="mounted = false">Remove</button>
    <button type="button" @click="value = ['one']">Select</button>
    <button type="submit">Submit</button>
  </Form>
</template>
