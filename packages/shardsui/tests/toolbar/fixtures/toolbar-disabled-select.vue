<script setup lang="ts">
import { Select } from '@/components/select'
import { Toolbar } from '@/components/toolbar'

const { onValueChange, onOpenChange } = defineProps<{
  onValueChange?: (value: string | null | undefined) => void
  onOpenChange?: (open: boolean) => void
}>()

const value = defineModel<string>('value', { default: 'a' })

const items = [
  { label: 'a', value: 'a' },
  { label: 'b', value: 'b' },
  { label: 'c', value: 'c' }
]
</script>

<template>
  <Toolbar.Root>
    <Select.Root
      v-model:value="value"
      :items="items"
      :item-to-string-label="(item: string) => item"
      @update:value="onValueChange"
      @update:open="onOpenChange"
    >
      <Select.Trigger data-testid="select-trigger" disabled as="span">
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.Item value="a" data-testid="item-a">Option A</Select.Item>
            <Select.Item value="b" data-testid="item-b">Option B</Select.Item>
            <Select.Item value="c" data-testid="item-c">Option C</Select.Item>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  </Toolbar.Root>
</template>
