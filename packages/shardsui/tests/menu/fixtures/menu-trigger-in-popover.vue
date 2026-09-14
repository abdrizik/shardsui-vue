<script setup lang="ts">
import { Menu } from '@/components/menu'
import { Popover } from '@/components/popover'

const { as = 'button' } = defineProps<{ as?: 'button' | 'span' }>()
</script>

<template>
  <Popover.Root :open="true">
    <Popover.Trigger>Open</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup>
          <Menu.Root>
            <Menu.Trigger :as="as" data-testid="menu-trigger">Menu</Menu.Trigger>
          </Menu.Root>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>
