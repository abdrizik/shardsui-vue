<script setup lang="ts">
import { shallowRef } from 'vue'
import { Popover } from '@/components/popover'
import type { PopoverHandle } from '@/components/popover/handle'

const { handle, detached = false } = defineProps<{
  handle?: PopoverHandle<number>
  detached?: boolean
}>()

const open = shallowRef(false)
const triggerId = shallowRef<string | null>(null)

function openWith(id: string) {
  triggerId.value = id
  open.value = true
}
</script>

<template>
  <div style="margin: 50px">
    <template v-if="detached">
      <Popover.Trigger :handle="handle" id="trigger-1" :payload="1" data-testid="trigger-1">
        Trigger 1
      </Popover.Trigger>
      <Popover.Trigger :handle="handle" id="trigger-2" :payload="2" data-testid="trigger-2">
        Trigger 2
      </Popover.Trigger>
    </template>
    <Popover.Root v-slot="{ payload }" v-model:open="open" :handle="handle" :trigger-id="triggerId">
      <template v-if="!detached">
        <Popover.Trigger :handle="handle" id="trigger-1" :payload="1" data-testid="trigger-1">
          Trigger 1
        </Popover.Trigger>
        <Popover.Trigger :handle="handle" id="trigger-2" :payload="2" data-testid="trigger-2">
          Trigger 2
        </Popover.Trigger>
      </template>
      <Popover.Portal>
        <Popover.Positioner data-testid="positioner" side="bottom" align="start">
          <Popover.Popup data-testid="popup">
            <span data-testid="content">{{ payload }}</span>
            <Popover.Close data-testid="close">Close</Popover.Close>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
    <button type="button" data-testid="open-1" @click="openWith('trigger-1')">
      Open Trigger 1
    </button>
    <button type="button" data-testid="open-2" @click="openWith('trigger-2')">
      Open Trigger 2
    </button>
  </div>
</template>
