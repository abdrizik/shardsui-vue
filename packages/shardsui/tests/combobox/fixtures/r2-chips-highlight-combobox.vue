<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { autoHighlight = false, items = ['apple', 'banana', 'cherry'] } = defineProps<{
  autoHighlight?: boolean
  items?: string[]
}>()

const open = defineModel<boolean>('open', { default: true })
const value = defineModel<string[] | null>('value')
</script>

<template>
  <Combobox.Root
    multiple
    v-model:open="open"
    v-model:value="value"
    :auto-highlight="autoHighlight"
    :items="items"
  >
    <Combobox.Chips data-testid="chips">
      <Combobox.Value v-slot="{ value: selected }">
        <Combobox.Chip
          v-for="chip in (selected ?? []) as string[]"
          :key="chip"
          :data-testid="`chip-${chip}`"
        >
          {{ chip }}
          <Combobox.ChipRemove :data-testid="`remove-${chip}`" :aria-label="`Remove ${chip}`" />
        </Combobox.Chip>
        <Combobox.Input data-testid="input" />
      </Combobox.Value>
    </Combobox.Chips>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List data-testid="list">
            <Combobox.Item v-for="item in items" :key="item" :value="item">
              {{ item }}
            </Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
