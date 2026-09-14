<script setup lang="ts">
import { shallowRef } from 'vue'
import { Select } from '@/components/select'

const { onValueChange } = defineProps<{ onValueChange?: (value: unknown) => void }>()

const items = shallowRef(['a', 'b'])
</script>

<template>
  <Select.Root
    multiple
    :open="true"
    :value="['a']"
    @update:open="() => {}"
    @update:value="onValueChange"
  >
    <Select.Trigger data-testid="trigger">
      <Select.Value />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item v-for="item in items" :key="item" :value="item">{{ item }}</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
  <button data-testid="add" @click="items = [...items, 'c']">Add C</button>
</template>
