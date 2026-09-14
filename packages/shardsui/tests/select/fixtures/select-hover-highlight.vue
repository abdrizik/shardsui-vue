<script setup lang="ts">
import { Select } from '@/components/select'

const { highlightItemOnHover = true, multiple = false } = defineProps<{
  highlightItemOnHover?: boolean
  multiple?: boolean
}>()

const open = defineModel<boolean>('open', { default: true })
</script>

<template>
  <Select.Root
    v-model:open="open"
    :highlight-item-on-hover="highlightItemOnHover"
    :multiple="multiple"
  >
    <Select.Trigger data-testid="trigger">
      <Select.Value />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner data-testid="positioner">
        <Select.Popup>
          <Select.Item value="a">a</Select.Item>
          <Select.Item value="b">b</Select.Item>
          <Select.Item value="c">c</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
