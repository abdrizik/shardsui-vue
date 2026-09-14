<script setup lang="ts">
import { shallowRef } from 'vue'
import { Popover } from '@/components/popover'

const showButton = shallowRef(true)
</script>

<template>
  <Popover.Root open modal="trap-focus">
    <Popover.Trigger data-testid="trigger">Toggle</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner data-testid="positioner">
        <Popover.Popup data-testid="popover-popup">
          <button
            v-if="showButton"
            type="button"
            data-testid="remove"
            @pointerdown="showButton = false"
          >
            Remove on pointer down
          </button>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>
