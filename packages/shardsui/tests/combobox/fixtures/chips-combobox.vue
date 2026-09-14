<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const {
  onValueChange,
  disabled = false,
  readOnly = false,
  chips = [],
  removeAs = 'button'
} = defineProps<{
  onValueChange?: (value: unknown) => void
  disabled?: boolean
  readOnly?: boolean
  chips?: string[]
  removeAs?: 'button' | 'div'
}>()

const value = defineModel<string[] | null>('value')
const open = defineModel<boolean>('open')
</script>

<template>
  <Combobox.Root
    multiple
    v-model:value="value"
    v-model:open="open"
    @update:value="onValueChange"
    :disabled="disabled"
    :read-only="readOnly"
  >
    <Combobox.Chips data-testid="chips">
      <Combobox.Chip v-for="chip in chips" :key="chip" :data-testid="`chip-${chip}`">
        {{ chip }}
        <Combobox.ChipRemove :as="removeAs" :data-testid="`remove-${chip}`" />
      </Combobox.Chip>
      <Combobox.Input data-testid="input" placeholder="Search..." />
    </Combobox.Chips>
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
