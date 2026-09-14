<script setup lang="ts">
import { Combobox } from '@/components/combobox'

type Item = { id: number; name: string; nested: { data: string } }

const value = defineModel<Item | null>('value', { default: null })
</script>

<template>
  <Combobox.Root v-model:value="value">
    <Combobox.Value v-slot="{ value: val }">
      <div data-testid="value">
        {{ val ? `${(val as Item).name} (${(val as Item).id})` : 'No value' }}
      </div>
    </Combobox.Value>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.List>
            <Combobox.Item :value="value">Test Item</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
