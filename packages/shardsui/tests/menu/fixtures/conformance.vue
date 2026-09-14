<script setup lang="ts">
import { Menu } from '@/components/menu'
import { useOpen } from '../../dialog/fixtures/use-open'

const { open: openProp = undefined, popupId } = defineProps<{
  open?: boolean
  popupId?: string
}>()

const open = useOpen(() => openProp)
</script>

<template>
  <Menu.Root v-model:open="open">
    <Menu.Trigger data-testid="trigger">Open menu</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup :id="popupId" data-testid="popup">
          <Menu.Item>Item</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
