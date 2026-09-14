<script setup lang="ts">
import { Select } from '@/components/select'
import type { Side } from '@/internal/floating/anchor-positioning'

const { side = 'right' } = defineProps<{ side?: Side }>()
</script>

<template>
  <Select.Root>
    <Select.Trigger data-testid="trigger">Trigger</Select.Trigger>
    <Select.Portal>
      <Select.Positioner :side="side">
        <Select.Popup>
          <Select.Item value="apple">apple</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
