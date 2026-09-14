<script setup lang="ts">
import { Menu } from '@/components/menu'
import type { MenuHandle } from '@/components/menu/handle'

const { handle = Menu.createHandle<number>(), triggerId } = defineProps<{
  handle?: MenuHandle<number>
  triggerId?: string | null
}>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <div>
    <Menu.Trigger :handle="handle" id="trigger-1" :payload="1">Trigger 1</Menu.Trigger>
    <Menu.Trigger :handle="handle" id="trigger-2" :payload="2">Trigger 2</Menu.Trigger>

    <Menu.Root v-slot="{ payload }" v-model:open="open" :handle="handle" :trigger-id="triggerId">
      <Menu.Portal>
        <Menu.Positioner data-testid="positioner">
          <Menu.Popup data-testid="popup">
            <Menu.Item data-testid="content">{{ payload }}</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </div>
</template>
