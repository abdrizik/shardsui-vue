<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { open = false, onOpenChange = undefined } = defineProps<{
  open?: boolean
  onOpenChange?: (open: boolean) => void
}>()
</script>

<template>
  <Combobox.Root :open="open" @update:open="(next: boolean) => onOpenChange?.(next)">
    <Combobox.Input data-testid="input" />
    <Combobox.Trigger data-testid="trigger">Open</Combobox.Trigger>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List data-testid="list">
            <Combobox.Item value="a">a</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
