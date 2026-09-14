<script setup lang="ts">
import { Autocomplete } from '@shardsui/vue/autocomplete'
import { computed, shallowRef, useTemplateRef } from 'vue'

type Item = {
  id: string
  name: string
}

const ROW_HEIGHT = 32
const VISIBLE = 12
const OVERSCAN = 8

const items: Item[] = Array.from({ length: 10_000 }, (_, i) => {
  const id = String(i + 1)
  return { id, name: `Item #${id.padStart(5, '0')}` }
})

const filter = Autocomplete.createFilter()
const value = shallowRef('')

const scrollEl = useTemplateRef<HTMLElement>('scrollEl')
const scrollTop = shallowRef(0)

const filteredItems = computed(() =>
  value.value.trim() === ''
    ? items
    : items.filter((item) => filter.contains(item.name, value.value))
)

const count = computed(() => filteredItems.value.length)
const totalHeight = computed(() => count.value * ROW_HEIGHT)
const start = computed(() => Math.max(0, Math.floor(scrollTop.value / ROW_HEIGHT) - OVERSCAN))
const end = computed(() => Math.min(count.value, start.value + VISIBLE + OVERSCAN * 2))
const offsetTop = computed(() => start.value * ROW_HEIGHT)
const slice = computed(() => filteredItems.value.slice(start.value, end.value))

function scrollHighlightedIntoView(
  item: Item | undefined,
  reason: 'keyboard' | 'pointer' | 'none',
  index: number
) {
  if (reason === 'pointer') return
  const element = scrollEl.value
  if (!item || !element) return
  const top = index * ROW_HEIGHT
  const bottom = top + ROW_HEIGHT
  if (top < element.scrollTop) {
    element.scrollTop = top
  } else if (bottom > element.scrollTop + element.clientHeight) {
    element.scrollTop = bottom - element.clientHeight
  }
}

function onScroll(event: Event) {
  if (event.target instanceof HTMLElement) scrollTop.value = event.target.scrollTop
}
</script>

<template>
  <Autocomplete.Root
    virtualized
    v-model:value="value"
    :filtered-items="filteredItems"
    :filter="null"
    :item-to-string-value="(item: Item) => item.name"
    @item-highlighted="scrollHighlightedIntoView"
  >
    <label class="flex flex-col gap-1 text-sm/5 font-semibold text-gray-900">
      Search 10,000 items
      <Autocomplete.Input
        placeholder="Type to filter…"
        class="h-8 w-64 rounded-md border border-gray-200 bg-gray-50 px-2 text-sm font-normal text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-gray-950 any-pointer-coarse:text-base"
      />
    </label>

    <Autocomplete.Portal>
      <Autocomplete.Positioner class="outline-hidden" :side-offset="4">
        <Autocomplete.Popup
          class="max-h-[min(22.5rem,var(--available-height))] w-(--anchor-width) max-w-(--available-width) rounded-md bg-gray-50 text-gray-900 shadow-lg outline-1 outline-gray-200"
        >
          <Autocomplete.Empty>
            <div class="px-2 py-3 text-sm/4 text-gray-600">No results found.</div>
          </Autocomplete.Empty>
          <Autocomplete.List class="p-0">
            <div
              ref="scrollEl"
              role="presentation"
              class="h-[min(22.5rem,var(--total-size))] max-h-(--available-height) overflow-auto overscroll-contain"
              :style="{ '--total-size': `${totalHeight}px` }"
              @scroll="onScroll"
            >
              <div
                role="presentation"
                class="relative w-full"
                :style="{ height: `${totalHeight}px` }"
              >
                <div
                  role="presentation"
                  class="absolute inset-x-0"
                  :style="{ top: `${offsetTop}px` }"
                >
                  <Autocomplete.Item
                    v-for="(item, i) in slice"
                    :key="item.id"
                    :index="start + i"
                    :value="item"
                    :aria-setsize="count"
                    :aria-posinset="start + i + 1"
                    class="flex py-2 pr-2 pl-2.5 text-sm/4 outline-hidden select-none data-highlighted:relative data-highlighted:z-0 data-highlighted:text-gray-50 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-gray-900"
                    :style="{ height: `${ROW_HEIGHT}px` }"
                  >
                    {{ item.name }}
                  </Autocomplete.Item>
                </div>
              </div>
            </div>
          </Autocomplete.List>
        </Autocomplete.Popup>
      </Autocomplete.Positioner>
    </Autocomplete.Portal>
  </Autocomplete.Root>
</template>
