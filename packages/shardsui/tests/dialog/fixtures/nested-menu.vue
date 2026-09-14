<script setup lang="ts">
import { Menu } from '@/components/menu'
import DialogArrangements from './dialog-arrangements.vue'

const { arrangement = 'contained' } = defineProps<{
  arrangement?: 'contained' | 'detached' | 'multiple-detached'
}>()
</script>

<template>
  <DialogArrangements :arrangement="arrangement">
    <Menu.Root>
      <Menu.Trigger>Open menu</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner data-testid="menu-positioner">
          <Menu.Popup>
            <Menu.Item>Item</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </DialogArrangements>
</template>
