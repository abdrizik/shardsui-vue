<script setup lang="ts">
import { Select } from '@/components/select'

const {
  highlightItemOnHover = true,
  onItemOneClick,
  onValueChange,
  oneDisabled = false
} = defineProps<{
  highlightItemOnHover?: boolean
  onItemOneClick?: (event: MouseEvent) => void
  onValueChange?: (value: unknown) => void
  oneDisabled?: boolean
}>()
</script>

<template>
  <Select.Root :highlight-item-on-hover="highlightItemOnHover" @update:value="onValueChange">
    <Select.Trigger data-testid="trigger">
      <Select.Value data-testid="value" placeholder="Select font" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item value="one" :disabled="oneDisabled" :on-click="onItemOneClick">
            one
          </Select.Item>
          <Select.Item value="two">two</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
