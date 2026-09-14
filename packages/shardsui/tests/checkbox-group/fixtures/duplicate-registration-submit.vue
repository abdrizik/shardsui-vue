<script setup lang="ts">
import { shallowRef, useTemplateRef, watchPostEffect } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const { onFormSubmit } = defineProps<{ onFormSubmit: (values: Record<string, unknown>) => void }>()

const trimmed = shallowRef(false)
const form = useTemplateRef<{ validate: (fieldName?: string) => void; $el: HTMLFormElement }>(
  'form'
)

watchPostEffect(() => {
  if (trimmed.value) {
    form.value?.$el.requestSubmit()
  }
})
</script>

<template>
  <Form ref="form" @form-submit="onFormSubmit">
    <Field.Root name="items">
      <CheckboxGroup :value="['one', 'two']">
        <Checkbox.Root v-if="!trimmed" value="one" />
        <Checkbox.Root value="two" />
        <Checkbox.Root v-if="!trimmed" value="two" />
      </CheckboxGroup>
    </Field.Root>
    <button type="button" @click="trimmed = true">Trim</button>
  </Form>
</template>
