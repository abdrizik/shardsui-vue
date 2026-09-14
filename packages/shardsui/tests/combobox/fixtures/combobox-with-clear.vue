<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const {
  disabled = false,
  readOnly = false,
  onValueChange = undefined,
  keepMounted = false,
  multiple = false
} = defineProps<{
  disabled?: boolean
  readOnly?: boolean
  onValueChange?: (value: unknown) => void
  keepMounted?: boolean
  multiple?: boolean
}>()

const value = defineModel<unknown>('value')
const open = defineModel<boolean>('open')
</script>

<template>
  <Combobox.Root
    :multiple="multiple"
    v-model:value="value"
    v-model:open="open"
    :disabled="disabled"
    :read-only="readOnly"
    @update:value="onValueChange"
  >
    <Combobox.Chips v-if="multiple" data-testid="chips">
      <Combobox.Value v-slot="{ value: selected }">
        <Combobox.Chip
          v-for="chip in (selected ?? []) as string[]"
          :key="chip"
          :data-testid="`chip-${chip}`"
        >
          {{ chip }}
        </Combobox.Chip>
      </Combobox.Value>
      <Combobox.Input data-testid="input" placeholder="Search..." />
    </Combobox.Chips>
    <Combobox.Input v-else data-testid="input" placeholder="Search..." />
    <Combobox.Clear data-testid="clear" :keep-mounted="keepMounted" :disabled="disabled" />
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
