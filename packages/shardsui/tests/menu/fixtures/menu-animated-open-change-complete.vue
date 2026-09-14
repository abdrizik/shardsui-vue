<script setup lang="ts">
import { Menu } from '@/components/menu'

const { onOpenChangeComplete } = defineProps<{
  onOpenChangeComplete?: (open: boolean) => void
}>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <button type="button" data-testid="open-external" @click="open = true">Open</button>
  <button type="button" data-testid="close-external" @click="open = false">Close</button>

  <Menu.Root v-model:open="open" @open-change-complete="onOpenChangeComplete">
    <Menu.Trigger>Toggle</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup data-testid="menu" class="menu-animation-test-indicator">
          <Menu.Item data-testid="item-1">Item 1</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

<style>
@keyframes menu-complete-enter {
  from {
    opacity: 0;
  }
}

@keyframes menu-complete-exit {
  to {
    opacity: 0;
  }
}

.menu-animation-test-indicator[data-starting-style] {
  animation: menu-complete-enter 1ms;
}

.menu-animation-test-indicator[data-ending-style] {
  animation: menu-complete-exit 1ms;
}
</style>
