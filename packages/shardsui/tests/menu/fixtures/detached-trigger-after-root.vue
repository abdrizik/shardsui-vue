<script setup lang="ts">
import { Menu } from '@/components/menu'
import type { MenuHandle } from '@/components/menu/handle'

const { handle = Menu.createHandle() } = defineProps<{
  handle?: MenuHandle
}>()
</script>

<template>
  <div>
    <Menu.Root :handle="handle">
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Item>Menu Content</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
    <Menu.Trigger :handle="handle" id="trigger">Trigger</Menu.Trigger>
  </div>
</template>
