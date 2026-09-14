<script setup lang="ts">
import { Select } from '@/components/select'

const { wide = true } = defineProps<{ wide?: boolean }>()
</script>

<template>
  <Select.Root modal>
    <Select.Trigger data-testid="trigger">Open</Select.Trigger>
    <Select.Portal>
      <Select.Positioner
        data-testid="positioner"
        :style="wide ? 'width: calc(100vw - 10px)' : 'width: 240px'"
      >
        <Select.Popup>
          <Select.Item value="1">1</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
