<script setup lang="ts">
import { Select } from '@/components/select'

const {
  value = undefined,
  items = undefined,
  placeholder,
  mode = 'string'
} = defineProps<{
  value?: unknown
  items?: readonly { label: unknown; value: unknown }[] | Record<string, unknown> | undefined
  placeholder?: string
  mode?: 'string' | 'function'
}>()
</script>

<template>
  <Select.Root :value="value as never" :items="items as never">
    <Select.Trigger>
      <Select.Value v-slot="{ value: v }" data-testid="value" :placeholder="placeholder">
        <template v-if="mode === 'function'">{{ v ?? 'Function fallback' }}</template>
        <template v-else>Custom Text</template>
      </Select.Value>
    </Select.Trigger>
  </Select.Root>
</template>
