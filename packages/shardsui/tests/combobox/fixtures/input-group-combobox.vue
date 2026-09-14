<script setup lang="ts">
import type { FunctionalComponent } from 'vue'
import { Combobox } from '@/components/combobox'
import { Field } from '@/components/field'

const {
  disabled = false,
  readOnly = false,
  openOnInputClick = undefined,
  withField = false,
  fieldDisabled = false
} = defineProps<{
  disabled?: boolean
  readOnly?: boolean
  openOnInputClick?: boolean
  withField?: boolean
  fieldDisabled?: boolean
}>()

const value = defineModel<unknown>('value')
const open = defineModel<boolean>('open')

const Passthrough: FunctionalComponent = (_props, { slots }) => slots.default?.()
</script>

<template>
  <component
    :is="withField ? Field.Root : Passthrough"
    v-bind="withField ? { disabled: fieldDisabled } : {}"
  >
    <Combobox.Root
      v-model:value="value"
      v-model:open="open"
      :disabled="disabled"
      :read-only="readOnly"
      :open-on-input-click="openOnInputClick"
    >
      <Combobox.InputGroup data-testid="group">
        <span data-testid="pad">pad</span>
        <Combobox.Input data-testid="input" />
        <Combobox.Trigger data-testid="trigger">Open</Combobox.Trigger>
      </Combobox.InputGroup>
      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup data-testid="popup">
            <Combobox.List data-testid="list">
              <Combobox.Item value="apple">Apple</Combobox.Item>
              <Combobox.Item value="banana">Banana</Combobox.Item>
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  </component>
</template>
