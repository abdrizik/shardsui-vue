<script setup lang="ts">
import { Select } from '@/components/select'

const { id, name } = defineProps<{ id?: string; name?: string }>()
</script>

<template>
  <Select.Root :id="id" :name="name">
    <Select.Trigger>
      <Select.Value />
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
