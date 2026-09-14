<script setup lang="ts">
import { shallowRef } from 'vue'
import { Menu } from '@/components/menu'
import type { MenuHandle } from '@/components/menu/handle'

const { handle: handleProp } = defineProps<{ handle?: MenuHandle }>()

const handle = handleProp ?? Menu.createHandle()

const open = shallowRef(false)

function setOpen(next: boolean) {
  if (next) open.value = true
}
</script>

<template>
  <div>
    <Menu.Root :handle="handle" :open="open" @update:open="setOpen">
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Item>Item</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
    <button type="button">Outside</button>
  </div>
</template>
