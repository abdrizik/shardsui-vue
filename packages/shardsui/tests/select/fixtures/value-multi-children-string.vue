<script setup lang="ts">
import { Select } from '@/components/select'

const { value = ['sans', 'serif'], items = { sans: 'Sans-serif', serif: 'Serif' } } = defineProps<{
  value?: unknown[]
  items?: Record<string, unknown>
}>()
</script>

<template>
  <Select.Root multiple :value="value as never" :items="items as never">
    <Select.Value data-testid="value">Custom Multiple Text</Select.Value>
  </Select.Root>
</template>
