<script setup lang="ts">
import { Popover } from '@/components/popover'

const {
  open = true,
  modal = true,
  includeClose = true
} = defineProps<{
  open?: boolean
  modal?: boolean | 'trap-focus'
  includeClose?: boolean
}>()
</script>

<template>
  <div>
    <button data-testid="outside">Outside</button>
    <Popover.Root :open="open" :modal="modal">
      <Popover.Trigger data-testid="trigger">Trigger</Popover.Trigger>
      <input data-testid="focus-target" />
      <Popover.Portal>
        <Popover.Positioner data-testid="positioner">
          <Popover.Popup data-testid="popover-popup">
            <Popover.Close v-if="includeClose" data-testid="close" aria-label="Close popover" />
            <input v-else data-testid="input-inside" />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  </div>
</template>
