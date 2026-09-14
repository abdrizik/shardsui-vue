<script setup lang="ts">
import { Select } from '@/components/select'

const { onValueChange } = defineProps<{ onValueChange?: (value: unknown) => void }>()
</script>

<template>
  <Select.Root @update:value="onValueChange">
    <Select.Trigger data-testid="trigger">
      <Select.Value placeholder="Pick one" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item value="a">Option A</Select.Item>
          <Select.Item value="b" :disabled="true">Option B (disabled)</Select.Item>
          <Select.Item value="c">Option C</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
