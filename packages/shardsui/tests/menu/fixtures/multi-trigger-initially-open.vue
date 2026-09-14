<script setup lang="ts">
import { Menu } from '@/components/menu'

const { detached = false } = defineProps<{ detached?: boolean }>()

const handle = Menu.createHandle<number>()
</script>

<template>
  <template v-if="detached">
    <Menu.Trigger :handle="handle" :payload="1" id="trigger-1">Trigger 1</Menu.Trigger>
    <Menu.Trigger :handle="handle" :payload="2" id="trigger-2">Trigger 2</Menu.Trigger>
  </template>
  <Menu.Root
    v-slot="{ payload }"
    :handle="detached ? handle : undefined"
    open
    trigger-id="trigger-2"
  >
    <template v-if="!detached">
      <Menu.Trigger :payload="1" id="trigger-1">Trigger 1</Menu.Trigger>
      <Menu.Trigger :payload="2" id="trigger-2">Trigger 2</Menu.Trigger>
    </template>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.Item data-testid="popup-content">{{ payload }}</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
