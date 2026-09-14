<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const {
  open = true,
  onItemClick = undefined,
  onItemMouseUp = undefined,
  onItemPointerLeave = undefined
} = defineProps<{
  open?: boolean
  onItemClick?: (event: MouseEvent) => void
  onItemMouseUp?: (event: MouseEvent) => void
  onItemPointerLeave?: (event: PointerEvent) => void
}>()
</script>

<template>
  <Combobox.Root :items="['one', 'two']" :open="open">
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.List>
            <Combobox.Item
              value="one"
              :on-click="onItemClick"
              :on-mouseup="onItemMouseUp"
              :on-pointerleave="onItemPointerLeave"
            >
              one
            </Combobox.Item>
            <Combobox.Item value="two">two</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
