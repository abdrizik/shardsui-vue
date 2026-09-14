<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import type { HighlightReason } from '@/components/combobox/item-registry'
import { DirectionProvider } from '@/components/direction-provider'

const {
  onItemHighlighted,
  autoHighlight = false,
  direction = 'ltr',
  rows = [
    ['1', '2', '3'],
    ['4', '5', '6']
  ],
  grouped = false
} = defineProps<{
  onItemHighlighted?: (value: unknown, reason: HighlightReason, index: number) => void
  autoHighlight?: boolean
  direction?: 'ltr' | 'rtl'
  rows?: string[][]
  grouped?: boolean
}>()

const open = defineModel<boolean>('open', { default: true })
</script>

<template>
  <DirectionProvider :direction="direction">
    <Combobox.Root
      grid
      v-model:open="open"
      :auto-highlight="autoHighlight"
      @item-highlighted="onItemHighlighted"
    >
      <Combobox.Input data-testid="input" />
      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup data-testid="popup">
            <Combobox.List data-testid="list">
              <template v-for="(row, r) in rows" :key="r">
                <Combobox.Group v-if="grouped">
                  <Combobox.Row>
                    <Combobox.Item v-for="cell in row" :key="cell" :value="cell">
                      {{ cell }}
                    </Combobox.Item>
                  </Combobox.Row>
                </Combobox.Group>
                <Combobox.Row v-else>
                  <Combobox.Item v-for="cell in row" :key="cell" :value="cell">
                    {{ cell }}
                  </Combobox.Item>
                </Combobox.Row>
              </template>
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  </DirectionProvider>
</template>
