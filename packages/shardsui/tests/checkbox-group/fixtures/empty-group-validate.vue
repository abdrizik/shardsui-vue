<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const { validate } = defineProps<{ validate: () => string | null }>()

const form = useTemplateRef<{ validate: (fieldName?: string) => void; $el: HTMLFormElement }>(
  'form'
)
</script>

<template>
  <Form ref="form">
    <Field.Root name="group" :validate="validate">
      <CheckboxGroup :value="[]" />
    </Field.Root>
  </Form>
  <button type="button" @click="form?.validate('group')">Validate</button>
</template>
