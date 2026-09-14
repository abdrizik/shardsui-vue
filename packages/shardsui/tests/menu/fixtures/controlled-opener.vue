<script setup lang="ts">
import { shallowRef } from 'vue'
import { Menu } from '@/components/menu'

const open = shallowRef(false)
</script>

<template>
  <div>
    <button type="button" @click="open = true">Open menu programmatically</button>
    <Menu.Root v-model:open="open" trigger-id="menu-trigger">
      <Menu.Trigger id="menu-trigger">Menu trigger</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Item>Close menu</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </div>
</template>
