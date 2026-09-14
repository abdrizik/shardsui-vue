<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import { Field } from '@/components/field'

type FieldProps = InstanceType<typeof Field.Root>['$props']

const {
  disabled = false,
  invalid = undefined,
  name,
  validate,
  validationMode,
  required = false,
  multiple = false,
  inputInsidePopup = false,
  useComboboxLabel = false,
  triggerId,
  withLabel = false,
  withError = false
} = defineProps<{
  disabled?: boolean
  invalid?: boolean
  name?: string
  validate?: FieldProps['validate']
  validationMode?: FieldProps['validationMode']
  required?: boolean
  multiple?: boolean
  inputInsidePopup?: boolean
  useComboboxLabel?: boolean
  triggerId?: string
  withLabel?: boolean
  withError?: boolean
}>()

const value = defineModel<unknown>('value')
const open = defineModel<boolean>('open')
</script>

<template>
  <Field.Root
    :disabled="disabled"
    :invalid="invalid"
    :name="name"
    :validate="validate"
    :validation-mode="validationMode"
  >
    <Field.Label v-if="withLabel && !useComboboxLabel" data-testid="label">Search</Field.Label>
    <Combobox.Root
      :required="required"
      :multiple="multiple"
      v-model:value="value"
      v-model:open="open"
    >
      <Combobox.Label v-if="useComboboxLabel" data-testid="label">Search</Combobox.Label>
      <Combobox.Input v-if="!inputInsidePopup" data-testid="input" />
      <Combobox.Trigger data-testid="trigger" :id="triggerId">Open</Combobox.Trigger>
      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup data-testid="popup">
            <Combobox.Input v-if="inputInsidePopup" data-testid="input" />
            <Combobox.List>
              <Combobox.Item value="">Select</Combobox.Item>
              <Combobox.Item value="a">a</Combobox.Item>
              <Combobox.Item value="b">b</Combobox.Item>
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
    <template v-if="withError">
      <Field.Description data-testid="description" />
      <Field.Error data-testid="error" match />
    </template>
  </Field.Root>
</template>
