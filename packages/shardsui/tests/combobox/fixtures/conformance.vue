<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { open = undefined, popupId = undefined } = defineProps<{
  open?: boolean
  popupId?: string
}>()
</script>

<template>
  <Combobox.Root :open="open">
    <Combobox.Input data-testid="trigger" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.List :id="popupId" data-testid="popup">
            <Combobox.Item value="item">Item</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
