<script setup lang="ts">
import { Menu } from '@/components/menu'

const { onClick } = defineProps<{ onClick?: (event: MouseEvent) => void }>()
</script>

<template>
  <Menu.Root :open="true">
    <Menu.Trigger>Toggle</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup data-testid="menu">
          <Menu.LinkItem href="#one" @click="(event) => onClick?.(event)">Item One</Menu.LinkItem>
          <Menu.LinkItem href="#two" @click="(event) => onClick?.(event)">Item Two</Menu.LinkItem>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
