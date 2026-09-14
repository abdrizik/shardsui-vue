<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { showTrigger = true, onOpenChange = undefined } = defineProps<{
  showTrigger?: boolean
  onOpenChange?: (open: boolean) => void
}>()
</script>

<template>
  <Combobox.Root @update:open="onOpenChange">
    <Combobox.Trigger v-if="showTrigger" data-testid="trigger">Open</Combobox.Trigger>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.List>
            <Combobox.Item value="alpha">Alpha</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
