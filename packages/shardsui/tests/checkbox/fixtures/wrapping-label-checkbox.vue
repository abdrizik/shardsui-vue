<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'

const { readOnly = false } = defineProps<{ readOnly?: boolean }>()
</script>

<template>
  <label data-testid="label">
    <Checkbox.Root :read-only="readOnly" />
    Toggle
  </label>
</template>
