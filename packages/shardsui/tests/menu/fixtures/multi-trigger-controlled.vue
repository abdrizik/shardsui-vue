<script setup lang="ts">
import { shallowRef } from 'vue'
import { Menu } from '@/components/menu'

const { detached = false } = defineProps<{ detached?: boolean }>()

const handle = Menu.createHandle<number>()

const open = shallowRef(false)
const triggerId = shallowRef<string | null>(null)

function openWith(id: string) {
  triggerId.value = id
  open.value = true
}
</script>

<template>
  <div>
    <template v-if="detached">
      <Menu.Trigger :handle="handle" :payload="1" id="trigger-1">Trigger 1</Menu.Trigger>
      <Menu.Trigger :handle="handle" :payload="2" id="trigger-2">Trigger 2</Menu.Trigger>
    </template>
    <Menu.Root
      v-slot="{ payload }"
      v-model:open="open"
      :handle="detached ? handle : undefined"
      :trigger-id="triggerId"
    >
      <template v-if="!detached">
        <Menu.Trigger :payload="1" id="trigger-1">Trigger 1</Menu.Trigger>
        <Menu.Trigger :payload="2" id="trigger-2">Trigger 2</Menu.Trigger>
      </template>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Item data-testid="content">{{ payload }}</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
    <button @click="openWith('trigger-1')">Open Trigger 1</button>
    <button @click="openWith('trigger-2')">Open Trigger 2</button>
    <button @click="open = false">Close</button>
  </div>
</template>
