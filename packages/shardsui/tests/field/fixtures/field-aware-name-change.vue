<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Select } from '@/components/select'

defineProps<{ onFormSubmit: (values: Record<string, unknown>) => void }>()

const name = shallowRef<string | undefined>('quantity')
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root>
      <Select.Root :name="name" value="sans">
        <Select.Trigger>sans</Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Popup>
              <Select.Item value="sans">sans</Select.Item>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field.Root>
    <button type="button" @click="name = 'amount'">Change name</button>
    <button type="button" @click="name = undefined">Clear name</button>
    <button type="submit">submit</button>
  </Form>
</template>
