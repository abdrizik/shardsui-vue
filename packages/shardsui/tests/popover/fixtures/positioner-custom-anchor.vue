<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { Popover } from '@/components/popover'

const anchor = useTemplateRef<HTMLElement>('anchor')
</script>

<template>
  <Popover.Root open>
    <Popover.Trigger as="div" data-testid="trigger" style="width: 100px; height: 100px">
      Trigger
    </Popover.Trigger>
    <div
      ref="anchor"
      data-testid="custom-anchor"
      style="width: 50px; height: 50px; position: relative"
    >
      Anchor
    </div>
    <Popover.Portal keep-mounted>
      <Popover.Positioner data-testid="positioner" :anchor="anchor">
        <Popover.Popup style="width: 100px; height: 100px">Popup</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>
