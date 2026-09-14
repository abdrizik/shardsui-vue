<script setup lang="ts">
import { Select } from '@/components/select'

const { labelMounted = true } = defineProps<{ labelMounted?: boolean }>()
</script>

<template>
  <Select.Root open>
    <Select.Group data-testid="group">
      <Select.GroupLabel v-if="labelMounted" id="group-label">Fruits</Select.GroupLabel>
    </Select.Group>
  </Select.Root>
</template>
