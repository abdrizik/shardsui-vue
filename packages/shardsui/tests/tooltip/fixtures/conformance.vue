<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'
import { useOpen } from '../../dialog/fixtures/use-open'

const { open: openProp = undefined, popupId } = defineProps<{ open?: boolean; popupId?: string }>()

const open = useOpen(() => openProp)
</script>

<template>
  <Tooltip.Provider :delay="0">
    <Tooltip.Root v-model:open="open">
      <Tooltip.Trigger data-testid="trigger">Hover me</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner>
          <Tooltip.Popup :id="popupId" data-testid="popup">Tooltip content</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
</template>
