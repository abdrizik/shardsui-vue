<script setup lang="ts">
import { shallowRef } from 'vue'
import { Popover } from '@/components/popover'
import type { PopoverHandle } from '@/components/popover/handle'

const { handle } = defineProps<{ handle: PopoverHandle }>()

const key = shallowRef(1)
const showExtraTrigger = shallowRef(true)
</script>

<template>
  <button
    type="button"
    data-testid="toggle"
    @click="
      () => {
        showExtraTrigger = !showExtraTrigger
        key += 1
      }
    "
  >
    Toggle
  </button>

  <div :key="key">
    <div
      style="
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 48px;
        margin: 50px;
      "
    >
      <Popover.Trigger :handle="handle" id="trigger-0" data-testid="trigger-0"
        >Trigger 0</Popover.Trigger
      >
      <Popover.Trigger
        v-if="showExtraTrigger"
        :handle="handle"
        id="trigger-1"
        data-testid="trigger-1"
      >
        Trigger 1
      </Popover.Trigger>
    </div>

    <Popover.Root :handle="handle" trigger-id="trigger-0" open>
      <Popover.Portal>
        <Popover.Positioner data-testid="positioner" :side-offset="4" align="start">
          <Popover.Popup data-testid="popup">Content</Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  </div>
</template>
