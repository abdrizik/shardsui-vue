<script setup lang="ts">
import { shallowRef } from 'vue'
import { Menu } from '@/components/menu'
import { Menubar } from '@/components/menubar'

const open = shallowRef(true)
</script>

<template>
  <button data-testid="outside" type="button">Outside</button>
  <Menubar>
    <Menu.Root v-model:open="open">
      <Menu.Portal keep-mounted>
        <Menu.Positioner>
          <Menu.Popup data-testid="triggerless-menu">
            <Menu.Item>Item</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </Menubar>
</template>
