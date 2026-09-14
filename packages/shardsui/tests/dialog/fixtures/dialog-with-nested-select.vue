<script setup lang="ts">
import { Select } from '@/components/select'
import DialogArrangements from './dialog-arrangements.vue'

const { arrangement = 'contained' } = defineProps<{
  arrangement?: 'contained' | 'detached' | 'multiple-detached'
}>()
</script>

<template>
  <DialogArrangements :arrangement="arrangement">
    <Select.Root>
      <Select.Trigger data-testid="select-trigger">Open select</Select.Trigger>
      <Select.Portal>
        <Select.Positioner data-testid="select-positioner">
          <Select.Popup>
            <Select.Item value="a">Item</Select.Item>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  </DialogArrangements>
</template>
