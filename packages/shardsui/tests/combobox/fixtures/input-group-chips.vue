<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const {
  onOpenChange,
  readOnly = false,
  openOnInputClick = undefined
} = defineProps<{
  onOpenChange?: (open: boolean) => void
  readOnly?: boolean
  openOnInputClick?: boolean
}>()

const value = defineModel<string[] | null>('value', { default: () => ['a'] })
const open = defineModel<boolean>('open')
</script>

<template>
  <Combobox.Root
    multiple
    :items="['a', 'b']"
    v-model:value="value"
    v-model:open="open"
    @update:open="onOpenChange"
    :read-only="readOnly"
    :open-on-input-click="openOnInputClick"
  >
    <Combobox.InputGroup data-testid="group" style="padding: 10px">
      <Combobox.Chips>
        <Combobox.Chip data-testid="chip">a</Combobox.Chip>
        <Combobox.Input data-testid="input" />
      </Combobox.Chips>
    </Combobox.InputGroup>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List>
            <Combobox.Item value="a">a</Combobox.Item>
            <Combobox.Item value="b">b</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
