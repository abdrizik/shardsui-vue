<script setup lang="ts">
import { shallowRef } from 'vue'
import { Select } from '@/components/select'

const { initialValue = 'b' } = defineProps<{ initialValue?: string | null }>()

const items = shallowRef(['a', 'b', 'c'])
const value = shallowRef<string | null>(initialValue)
</script>

<template>
  <button data-testid="remove-b" @click="items = items.filter((i) => i !== 'b')">Remove B</button>
  <button data-testid="remove-c" @click="items = items.filter((i) => i !== 'c')">Remove C</button>

  <Select.Root :value="value" @update:value="(v) => (value = v as string | null)">
    <Select.Trigger data-testid="trigger">
      <Select.Value data-testid="value" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item v-for="item in items" :key="item" :value="item">{{ item }}</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
