<script setup lang="ts">
import { Menu } from '@/components/menu'
import { Menubar } from '@/components/menubar'

const { orientation = 'horizontal', onSide } = defineProps<{
  orientation?: 'horizontal' | 'vertical'
  onSide: (side: string) => void
}>()
</script>

<template>
  <Menubar :orientation="orientation">
    <Menu.Root :open="true">
      <Menu.Trigger style="margin: 100px">File</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          :side-offset="
            (data) => {
              onSide(data.side)
              return 0
            }
          "
        >
          <Menu.Popup style="width: 50px; height: 50px">Open</Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </Menubar>
</template>
