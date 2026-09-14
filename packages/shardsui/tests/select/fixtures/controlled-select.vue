<script setup lang="ts">
import { Select } from '@/components/select'

const { onValueChange } = defineProps<{ onValueChange?: (value: unknown) => void }>()

const value = defineModel<unknown>('value')
</script>

<template>
  <Select.Root v-model:value="value" @update:value="onValueChange">
    <Select.Trigger data-testid="trigger">
      <Select.Value data-testid="value" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item value="a">a</Select.Item>
          <Select.Item value="b">b</Select.Item>
          <Select.Item value="c">c</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
