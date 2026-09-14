<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { Combobox } from '@/components/combobox'

type Fruit = { id: number; label: string }

const { onItemHighlighted = undefined } = defineProps<{
  onItemHighlighted?: (value: unknown) => void
}>()

const apple: Fruit = { id: 1, label: 'apple' }
const banana: Fruit = { id: 2, label: 'banana' }
const cherry: Fruit = { id: 3, label: 'cherry' }

const version = shallowRef(0)
const value = computed<Fruit>(() => {
  void version.value
  return { id: 2, label: 'banana' }
})
</script>

<template>
  <Combobox.Root
    :value="value"
    :is-item-equal-to-value="(a: unknown, b: unknown) => (a as Fruit).id === (b as Fruit).id"
    :item-to-string-label="(item: unknown) => (item as Fruit).label"
    @item-highlighted="onItemHighlighted"
  >
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.List>
            <Combobox.Item :value="apple">apple</Combobox.Item>
            <Combobox.Item :value="banana">banana</Combobox.Item>
            <Combobox.Item :value="cherry">cherry</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
  <button type="button" data-testid="force" @click="version += 1">force</button>
</template>
