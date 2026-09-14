<script setup lang="ts">
import { Select } from '@/components/select'

const {
  value = 'sans',
  items = [
    { value: 'sans', label: 'Sans-serif' },
    { value: 'serif', label: 'Serif' }
  ]
} = defineProps<{
  value?: unknown
  items?: ReadonlyArray<{ value: unknown; label: unknown }>
}>()
</script>

<template>
  <Select.Root :value="value as never" :items="items as never">
    <Select.Value v-slot="{ value: v }" data-testid="value">Custom: {{ v }}</Select.Value>
  </Select.Root>
</template>
