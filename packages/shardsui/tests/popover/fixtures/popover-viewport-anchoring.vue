<script setup lang="ts">
import { DirectionProvider } from '@/components/direction-provider'
import { Popover } from '@/components/popover'
import type { Side } from '@/internal/floating/anchor-positioning'

const { side = 'bottom', direction = 'ltr' } = defineProps<{
  side?: Side
  direction?: 'ltr' | 'rtl'
}>()
</script>

<template>
  <DirectionProvider :direction="direction">
    <Popover.Root open>
      <Popover.Trigger data-testid="trigger">Trigger</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner :side="side" :collision-avoidance="{ side: 'none' }">
          <Popover.Popup data-testid="popup">
            <Popover.Viewport>Content</Popover.Viewport>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  </DirectionProvider>
</template>
