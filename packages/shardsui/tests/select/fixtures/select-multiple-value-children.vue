<script setup lang="ts">
import { Select } from '@/components/select'

const { value = undefined, items = undefined } = defineProps<{
  value?: unknown
  items?: readonly unknown[] | Record<string, unknown> | undefined
}>()
</script>

<template>
  <Select.Root multiple :value="value as never" :items="items as never">
    <Select.Value v-slot="{ value: v }" data-testid="value">
      Array: {{ Array.isArray(v) }} | Joined: {{ Array.isArray(v) ? v.join(' + ') : String(v) }}
    </Select.Value>
  </Select.Root>
</template>
