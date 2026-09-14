<script setup lang="ts">
import { shallowRef } from 'vue'
import { Combobox } from '@/components/combobox'

type Item = { value: string; label: string }

const a: Item = { value: 'a', label: 'a' }
const b: Item = { value: 'b', label: 'b' }
let c: Item | null = null

const value = shallowRef<Item | null>(a)
const items = shallowRef<Item[]>([a, b])

function updateItems() {
  a.label = 'a new'
  c = { value: 'c', label: 'c' }
  items.value = [a, b, c]
}

function selectC() {
  if (c) value.value = c
}
</script>

<template>
  <div>
    <button @click="updateItems">update</button>
    <button @click="selectC">select c</button>
    <Combobox.Root v-model:value="value" :items="items">
      <Combobox.Trigger data-testid="value">
        <Combobox.Value />
      </Combobox.Trigger>
      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup>
            <Combobox.List>
              <Combobox.Item v-for="item in items" :key="item.value" :value="item">
                {{ item.label }}
              </Combobox.Item>
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  </div>
</template>
