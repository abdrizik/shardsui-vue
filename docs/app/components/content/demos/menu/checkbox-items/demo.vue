<script setup lang="ts">
import { ref } from 'vue'
import { Menu } from '@shardsui/vue/menu'

const columns = ref([
  { label: 'Status', checked: true },
  { label: 'Owner', checked: true },
  { label: 'Duration', checked: false }
])
</script>

<template>
  <Menu.Root>
    <Menu.Trigger
      class="flex h-8 items-center justify-center gap-1.5 rounded-md pr-2 pl-3 text-sm font-normal text-gray-900 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-gray-950 active:bg-gray-100 data-popup-open:bg-gray-100"
    >
      Columns
      <svg class="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5.75 9.5L12 15.75L18.25 9.5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner class="outline-hidden" :side-offset="8">
        <Menu.Popup
          class="origin-(--transform-origin) rounded-md bg-gray-50 py-1 text-gray-900 shadow-lg outline-1 outline-gray-200 transition-[transform,scale,opacity] duration-100 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0"
        >
          <Menu.CheckboxItem
            v-for="column in columns"
            :key="column.label"
            v-model:checked="column.checked"
            class="grid grid-cols-[1rem_1fr] items-center gap-2 py-2 pr-8 pl-2.5 text-sm/4 outline-hidden select-none data-highlighted:relative data-highlighted:z-0 data-highlighted:text-gray-50 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-gray-900"
          >
            <Menu.CheckboxItemIndicator class="col-start-1">
              <svg class="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 14.15L10.0321 18L18 7"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Menu.CheckboxItemIndicator>
            <span class="col-start-2">{{ column.label }}</span>
          </Menu.CheckboxItem>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
