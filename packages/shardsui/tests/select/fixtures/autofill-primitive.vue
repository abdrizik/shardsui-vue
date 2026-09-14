<script setup lang="ts">
import { Select } from '@/components/select'

const {
  name = 'country',
  multiple = false,
  onValueChange,
  options = [
    { value: 'a', label: 'a' },
    { value: 'b', label: 'b' }
  ]
} = defineProps<{
  name?: string
  multiple?: boolean
  onValueChange?: (value: unknown) => void
  options?: { value: string; label: string | null }[]
}>()
</script>

<template>
  <Select.Root :name="name" :multiple="multiple" @update:value="onValueChange">
    <Select.Trigger data-testid="trigger">
      <Select.Value />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item v-for="option in options" :key="option.value" :value="option.value">
            {{ option.label }}
          </Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
