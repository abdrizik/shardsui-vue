<script setup lang="ts">
import { Menu } from '@/components/menu'
import { Menubar } from '@/components/menubar'

const { width = 'calc(100vw - 10px)' } = defineProps<{ width?: string }>()
</script>

<template>
  <Menubar modal style="display: flex">
    <Menu.Root>
      <Menu.Trigger data-testid="file-trigger">File</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner data-testid="file-menu" :style="{ width }">
          <Menu.Popup>
            <Menu.Item>Open</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </Menubar>
</template>
