<script setup lang="ts">
import { shallowRef } from 'vue'
import { Popover } from '@/components/popover'

const hidden = shallowRef(false)
</script>

<template>
  <Popover.Root open>
    <Popover.Trigger data-testid="trigger">Toggle</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner data-testid="positioner">
        <Popover.Popup data-testid="popup">
          <button
            type="button"
            data-testid="hide-button"
            :style="{ display: hidden ? 'none' : undefined }"
            @click="hidden = true"
          >
            Hide
          </button>
          <input />
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>
