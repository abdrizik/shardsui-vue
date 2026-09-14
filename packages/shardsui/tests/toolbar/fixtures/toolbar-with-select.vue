<script setup lang="ts">
import { Select } from '@/components/select'
import { Toolbar } from '@/components/toolbar'

const { onValueChange } = defineProps<{
  onValueChange?: (value: string | null | undefined) => void
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
    <Toolbar.Button data-testid="btn-before">Before</Toolbar.Button>
    <Select.Root
      v-model:value="value"
      :items="items"
      :item-to-string-label="(item: string) => item"
      @update:value="onValueChange"
    >
      <Select.Trigger data-testid="select-trigger">
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup data-testid="popup">
            <Select.Item value="a" data-testid="item-a">Option A</Select.Item>
            <Select.Item value="b" data-testid="item-b">Option B</Select.Item>
            <Select.Item value="c" data-testid="item-c">Option C</Select.Item>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
    <Toolbar.Button data-testid="btn-after">After</Toolbar.Button>
  </Toolbar.Root>
</template>
