<script setup lang="ts">
import { Popover } from '@/components/popover'
import { useOpen } from '../../dialog/fixtures/use-open'

const { open: openProp = undefined, popupId } = defineProps<{ open?: boolean; popupId?: string }>()

const open = useOpen(() => openProp)
</script>

<template>
  <Popover.Root v-model:open="open">
    <Popover.Trigger data-testid="trigger">Toggle</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup :id="popupId" data-testid="popup">Content</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>
