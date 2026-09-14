<script setup lang="ts">
import { shallowRef } from 'vue'
import { Select } from '@/components/select'

const value = shallowRef<string | null>('a')
const items = shallowRef([
  { value: 'a', label: 'a' },
  { value: 'b', label: 'b' }
])

function updateItems() {
  items.value = [
    { value: 'a', label: 'a new' },
    { value: 'b', label: 'b new' },
    { value: 'c', label: 'c' }
  ]
}
</script>

<template>
  <div>
    <button data-testid="update" @click="updateItems">update</button>
    <button data-testid="select-c" @click="value = 'c'">select c</button>
    <Select.Root :value="value" :items="items" @update:value="(v) => (value = v as string | null)">
      <Select.Trigger>
        <Select.Value data-testid="value" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.Item v-for="item in items" :key="item.value" :value="item.value">
              {{ item.label }}
            </Select.Item>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  </div>
</template>
