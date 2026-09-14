<script setup lang="ts">
import { Select } from '@/components/select'

const { open = false, onOpenChange } = defineProps<{
  open?: boolean
  onOpenChange?: (open: boolean) => void
}>()
</script>

<template>
  <Select.Root :open="open" @update:open="(next) => onOpenChange?.(next)">
    <Select.Trigger data-testid="trigger">
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
