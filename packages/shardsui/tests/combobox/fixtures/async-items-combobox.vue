<script setup lang="ts">
import { shallowRef } from 'vue'
import { Combobox } from '@/components/combobox'
import ItemsList from './items-list.vue'

const items = shallowRef<string[]>(['Apple', 'Banana', 'Cherry'])
const selectedValue = shallowRef<string | null>(null)

function onOpenChangeComplete(open: boolean) {
  if (!open && selectedValue.value) items.value = [selectedValue.value]
}
</script>

<template>
  <Combobox.Root
    :items="items"
    @update:value="(value: unknown) => (selectedValue = value as string | null)"
    @open-change-complete="onOpenChangeComplete"
  >
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <ItemsList />
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
