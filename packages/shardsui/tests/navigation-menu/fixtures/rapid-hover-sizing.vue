<script setup lang="ts">
import { shallowRef } from 'vue'
import { NavigationMenu } from '@/components/navigation-menu'

const expanded = shallowRef(false)
</script>

<template>
  <NavigationMenu.Root>
    <NavigationMenu.List style="display: flex">
      <NavigationMenu.Item value="product">
        <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <div>
            <button type="button" @click="expanded = true">Expand Product</button>
            <div v-if="expanded" style="width: 760px; height: 460px">Expanded product panel</div>
            <div v-else style="width: 700px; height: 420px">Product panel</div>
          </div>
        </NavigationMenu.Content>
      </NavigationMenu.Item>

      <NavigationMenu.Item value="solutions">
        <NavigationMenu.Trigger>Solutions</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <div style="width: 500px; height: 320px">Solutions panel</div>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu.List>

    <NavigationMenu.Portal>
      <NavigationMenu.Positioner>
        <NavigationMenu.Popup class="rapid-hover-sizing-popup" data-testid="popup-root">
          <NavigationMenu.Viewport />
        </NavigationMenu.Popup>
      </NavigationMenu.Positioner>
    </NavigationMenu.Portal>
  </NavigationMenu.Root>
</template>

<style>
.rapid-hover-sizing-popup {
  transition:
    width 350ms cubic-bezier(0.22, 1, 0.36, 1),
    height 350ms cubic-bezier(0.22, 1, 0.36, 1);
  width: var(--popup-width);
  height: var(--popup-height);
}
</style>
