<script setup lang="ts">
import { Select } from '@/components/select'
</script>

<template>
  <Select.Root open>
    <Select.Trigger data-testid="trigger">Open</Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.ScrollDownArrow keep-mounted data-testid="down" />
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
