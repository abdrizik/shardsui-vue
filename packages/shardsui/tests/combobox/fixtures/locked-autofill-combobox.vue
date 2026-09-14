<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const {
  withField = false,
  disabled = false,
  readOnly = false,
  onValueChange = undefined,
  onInputValueChange = undefined
} = defineProps<{
  withField?: boolean
  disabled?: boolean
  readOnly?: boolean
  onValueChange?: (value: unknown) => void
  onInputValueChange?: (value: string) => void
}>()
</script>

<template>
  <component :is="withField ? Form : 'div'" v-bind="withField ? { errors: { test: 'test' } } : {}">
    <component :is="withField ? Field.Root : 'div'" v-bind="withField ? { name: 'test' } : {}">
      <Combobox.Root
        :name="withField ? undefined : 'test'"
        :disabled="disabled"
        :read-only="readOnly"
        @update:value="onValueChange"
        @update:input-value="onInputValueChange"
      >
        <Combobox.Input data-testid="input" />
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup data-testid="popup">
              <Combobox.List data-testid="list">
                <Combobox.Item value="a">a</Combobox.Item>
                <Combobox.Item value="b">b</Combobox.Item>
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
      <Field.Error v-if="withField" data-testid="error" />
    </component>
  </component>
</template>
