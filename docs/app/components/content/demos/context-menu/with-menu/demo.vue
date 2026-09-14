<script setup lang="ts">
import { ContextMenu } from '@shardsui/vue/context-menu'
import { Menu } from '@shardsui/vue/menu'

const actions = ['Preview', 'Download', 'Copy link', 'Rename']
</script>

<template>
  <div
    class="group relative w-64 overflow-hidden rounded-md bg-gray-50 text-left text-gray-900 outline-1 outline-gray-200 select-none"
  >
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div class="h-32 w-full bg-linear-to-br from-gray-200 to-gray-400"></div>
        <div class="p-2">
          <p class="text-sm/5">Station Hofplein</p>
          <p class="text-xs/4 text-gray-500">JPG, 2.4 MB</p>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner class="outline-hidden">
          <ContextMenu.Popup
            class="origin-(--transform-origin) rounded-md bg-gray-50 py-1 text-gray-900 shadow-lg outline-1 outline-gray-200 transition-[transform,scale,opacity] duration-100 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0"
          >
            <ContextMenu.Item
              v-for="action in actions"
              :key="action"
              class="flex py-2 pr-8 pl-4 text-sm/4 outline-hidden select-none data-highlighted:relative data-highlighted:z-0 data-highlighted:text-gray-50 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-gray-900"
              >{{ action }}</ContextMenu.Item
            >
            <ContextMenu.Separator class="m-1 h-px bg-gray-200" />
            <ContextMenu.Item
              class="flex py-2 pr-8 pl-4 text-sm/4 text-red-700 outline-hidden select-none data-highlighted:relative data-highlighted:z-0 data-highlighted:text-gray-50 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-gray-900"
              >Delete</ContextMenu.Item
            >
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>

    <Menu.Root>
      <Menu.Trigger
        aria-label="Image actions"
        class="absolute top-2 right-2 flex size-8 items-center justify-center rounded-md bg-gray-50 text-gray-900 opacity-0 outline-1 outline-gray-200 select-none group-hover:opacity-100 hover:bg-gray-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-gray-950 data-popup-open:bg-gray-100 data-popup-open:opacity-100 any-pointer-coarse:opacity-100"
      >
        <svg class="size-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path
            d="M9.5 13c0 .8284-.67157 1.5-1.5 1.5s-1.5-.6716-1.5-1.5.67157-1.5 1.5-1.5 1.5.6716 1.5 1.5m0-5c0 .82843-.67157 1.5-1.5 1.5S6.5 8.82843 6.5 8 7.17157 6.5 8 6.5s1.5.67157 1.5 1.5m0-5c0 .82843-.67157 1.5-1.5 1.5S6.5 3.82843 6.5 3 7.17157 1.5 8 1.5s1.5.67157 1.5 1.5"
          />
        </svg>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner class="outline-hidden" align="end" :side-offset="8">
          <Menu.Popup
            class="origin-(--transform-origin) rounded-md bg-gray-50 py-1 text-gray-900 shadow-lg outline-1 outline-gray-200 transition-[transform,scale,opacity] duration-100 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0"
          >
            <Menu.Item
              v-for="action in actions"
              :key="action"
              class="flex py-2 pr-8 pl-4 text-sm/4 outline-hidden select-none data-highlighted:relative data-highlighted:z-0 data-highlighted:text-gray-50 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-gray-900"
              >{{ action }}</Menu.Item
            >
            <Menu.Separator class="m-1 h-px bg-gray-200" />
            <Menu.Item
              class="flex py-2 pr-8 pl-4 text-sm/4 text-red-700 outline-hidden select-none data-highlighted:relative data-highlighted:z-0 data-highlighted:text-gray-50 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-gray-900"
              >Delete</Menu.Item
            >
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </div>
</template>
