<script setup lang="ts">
import { Popover } from '@/components/popover'

const { triggerPlacement = 'before-content' } = defineProps<{
  triggerPlacement?: 'before-content' | 'after-content'
}>()
</script>

<template>
  <div>
    <input data-testid="before" />
    <Popover.Root open>
      <template v-if="triggerPlacement === 'before-content'">
        <Popover.Trigger data-testid="trigger">Toggle</Popover.Trigger>
        <input data-testid="focus-target" />
      </template>
      <Popover.Portal>
        <Popover.Positioner data-testid="positioner">
          <Popover.Popup data-testid="popover-popup">
            <input data-testid="input-inside" />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
      <template v-if="triggerPlacement === 'after-content'">
        <Popover.Trigger data-testid="trigger">Toggle</Popover.Trigger>
        <input data-testid="focus-target" />
      </template>
    </Popover.Root>
    <input data-testid="after" />
  </div>
</template>
