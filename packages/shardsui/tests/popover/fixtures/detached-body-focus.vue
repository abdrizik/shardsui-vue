<script setup lang="ts">
import { shallowRef } from 'vue'
import { Popover } from '@/components/popover'

const open = shallowRef(false)
const activeTrigger = shallowRef<string | null>(null)
</script>

<template>
  <Popover.Root v-model:open="open" v-model:trigger-id="activeTrigger">
    <Popover.Trigger :payload="1" id="trigger-1" data-testid="trigger-1">Trigger 1</Popover.Trigger>
    <Popover.Trigger :payload="2" id="trigger-2" data-testid="trigger-2">Trigger 2</Popover.Trigger>

    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup>
          <span data-testid="content">Content</span>
          <Popover.Close data-testid="close">Close</Popover.Close>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>

  <button
    type="button"
    data-testid="open-trigger-2"
    @mousedown.prevent
    @click="
      () => {
        open = true
        activeTrigger = 'trigger-2'
      }
    "
  >
    Open Trigger 2 without focus
  </button>
</template>
