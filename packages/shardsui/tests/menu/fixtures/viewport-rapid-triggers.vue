<script setup lang="ts">
import { Menu } from '@/components/menu'

const handle = Menu.createHandle<number>()
</script>

<template>
  <div>
    <Menu.Trigger :handle="handle" id="trigger1" :payload="1" data-testid="trigger1">
      Trigger 1
    </Menu.Trigger>
    <Menu.Trigger :handle="handle" id="trigger2" :payload="2" data-testid="trigger2">
      Trigger 2
    </Menu.Trigger>
    <Menu.Trigger :handle="handle" id="trigger3" :payload="3" data-testid="trigger3">
      Trigger 3
    </Menu.Trigger>

    <Menu.Root v-slot="{ payload }" :handle="handle">
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup data-testid="popup">
            <Menu.Viewport>Content {{ payload }}</Menu.Viewport>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </div>
</template>
