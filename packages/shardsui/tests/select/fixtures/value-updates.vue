<script setup lang="ts">
import { shallowRef } from 'vue'
import { Select } from '@/components/select'

const { items, initialValue = 'sans' } = defineProps<{
  items?: Record<string, unknown> | ReadonlyArray<{ value: unknown; label: unknown }>
  initialValue?: string | null
}>()

const value = shallowRef<string | null>(initialValue)
</script>

<template>
  <button @click="value = 'serif'">serif</button>
  <button @click="value = 'mono'">mono</button>
  <Select.Root
    :value="value"
    :items="items as never"
    @update:value="(v) => (value = v as string | null)"
  >
    <Select.Trigger>
      <Select.Value data-testid="value" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item value="sans">Sans-serif</Select.Item>
          <Select.Item value="serif">Serif</Select.Item>
          <Select.Item value="mono">Monospace</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
