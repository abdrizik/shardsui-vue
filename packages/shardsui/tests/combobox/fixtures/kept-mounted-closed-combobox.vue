<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import ItemsList from './items-list.vue'

const { items = ['apple', 'banana'] } = defineProps<{ items?: string[] }>()
</script>

<template>
  <Combobox.Root :items="items" auto-highlight :open="false" @update:open="() => {}">
    <Combobox.Input data-testid="input" />
    <Combobox.Portal keep-mounted>
      <Combobox.Positioner>
        <Combobox.Popup>
          <ItemsList />
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
