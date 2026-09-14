<script setup lang="ts">
import { Select } from '@/components/select'

const { onItemClick } = defineProps<{ onItemClick?: (event: MouseEvent) => void }>()
</script>

<template>
  <Select.Root open disabled>
    <Select.Trigger>
      <Select.Value data-testid="value" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item value="one" :on-click="onItemClick">one</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
