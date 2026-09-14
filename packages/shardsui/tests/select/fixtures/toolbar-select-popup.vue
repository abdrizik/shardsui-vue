<script setup lang="ts">
import { Select } from '@/components/select'
import { Toolbar } from '@/components/toolbar'

const { onKeydown } = defineProps<{ onKeydown?: (event: KeyboardEvent) => void }>()
</script>

<template>
  <Toolbar.Root :on-keydown="onKeydown">
    <Select.Root value="a">
      <Select.Trigger data-testid="trigger">
        <Select.Value />
      </Select.Trigger>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item value="a">a</Select.Item>
          <Select.Item value="b">b</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Root>
    <Toolbar.Button data-testid="next">Next</Toolbar.Button>
  </Toolbar.Root>
</template>
