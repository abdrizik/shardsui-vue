<script setup lang="ts">
import { shallowRef } from 'vue'
import { Tooltip } from '@/components/tooltip'

const open = shallowRef(false)
</script>

<template>
  <Tooltip.Provider :delay="0">
    <Tooltip.Root
      :open="open"
      @update:open="
        (next) => {
          if (!next) open = false
        }
      "
    >
      <Tooltip.Trigger data-testid="trigger">Hover me</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner data-testid="positioner">
          <Tooltip.Popup data-testid="popup">Tooltip content</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
</template>
