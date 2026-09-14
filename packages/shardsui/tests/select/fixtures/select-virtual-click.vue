<script setup lang="ts">
import { Select } from '@/components/select'

const open = defineModel<boolean>('open', { default: true })
</script>

<template>
  <Select.Root v-model:open="open" :highlight-item-on-hover="false">
    <Select.Trigger data-testid="trigger">
      <Select.Value data-testid="value" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item value="one">one</Select.Item>
          <Select.Item value="two">two</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
