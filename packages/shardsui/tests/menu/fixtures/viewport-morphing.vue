<script setup lang="ts">
import { Menu } from '@/components/menu'

const handle = Menu.createHandle<number>()
</script>

<template>
  <div>
    <Menu.Trigger :handle="handle" id="trigger1" :payload="0" data-testid="trigger1">
      Trigger 1
    </Menu.Trigger>
    <Menu.Trigger :handle="handle" id="trigger2" :payload="1" data-testid="trigger2">
      Trigger 2
    </Menu.Trigger>

    <Menu.Root v-slot="{ payload }" :handle="handle">
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Viewport>
              <div data-testid="content">Content {{ payload }}</div>
            </Menu.Viewport>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </div>
</template>

<style>
@keyframes viewport-slide-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-30%);
    opacity: 0;
  }
}

@keyframes viewport-slide-in {
  from {
    transform: translateX(30%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

[data-transitioning] [data-previous] {
  animation: viewport-slide-out 0.3s ease-out forwards;
}

[data-transitioning] [data-current] {
  animation: viewport-slide-in 0.3s ease-out forwards;
}
</style>
