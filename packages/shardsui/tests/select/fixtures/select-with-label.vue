<script setup lang="ts">
import { Select } from '@/components/select'

const value = defineModel<unknown>('value')
</script>

<template>
  <Select.Root v-model:value="value">
    <Select.Label data-testid="label">Font</Select.Label>
    <Select.Trigger data-testid="trigger">
      <Select.Value />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item value="sans">Sans-serif</Select.Item>
          <Select.Item value="serif">Serif</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
