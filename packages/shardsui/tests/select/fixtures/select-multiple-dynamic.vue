<script setup lang="ts">
import { shallowRef } from 'vue'
import { Select } from '@/components/select'

const value = defineModel<string[]>('value', { default: () => ['a', 'c'] })

const items = shallowRef(['a', 'b', 'c'])

function removeItem(it: string) {
  items.value = items.value.filter((i) => i !== it)
}
</script>

<template>
  <div>
    <Select.Root multiple v-model:value="value as never">
      <Select.Trigger data-testid="trigger">
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.Item v-for="it in items" :key="it" :value="it">{{ it }}</Select.Item>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
    <button data-testid="remove-a" @click="removeItem('a')">Remove A</button>
    <button data-testid="remove-c" @click="removeItem('c')">Remove C</button>
  </div>
</template>
