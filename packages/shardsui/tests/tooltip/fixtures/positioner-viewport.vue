<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'

const { withViewport = false } = defineProps<{ withViewport?: boolean }>()
</script>

<template>
  <Tooltip.Root open>
    <Tooltip.Trigger as="div" style="width: 72px; height: 36px">Trigger</Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Positioner data-testid="positioner">
        <Tooltip.Popup style="width: 52px; height: 24px">
          <Tooltip.Viewport v-if="withViewport">Popup</Tooltip.Viewport>
          <template v-else>Popup</template>
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
</template>
