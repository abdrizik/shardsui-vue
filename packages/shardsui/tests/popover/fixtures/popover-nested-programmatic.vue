<script setup lang="ts">
import { shallowRef } from 'vue'
import { Popover } from '@/components/popover'

const childOpen = shallowRef(false)
</script>

<template>
  <Popover.Root>
    <Popover.Trigger data-testid="parent-trigger">Parent trigger</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup data-testid="parent-popup">
          <button type="button" data-testid="child-opener" @click="childOpen = true">
            Open child programmatically
          </button>

          <Popover.Root v-model:open="childOpen" trigger-id="child-reference">
            <Popover.Trigger id="child-reference" data-testid="child-trigger">
              Child reference
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Positioner>
                <Popover.Popup data-testid="child-popup">
                  <Popover.Close data-testid="close-child">Close child</Popover.Close>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>

          <Popover.Close data-testid="close-parent">Close parent</Popover.Close>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>
