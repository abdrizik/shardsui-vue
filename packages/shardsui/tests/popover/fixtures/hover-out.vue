<script setup lang="ts">
import { Popover } from '@/components/popover'

const {
  external = false,
  openOnHover = true,
  delay
} = defineProps<{
  external?: boolean
  openOnHover?: boolean
  delay?: number
}>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <button v-if="external" type="button" data-testid="show" @click="open = true">Show</button>
  <Popover.Root v-model:open="open">
    <Popover.Trigger data-testid="trigger" :open-on-hover="openOnHover" :delay="delay">
      Toggle
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner data-testid="positioner">
        <Popover.Popup data-testid="popover-popup">Content</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>
