<script setup lang="ts">
import { Combobox } from '@/components/combobox'

type Item = { value: string; label: string }

const {
  multiple = false,
  items = undefined,
  placeholder = undefined
} = defineProps<{
  multiple?: boolean
  items?: Item[]
  placeholder?: string
}>()

const value = defineModel<unknown>('value')
</script>

<template>
  <Combobox.Root
    v-model:value="value"
    :multiple="multiple"
    :items="items"
    :item-to-string-label="items ? (item: unknown) => (item as Item).label : undefined"
  >
    <Combobox.Trigger data-testid="trigger">
      <Combobox.Value v-slot="{ value: v }" :placeholder="placeholder">
        <span data-testid="value-children">{{ v == null ? 'NONE' : JSON.stringify(v) }}</span>
      </Combobox.Value>
    </Combobox.Trigger>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.List>
            <Combobox.Item value="apple">Apple</Combobox.Item>
            <Combobox.Item value="banana">Banana</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
