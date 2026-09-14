<script setup lang="ts">
import { Menu } from '@/components/menu'

type Point = { top: number; left: number }

const { trigger1, trigger2 } = defineProps<{ trigger1: Point; trigger2: Point }>()

const handle = Menu.createHandle<number>()
</script>

<template>
  <div>
    <Menu.Trigger
      :handle="handle"
      id="trigger1"
      :payload="0"
      data-testid="trigger1"
      :style="{
        position: 'absolute',
        top: `${trigger1.top}px`,
        left: `${trigger1.left}px`,
        width: '100px',
        height: '50px'
      }"
    >
      Trigger 1
    </Menu.Trigger>
    <Menu.Trigger
      :handle="handle"
      id="trigger2"
      :payload="1"
      data-testid="trigger2"
      :style="{
        position: 'absolute',
        top: `${trigger2.top}px`,
        left: `${trigger2.left}px`,
        width: '100px',
        height: '50px'
      }"
    >
      Trigger 2
    </Menu.Trigger>

    <Menu.Root v-slot="{ payload }" :handle="handle">
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Viewport data-testid="viewport">
              <div data-testid="content">Content {{ payload }}</div>
            </Menu.Viewport>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </div>
</template>

<style>
@keyframes activation-slide-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-30%);
    opacity: 0;
  }
}

@keyframes activation-slide-in {
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
  animation: activation-slide-out 0.2s ease-out forwards;
}

[data-transitioning] [data-current] {
  animation: activation-slide-in 0.2s ease-out forwards;
}
</style>
