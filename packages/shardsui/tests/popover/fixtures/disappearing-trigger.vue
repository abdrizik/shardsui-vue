<script setup lang="ts">
import { shallowRef } from 'vue'
import { Popover } from '@/components/popover'

const open = shallowRef(false)
const showTrigger = shallowRef(true)

function handleOpenChange(nextOpen: boolean) {
  if (nextOpen) {
    showTrigger.value = false
  }
  open.value = nextOpen
}
</script>

<template>
  <div>
    <button type="button" data-testid="fallback">Focus fallback</button>

    <Popover.Root :open="open" @update:open="handleOpenChange">
      <Popover.Trigger v-if="showTrigger" data-testid="trigger" @mousedown.prevent>
        Disappearing trigger
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup>
            <span data-testid="content">Content</span>
            <Popover.Close data-testid="close">Close</Popover.Close>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  </div>
</template>
