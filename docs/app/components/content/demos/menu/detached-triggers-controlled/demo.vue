<script setup lang="ts">
import { shallowRef } from 'vue'
import { Menu } from '@shardsui/vue/menu'

const MENUS = {
  file: ['Rename', 'Archive'],
  edit: ['Add note', 'Bookmark'],
  view: ['Grid', 'List']
}

type MenuKey = keyof typeof MENUS

const demoMenu = Menu.createHandle<MenuKey>()

const triggers: { id: string; payload: MenuKey; label: string }[] = [
  { id: 'menu-file', payload: 'file', label: 'File' },
  { id: 'menu-edit', payload: 'edit', label: 'Edit' },
  { id: 'menu-view', payload: 'view', label: 'View' }
]

const open = shallowRef(false)
const triggerId = shallowRef<string | null>(null)

function openViewMenu() {
  triggerId.value = 'menu-view'
  open.value = true
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <Menu.Trigger
      v-for="trigger in triggers"
      :key="trigger.id"
      :handle="demoMenu"
      :payload="trigger.payload"
      :id="trigger.id"
      class="flex h-8 items-center justify-center rounded-md px-3 text-sm font-normal text-gray-900 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-gray-950 active:bg-gray-100 data-popup-open:bg-gray-100"
    >
      {{ trigger.label }}
    </Menu.Trigger>

    <button
      type="button"
      class="flex h-8 items-center justify-center rounded-md px-3 text-sm font-normal text-gray-900 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-gray-950 active:bg-gray-100"
      @click="openViewMenu"
    >
      Open View menu
    </button>
  </div>

  <Menu.Root
    v-slot="{ payload }"
    v-model:open="open"
    v-model:trigger-id="triggerId"
    :handle="demoMenu"
  >
    <Menu.Portal>
      <Menu.Positioner :side-offset="8" class="outline-hidden">
        <Menu.Popup
          class="origin-(--transform-origin) rounded-md bg-gray-50 py-1 text-gray-900 shadow-lg outline-1 outline-gray-200 transition-[transform,scale,opacity] duration-100 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0"
        >
          <template v-if="payload">
            <Menu.Item
              v-for="item in MENUS[payload]"
              :key="item"
              class="flex py-2 pr-8 pl-4 text-sm/4 outline-hidden select-none data-highlighted:relative data-highlighted:z-0 data-highlighted:text-gray-50 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-gray-900"
              >{{ item }}</Menu.Item
            >
          </template>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
