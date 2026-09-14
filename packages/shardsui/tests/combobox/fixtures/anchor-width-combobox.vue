<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const {
  withInputGroup = false,
  inputWidth = 120,
  triggerWidth = 240,
  inputGroupWidth = 240,
  onAnchorWidth = undefined
} = defineProps<{
  withInputGroup?: boolean
  inputWidth?: number
  triggerWidth?: number
  inputGroupWidth?: number
  onAnchorWidth?: (width: number) => void
}>()

function sideOffset(data: { anchor: { width: number; height: number } }) {
  onAnchorWidth?.(data.anchor.width)
  return 0
}
</script>

<template>
  <Combobox.Root open>
    <Combobox.InputGroup
      v-if="withInputGroup"
      data-testid="group"
      :style="`width: ${inputGroupWidth}px;`"
    >
      <Combobox.Input data-testid="input" :style="`width: ${inputWidth}px;`" />
      <Combobox.Trigger data-testid="trigger">Open</Combobox.Trigger>
    </Combobox.InputGroup>
    <template v-else>
      <Combobox.Input data-testid="input" :style="`width: ${inputWidth}px;`" />
      <Combobox.Trigger data-testid="trigger" :style="`width: ${triggerWidth}px;`">
        Open
      </Combobox.Trigger>
    </template>
    <Combobox.Portal>
      <Combobox.Positioner data-testid="positioner" :side-offset="sideOffset">
        <Combobox.Popup data-testid="popup">
          <Combobox.List data-testid="list">
            <Combobox.Item value="One">One</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
