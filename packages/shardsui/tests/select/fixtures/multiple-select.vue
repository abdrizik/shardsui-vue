<script setup lang="ts">
import { Select } from '@/components/select'

const {
  onValueChange,
  name,
  required = false
} = defineProps<{
  onValueChange?: (v: unknown) => void
  name?: string
  required?: boolean
}>()

const value = defineModel<string[] | null>('value')
</script>

<template>
  <Select.Root
    multiple
    v-model:value="value as never"
    :name="name"
    :required="required"
    @update:value="onValueChange"
  >
    <Select.Trigger data-testid="trigger">
      <Select.Value data-testid="value" placeholder="Pick options" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item value="a">Option A</Select.Item>
          <Select.Item value="b">Option B</Select.Item>
          <Select.Item value="c">Option C</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
