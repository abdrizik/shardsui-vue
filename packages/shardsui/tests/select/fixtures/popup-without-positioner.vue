<script setup lang="ts">
import { Select } from '@/components/select'
</script>

<template>
  <Select.Root>
    <Select.Trigger data-testid="trigger">
      <Select.Value />
    </Select.Trigger>
    <Select.Popup data-testid="popup" />
  </Select.Root>
</template>
