<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const {
  onSubmit,
  value,
  readOnly = false,
  disabled = false,
  as = 'span',
  onKeydown,
  onFormKeydown,
  onSubmitClick
} = defineProps<{
  onSubmit?: (event: SubmitEvent) => void
  value?: string
  readOnly?: boolean
  disabled?: boolean
  as?: 'span' | 'button'
  onKeydown?: (event: KeyboardEvent) => void
  onFormKeydown?: (event: KeyboardEvent) => void
  onSubmitClick?: (event: MouseEvent) => void
}>()
</script>

<template>
  <Form :on-submit="onSubmit" @keydown="onFormKeydown">
    <Field.Root name="test-checkbox">
      <Checkbox.Root
        :value="value"
        :read-only="readOnly"
        :disabled="disabled"
        :as="as"
        :on-keydown="onKeydown"
      />
    </Field.Root>
    <button id="submit-button" type="submit" @click="onSubmitClick">Submit</button>
  </Form>
</template>
