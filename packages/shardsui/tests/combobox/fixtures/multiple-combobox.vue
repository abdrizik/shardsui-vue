<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const {
  onValueChange = undefined,
  onOpenChange = undefined,
  disabled = false,
  readOnly = false,
  required = false,
  name = undefined
} = defineProps<{
  onValueChange?: (value: unknown) => void
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  name?: string
}>()

const value = defineModel<unknown[] | null>('value')
const open = defineModel<boolean>('open')
</script>

<template>
  <Combobox.Root
    multiple
    v-model:value="value"
    v-model:open="open"
    @update:value="onValueChange"
    @update:open="onOpenChange"
    :disabled="disabled"
    :read-only="readOnly"
    :required="required"
    :name="name"
  >
    <Combobox.Input data-testid="input" placeholder="Search..." />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List data-testid="list">
            <Combobox.Item value="apple">Apple</Combobox.Item>
            <Combobox.Item value="banana">Banana</Combobox.Item>
            <Combobox.Item value="cherry">Cherry</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
