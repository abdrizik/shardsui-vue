<script setup lang="ts">
import { Select } from '@/components/select'

const { open = undefined, popupId = undefined } = defineProps<{
  open?: boolean
  popupId?: string
}>()
</script>

<template>
  <Select.Root :open="open">
    <Select.Trigger data-testid="trigger">
      <Select.Value placeholder="Pick one" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup :id="popupId" data-testid="popup">
          <Select.Item value="a">Option A</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
