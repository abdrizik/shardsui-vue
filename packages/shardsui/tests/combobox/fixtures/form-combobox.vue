<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import type { ComboboxShellProps } from '@/components/combobox/shell-props'
import { Field } from '@/components/field'
import { Form, type FormErrors } from '@/components/form'

type RootProps = ComboboxShellProps<unknown, false>

const {
  onFormSubmit,
  onsubmit,
  errors,
  name = 'country',
  required = false,
  multiple = false,
  items,
  itemToStringLabel,
  itemToStringValue,
  withError = false,
  openOnInputClick = undefined
} = defineProps<{
  onFormSubmit?: (values: Record<string, unknown>) => void
  onsubmit?: (event: SubmitEvent) => void
  errors?: FormErrors
  name?: string
  required?: boolean
  multiple?: boolean
  items?: RootProps['items']
  itemToStringLabel?: RootProps['itemToStringLabel']
  itemToStringValue?: RootProps['itemToStringValue']
  withError?: boolean
  openOnInputClick?: boolean
}>()

const value = defineModel<unknown>('value')
</script>

<template>
  <Form @form-submit="onFormSubmit" :on-submit="onsubmit" :errors="errors">
    <Field.Root :name="name">
      <Combobox.Root
        :value="value"
        :required="required"
        :multiple="multiple"
        :open-on-input-click="openOnInputClick"
        :items="items"
        :item-to-string-label="itemToStringLabel"
        :item-to-string-value="itemToStringValue"
      >
        <Combobox.Input data-testid="input" />
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup data-testid="popup">
              <Combobox.List>
                <template v-if="items">
                  <Combobox.Item
                    v-for="item in items"
                    :key="itemToStringValue ? itemToStringValue(item) : String(item)"
                    :value="item"
                  >
                    {{ itemToStringLabel ? itemToStringLabel(item) : String(item) }}
                  </Combobox.Item>
                </template>
                <template v-else>
                  <Combobox.Item value="a">a</Combobox.Item>
                  <Combobox.Item value="b">b</Combobox.Item>
                </template>
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
      <Field.Error v-if="withError" match="valueMissing" data-testid="error">required</Field.Error>
      <Field.Error v-if="errors" data-testid="error" />
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>
