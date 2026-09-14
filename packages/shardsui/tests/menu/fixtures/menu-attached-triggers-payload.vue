<script setup lang="ts">
import { Menu } from '@/components/menu'
</script>

<template>
  <Menu.Root v-slot="{ payload }">
    <Menu.Trigger payload="first" data-testid="trigger1">Trigger 1</Menu.Trigger>
    <Menu.Trigger payload="second" data-testid="trigger2">Trigger 2</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          <div data-testid="payload">{{ payload ?? '' }}</div>
          <Menu.Item>Item</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
