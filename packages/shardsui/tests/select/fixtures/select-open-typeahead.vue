<script setup lang="ts">
import { Select } from '@/components/select'

const { onValueChange, onItemClick } = defineProps<{
  onValueChange?: (value: unknown) => void
  onItemClick?: () => void
}>()
</script>

<template>
  <Select.Root open @update:value="onValueChange">
    <Select.Trigger data-testid="trigger">
      <Select.Value data-testid="value" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item value="one" :on-click="() => onItemClick?.()">Item One</Select.Item>
          <Select.Item value="two" :on-click="() => onItemClick?.()">Item Two</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
