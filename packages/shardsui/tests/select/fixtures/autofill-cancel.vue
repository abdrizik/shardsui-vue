<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Select } from '@/components/select'

const { errors = { country: 'server error' } } = defineProps<{
  errors?: Record<string, string | string[]>
}>()

const value = shallowRef<unknown>()
</script>

<template>
  <Form :errors="errors">
    <Field.Root name="country">
      <Select.Root :value="value" @update:value="() => {}">
        <Select.Trigger data-testid="trigger">
          <Select.Value />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Popup>
              <Select.Item value="US">United States</Select.Item>
              <Select.Item value="CA">Canada</Select.Item>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
      <Field.Error data-testid="error" />
    </Field.Root>
  </Form>
</template>
