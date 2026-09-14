<script setup lang="ts">
import { Select } from '@shardsui/vue/select'
import { computed, shallowRef } from 'vue'

const topics = [
  { value: 'kerning', label: 'Kerning' },
  { value: 'contrast', label: 'Contrast ratio' },
  { value: 'flexbox', label: 'Flexbox' },
  { value: 'easing', label: 'Easing' }
]

const value = shallowRef(['kerning', 'contrast'])

const label = computed(() => topics.find((topic) => topic.value === value.value[0])?.label)
</script>

<template>
  <div class="flex flex-col gap-1">
    <Select.Root multiple v-model:value="value" :items="topics">
      <Select.Label class="text-sm/5 font-semibold text-gray-900">Topics</Select.Label>
      <Select.Trigger
        class="flex h-8 min-w-56 items-center justify-between gap-3 rounded-md border border-gray-200 bg-gray-50 pr-2 pl-3 text-sm font-normal text-gray-900 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-gray-950 data-popup-open:bg-gray-100"
      >
        <Select.Value class="data-placeholder:opacity-60">
          <template v-if="value.length === 0">Select topics</template>
          <template v-else>
            {{ label }}{{ value.length > 1 ? ` (+${value.length - 1} more)` : '' }}
          </template>
        </Select.Value>
        <Select.Icon class="flex">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="size-4">
            <path
              d="M8 8.99981L11.1161 5.88369C11.6043 5.39554 12.3957 5.39554 12.8839 5.8837L16 8.99981"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16 15L12.8839 18.1161C12.3957 18.6043 11.6043 18.6043 11.1161 18.1161L8 15"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner class="z-10 outline-hidden select-none" :side-offset="8">
          <Select.Popup
            class="group min-w-(--anchor-width) origin-(--transform-origin) rounded-md bg-gray-50 bg-clip-padding text-gray-900 shadow-lg outline-1 outline-gray-200 transition-[transform,scale,opacity] duration-100 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0"
          >
            <Select.List class="max-h-(--available-height) overflow-y-auto py-1">
              <Select.Item
                v-for="topic in topics"
                :key="topic.value"
                :value="topic.value"
                class="grid grid-cols-[1rem_1fr] items-center gap-2 py-1.5 pr-4 pl-2.5 text-sm/4 outline-hidden select-none data-highlighted:relative data-highlighted:z-0 data-highlighted:text-gray-50 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-gray-900"
              >
                <Select.ItemIndicator class="col-start-1">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="size-4">
                    <path
                      d="M6 14.15L10.0321 18L18 7"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </Select.ItemIndicator>
                <div class="col-start-2">{{ topic.label }}</div>
              </Select.Item>
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  </div>
</template>
