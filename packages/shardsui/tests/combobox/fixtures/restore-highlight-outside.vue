<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import type { ComboboxShellProps } from '@/components/combobox/shell-props'
import ItemsList from './items-list.vue'

type RootProps = ComboboxShellProps<unknown, false>

const {
  items = ['apple', 'banana', 'cherry'],
  multiple = false,
  autoHighlight = false,
  keepMounted = false,
  controlled = false
} = defineProps<{
  items?: RootProps['items']
  multiple?: boolean
  autoHighlight?: boolean
  keepMounted?: boolean
  controlled?: boolean
}>()

const value = defineModel<unknown>('value')
const open = defineModel<boolean>('open', { default: false })

function setValue(next: unknown) {
  if (!controlled) value.value = next
}
</script>

<template>
  <Combobox.Root
    :items="items"
    :value="value"
    @update:value="setValue"
    v-model:open="open"
    :multiple="multiple"
    :auto-highlight="autoHighlight"
  >
    <Combobox.Input data-testid="input" />
    <Combobox.Portal :keep-mounted="keepMounted">
      <Combobox.Positioner>
        <Combobox.Popup>
          <ItemsList />
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
