<script setup lang="ts">
import { Select } from '@/components/select'

const { value = undefined, items = undefined } = defineProps<{
  value?: unknown
  items?: readonly unknown[] | Record<string, unknown> | undefined
}>()
</script>

<template>
  <Select.Root multiple :value="value as never" :items="items as never">
    <Select.Trigger>
      <Select.Value data-testid="value" />
    </Select.Trigger>
  </Select.Root>
</template>
