<script setup lang="ts">
import { Select } from '@/components/select'
</script>

<template>
  <div>
    <input data-testid="input" />
    <Select.Root value="1" :modal="false">
      <Select.Trigger>Open</Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup data-testid="popup">
            <Select.Item value="1">1</Select.Item>
            <Select.Item value="2">2</Select.Item>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
    <input data-testid="after" />
  </div>
</template>
