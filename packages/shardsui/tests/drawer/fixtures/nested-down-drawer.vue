<script setup lang="ts">
import { Drawer } from '@/components/drawer'
</script>

<template>
  <Drawer.Root open swipe-direction="down">
    <Drawer.Portal>
      <Drawer.Viewport data-testid="parent-viewport">
        <Drawer.Popup data-testid="parent-popup">
          <Drawer.Root open swipe-direction="down">
            <Drawer.Portal>
              <Drawer.Viewport data-testid="child-viewport">
                <Drawer.Popup data-testid="child-popup">
                  <button type="button" data-testid="child-button">Action</button>
                </Drawer.Popup>
              </Drawer.Viewport>
            </Drawer.Portal>
          </Drawer.Root>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>
