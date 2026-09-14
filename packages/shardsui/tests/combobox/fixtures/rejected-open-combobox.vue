<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { onOpenChange = undefined } = defineProps<{ onOpenChange?: (open: boolean) => void }>()
</script>

<template>
  <Combobox.Root :open="false" @update:open="(next: boolean) => onOpenChange?.(next)">
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List data-testid="list" />
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
