<script setup lang="ts">
import { Field, type FieldValidator } from '@/components/field'
import { Select } from '@/components/select'

const {
  multiple = false,
  validationMode,
  validate,
  withEmptyItem = true
} = defineProps<{
  multiple?: boolean
  validationMode?: 'onBlur' | 'onChange' | undefined
  validate?: FieldValidator
  withEmptyItem?: boolean
}>()

const value = defineModel<unknown>('value')
</script>

<template>
  <Field.Root :validation-mode="validationMode" :validate="validate">
    <Select.Root v-model:value="value" :multiple="multiple">
      <Select.Trigger data-testid="trigger" />
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.Item v-if="withEmptyItem" value="">Select</Select.Item>
            <Select.Item value="1">Option 1</Select.Item>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  </Field.Root>
  <button data-testid="outside">Outside</button>
</template>
