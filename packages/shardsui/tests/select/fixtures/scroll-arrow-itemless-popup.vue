<script setup lang="ts">
import { Select } from '@/components/select'
</script>

<template>
  <Select.Root open>
    <Select.Trigger data-testid="trigger">Open</Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup data-testid="popup">
          <Select.ScrollUpArrow keep-mounted data-testid="up" />
          <Select.ScrollDownArrow keep-mounted data-testid="down" />
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
