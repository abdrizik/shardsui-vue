<script setup lang="ts">
import { Menu } from '@/components/menu'

const { as = 'span' } = defineProps<{ as?: 'button' | 'span' }>()
</script>

<template>
  <Menu.Root>
    <Menu.Trigger :as="as">Open</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup data-testid="menu">
          <Menu.Item>1</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
