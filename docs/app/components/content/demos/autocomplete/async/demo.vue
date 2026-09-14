<script setup lang="ts">
import { Autocomplete } from '@shardsui/vue/autocomplete'
import { computed, shallowRef } from 'vue'

type Page = {
  title: string
  section: string
}

const pages: Page[] = [
  { title: 'Kerning and tracking', section: 'Typography' },
  { title: 'Building a color ramp', section: 'Color' },
  { title: 'Grid vs. flexbox', section: 'Layout' },
  { title: 'Focus states and keyboard nav', section: 'Accessibility' },
  { title: 'Naming design tokens', section: 'Tokens' },
  { title: 'Easing and duration', section: 'Motion' },
  { title: 'Fluid typography', section: 'Responsive' },
  { title: 'Color scales', section: 'Data viz' },
  { title: 'ARIA in practice', section: 'Accessibility' },
  { title: 'Skeleton loading states', section: 'Performance' }
]

const filter = Autocomplete.createFilter()

async function searchPages(query: string): Promise<{ pages: Page[]; error: string | null }> {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 400 + 200))
  if (query === 'error') {
    return { pages: [], error: 'Could not reach the server. Please try again.' }
  }
  return {
    pages: pages.filter(
      (page) => filter.contains(page.title, query) || filter.contains(page.section, query)
    ),
    error: null
  }
}

const value = shallowRef('')
const results = shallowRef<Page[]>([])
const error = shallowRef<string | null>(null)
const pending = shallowRef(false)

let requestId = 0

async function search(query: string) {
  const id = ++requestId

  if (!query) {
    results.value = []
    error.value = null
    pending.value = false
    return
  }

  pending.value = true
  error.value = null

  const result = await searchPages(query)
  if (id !== requestId) return

  results.value = result.pages
  error.value = result.error
  pending.value = false
}

const status = computed(() => {
  if (error.value) return error.value
  if (!value.value) return null
  if (results.value.length === 0) return `No results match "${value.value}".`
  return `${results.value.length} ${results.value.length === 1 ? 'result' : 'results'} found`
})
</script>

<template>
  <Autocomplete.Root
    :items="results"
    :filter="null"
    :item-to-string-value="(page: Page) => page.title"
    v-model:value="value"
    @update:value="search"
  >
    <label class="flex flex-col gap-1 text-sm/5 font-semibold text-gray-900">
      Search pages
      <Autocomplete.Input
        placeholder="e.g. Kerning"
        class="h-8 w-64 rounded-md border border-gray-200 bg-gray-50 px-2 text-sm font-normal text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-gray-950 any-pointer-coarse:text-base"
      />
    </label>

    <Autocomplete.Portal>
      <Autocomplete.Positioner class="outline-hidden" :side-offset="4" align="start">
        <Autocomplete.Popup
          :aria-busy="pending || undefined"
          class="max-h-[min(var(--available-height),22.5rem)] w-(--anchor-width) max-w-(--available-width) scroll-py-1 overflow-y-auto overscroll-contain rounded-md bg-gray-50 py-1 text-gray-900 shadow-lg outline-1 outline-gray-200"
        >
          <Autocomplete.Status>
            <div
              v-if="pending"
              class="flex items-center gap-2 py-1 pr-8 pl-2 text-sm text-gray-600"
            >
              <div
                class="size-3 animate-spin rounded-full border-2 border-gray-200 border-t-gray-600"
                aria-hidden="true"
              ></div>
              Searching…
            </div>
            <div v-else-if="status" class="py-1 pr-8 pl-2 text-sm text-gray-600">
              {{ status }}
            </div>
          </Autocomplete.Status>
          <Autocomplete.List>
            <Autocomplete.Collection v-slot="{ item }">
              <Autocomplete.Item
                :value="item"
                class="flex py-2 pr-2 pl-2.5 text-sm/4 outline-hidden select-none data-highlighted:relative data-highlighted:z-0 data-highlighted:text-gray-50 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-gray-900"
              >
                <span class="flex w-full flex-col gap-1">
                  <span class="leading-5 font-semibold">{{ (item as Page).title }}</span>
                  <span class="text-sm/4 opacity-80">{{ (item as Page).section }}</span>
                </span>
              </Autocomplete.Item>
            </Autocomplete.Collection>
          </Autocomplete.List>
        </Autocomplete.Popup>
      </Autocomplete.Positioner>
    </Autocomplete.Portal>
  </Autocomplete.Root>
</template>
