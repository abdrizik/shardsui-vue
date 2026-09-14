<script setup lang="ts">
import { Menu } from '@/components/menu'

const { onOpenChangeComplete } = defineProps<{
  onOpenChangeComplete?: (open: boolean) => void
}>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Menu.Root v-model:open="open" @open-change-complete="onOpenChangeComplete">
    <Menu.Trigger>Toggle</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup data-testid="menu">
          <Menu.Item data-testid="item-1">Item 1</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
