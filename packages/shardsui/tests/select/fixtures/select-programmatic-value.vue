<script setup lang="ts">
import { shallowRef } from 'vue'
import { Select } from '@/components/select'

const withItems = shallowRef<string | null>(null)
const withoutItems = shallowRef<string | null>(null)

function set() {
  withItems.value = 'b'
  withoutItems.value = 'b'
}
</script>

<template>
  <button type="button" @click="set">set</button>

  <Select.Root :items="{ a: 'Apple', b: 'Banana' }" v-model:value="withItems">
    <Select.Trigger>
      <Select.Value data-testid="items-value" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item value="a">Apple</Select.Item>
          <Select.Item value="b">Banana</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>

  <Select.Root v-model:value="withoutItems">
    <Select.Trigger>
      <Select.Value data-testid="plain-value" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item value="a">a</Select.Item>
          <Select.Item value="b">b</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
