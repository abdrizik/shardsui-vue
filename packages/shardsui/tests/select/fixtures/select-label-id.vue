<script setup lang="ts">
import { Select } from '@/components/select'

const { id = 'first', labelId } = defineProps<{ id?: string; labelId?: string }>()
</script>

<template>
  <Select.Root :id="id">
    <Select.Label data-testid="label" :id="labelId">Theme</Select.Label>
    <Select.Trigger data-testid="trigger" />
    <Select.Portal>
      <Select.Positioner />
    </Select.Portal>
  </Select.Root>
</template>
