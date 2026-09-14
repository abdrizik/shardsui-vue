<script setup lang="ts">
import { Menu } from '@/components/menu'

const { onItemClick } = defineProps<{ onItemClick?: () => void }>()
</script>

<template>
  <Menu.Root open>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup data-testid="menu">
          <Menu.Item @click="() => onItemClick?.()">Item One</Menu.Item>
          <Menu.Item @click="() => onItemClick?.()">Item Two</Menu.Item>
          <Menu.Item @click="() => onItemClick?.()">Item Three</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
