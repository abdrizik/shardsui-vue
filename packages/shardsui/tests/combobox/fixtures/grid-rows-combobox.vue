<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import type { HighlightReason } from '@/components/combobox/item-registry'

const {
  onItemHighlighted,
  rows = [
    ['1', '2', '3'],
    ['4', '5', '6']
  ]
} = defineProps<{
  onItemHighlighted?: (value: unknown, reason: HighlightReason, index: number) => void
  rows?: string[][]
}>()

const open = defineModel<boolean>('open')
</script>

<template>
  <Combobox.Root grid v-model:open="open" @item-highlighted="onItemHighlighted">
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List data-testid="list">
            <Combobox.Row v-for="(row, r) in rows" :key="r">
              <Combobox.Item v-for="cell in row" :key="cell" :value="cell">{{
                cell
              }}</Combobox.Item>
            </Combobox.Row>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
