<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Switch } from '@/components/switch'

const { onSubmit } = defineProps<{ onSubmit: () => void }>()

const checked = shallowRef(false)
const blocked = shallowRef(true)

function onsubmit(event: SubmitEvent) {
  event.preventDefault()
  onSubmit()
}
</script>

<template>
  <Form :on-submit="onsubmit">
    <Field.Root name="notifications">
      <Switch.Root
        required
        aria-describedby="external-description"
        :checked="checked"
        @update:checked="
          (next) => {
            if (!blocked) checked = next
          }
        "
      >
        <Switch.Thumb />
      </Switch.Root>
      <Field.Description data-testid="description">Choose a setting</Field.Description>
      <Field.Error match="valueMissing" data-testid="error">required</Field.Error>
    </Field.Root>
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
    <button type="button" @click="blocked = false">Allow</button>
  </Form>
</template>
