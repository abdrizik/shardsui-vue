<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const {
  autoHighlight = false,
  highlightItemOnHover = true,
  onItemHighlighted = undefined
} = defineProps<{
  autoHighlight?: boolean
  highlightItemOnHover?: boolean
  onItemHighlighted?: (value: unknown) => void
}>()

const open = defineModel<boolean>('open')
</script>

<template>
  <Combobox.Root
    :auto-highlight="autoHighlight"
    :highlight-item-on-hover="highlightItemOnHover"
    @item-highlighted="onItemHighlighted"
    v-model:open="open"
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
