<script setup lang="ts">
import { shallowRef } from 'vue'
import { Drawer } from '@/components/drawer'

const childOpen = shallowRef(true)
</script>

<template>
  <Drawer.Root open :modal="false">
    <Drawer.Portal>
      <Drawer.Viewport>
        <Drawer.Popup data-testid="parent-popup">
          <Drawer.Root v-model:open="childOpen" :modal="false">
            <Drawer.Portal>
              <Drawer.Viewport>
                <Drawer.Popup class="animation-test-child-popup" data-testid="child-popup">
                  <Drawer.Close>Close nested drawer</Drawer.Close>
                </Drawer.Popup>
              </Drawer.Viewport>
            </Drawer.Portal>
          </Drawer.Root>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>

<style>
@keyframes test-drawer-exit {
  to {
    opacity: 0;
  }
}
.animation-test-child-popup[data-ending-style] {
  animation: test-drawer-exit 100ms;
}
</style>
