<script setup lang="ts">
import { Select } from '@/components/select'

const { id = undefined } = defineProps<{ id?: string }>()
</script>

<template>
  <Select.Root open>
    <Select.Group data-testid="group">
      <Select.GroupLabel :id="id">Fruits</Select.GroupLabel>
    </Select.Group>
  </Select.Root>
</template>
