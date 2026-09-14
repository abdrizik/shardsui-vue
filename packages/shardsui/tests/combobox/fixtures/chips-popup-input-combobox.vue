<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const value = defineModel<string[] | null>('value', { default: () => ['apple'] })
</script>

<template>
  <Combobox.Root multiple :items="['apple', 'banana']" v-model:value="value">
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
      </Combobox.Value>
    </Combobox.Chips>
    <Combobox.Trigger data-testid="trigger">Open</Combobox.Trigger>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.Input data-testid="input" />
          <Combobox.List data-testid="list">
            <Combobox.Item value="apple">apple</Combobox.Item>
            <Combobox.Item value="banana">banana</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
