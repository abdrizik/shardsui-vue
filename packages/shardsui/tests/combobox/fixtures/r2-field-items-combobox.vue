<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import { Field } from '@/components/field'

type Option = { id: string; label: string }

type FieldProps = InstanceType<typeof Field.Root>['$props']

const {
  multiple = false,
  validate,
  validationMode,
  options = [
    { id: 'a', label: 'a' },
    { id: 'b', label: 'b' }
  ],
  withSpanLabel = false,
  withInput = false
} = defineProps<{
  multiple?: boolean
  validate?: FieldProps['validate']
  validationMode?: FieldProps['validationMode']
  options?: Option[]
  withSpanLabel?: boolean
  withInput?: boolean
}>()

const open = defineModel<boolean>('open')
const value = defineModel<Option | Option[] | null>('value')
</script>

<template>
  <Field.Root :validation-mode="validationMode" :validate="validate">
    <Combobox.Root
      :open="open"
      :multiple="multiple"
      :value="value"
      :items="options"
      :item-to-string-label="(item: Option) => item.label"
      :item-to-string-value="(item: Option) => item.id"
      :is-item-equal-to-value="(item: Option, v: Option) => item.id === v.id"
    >
      <Combobox.Input v-if="withInput" data-testid="input" />
      <Combobox.Trigger data-testid="trigger" />
      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup data-testid="popup">
            <Combobox.List data-testid="list">
              <Combobox.Item v-for="option in options" :key="option.id" :value="option">
                {{ option.label }}
              </Combobox.Item>
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
    <Field.Label v-if="withSpanLabel" data-testid="label" as="span" />
  </Field.Root>
</template>
