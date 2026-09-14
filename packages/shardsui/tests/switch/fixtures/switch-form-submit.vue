<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Switch } from '@/components/switch'

const {
  onData,
  value,
  disabled = false
} = defineProps<{
  onData: (data: FormData) => void
  value?: string
  disabled?: boolean
}>()

function onsubmit(event: SubmitEvent) {
  event.preventDefault()
  onData(new FormData(event.currentTarget as HTMLFormElement))
}
</script>

<template>
  <Form :on-submit="onsubmit">
    <Field.Root name="test-switch">
      <Switch.Root :value="value" :disabled="disabled" data-testid="switch" />
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>
