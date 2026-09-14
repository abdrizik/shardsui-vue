<script setup lang="ts">
import { Select } from '@/components/select'
</script>

<template>
  <Select.Root multiple open :value="['a']">
    <Select.Trigger data-testid="trigger">
      <Select.Value />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item value="a">
            a
            <Select.ItemIndicator keep-mounted data-testid="indicator" />
          </Select.Item>
          <Select.Item value="b">b</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
