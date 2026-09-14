<script setup lang="ts">
import { Combobox } from '@shardsui/vue/combobox'
import { computed, shallowRef, useId } from 'vue'

type Product = {
  id: string
  name: string
  description: string
}

const { contains } = Combobox.createFilter()

const id = useId()

const catalog: Product[] = [
  { id: 'typography', name: 'Typography', description: 'Kerning, tracking, and type scale' },
  { id: 'color', name: 'Color', description: 'Contrast ratio, OKLCH, and semantic tokens' },
  { id: 'layout', name: 'Layout', description: 'Flexbox, grid, and negative space' },
  { id: 'motion', name: 'Motion', description: 'Ease-out, duration, and reduced motion' },
  {
    id: 'tokens',
    name: 'Tokens',
    description: 'Name your design decisions once, reuse everywhere'
  },
  { id: 'data-viz', name: 'Data viz', description: 'Turn numbers into clear stories' }
]

const results = shallowRef<Product[]>([])
const selected = shallowRef<Product | null>(null)
const query = shallowRef('')
const pending = shallowRef(false)
let controller: AbortController | null = null

const trimmed = computed(() => query.value.trim())

const items = computed(() => {
  const current = selected.value
  if (!current || results.value.some((product) => product.id === current.id)) return results.value
  return [...results.value, current]
})

function search(value: string): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        catalog.filter(
          (product) => contains(product.name, value) || contains(product.description, value)
        )
      )
    }, 400)
  })
}

function searchCatalog(value: string) {
  controller?.abort()

  if (selected.value && value === selected.value.name) {
    pending.value = false
    return
  }

  if (!value.trim()) {
    results.value = []
    pending.value = false
    return
  }

  controller = new AbortController()
  const signal = controller.signal
  pending.value = true
  void search(value).then((found) => {
    if (signal.aborted) return
    results.value = found
    pending.value = false
  })
}

function onOpenChangeComplete(open: boolean) {
  if (!open && selected.value) results.value = [selected.value]
}
</script>

<template>
  <Combobox.Root
    :items="items"
    v-model:value="selected"
    v-model:input-value="query"
    :item-to-string-label="(p: Product) => p.name"
    :is-item-equal-to-value="(a: Product, b: Product) => a.id === b.id"
    :filter="null"
    @update:input-value="searchCatalog"
    @open-change-complete="onOpenChangeComplete"
  >
    <div class="relative flex flex-col gap-1 text-sm/5 font-semibold text-gray-900">
      <label :for="id">Find product</label>
      <Combobox.InputGroup
        class="relative box-content h-8 w-64 rounded-md border border-gray-200 bg-gray-50 focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-gray-950 md:w-80 [&>input]:pr-8 has-[.combobox-clear]:[&>input]:pr-[calc(0.5rem+1.5rem*2)]"
      >
        <Combobox.Input
          :id="id"
          placeholder="Search products…"
          class="box-border size-full border-0 bg-transparent pl-2 text-sm font-normal text-gray-900 outline-hidden any-pointer-coarse:text-base"
        />
        <div class="absolute right-1 bottom-0 flex h-8 items-center justify-center text-gray-600">
          <Combobox.Clear
            class="combobox-clear flex h-8 w-6 items-center justify-center rounded border-0 bg-transparent p-0"
            aria-label="Clear selection"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="size-4">
              <path
                d="M6.25 6.25L17.75 17.75M17.75 6.25L6.25 17.75"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </Combobox.Clear>
          <Combobox.Trigger
            class="flex h-8 w-6 items-center justify-center rounded border-0 bg-transparent p-0"
            aria-label="Open popup"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="size-4">
              <path
                d="M5.75 9.5L12 15.75L18.25 9.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Combobox.Trigger>
        </div>
      </Combobox.InputGroup>
    </div>

    <Combobox.Portal>
      <Combobox.Positioner class="outline-hidden" :side-offset="4">
        <Combobox.Popup
          class="box-border max-h-[min(var(--available-height),22.5rem)] w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) scroll-py-1 overflow-y-auto overscroll-contain rounded-md bg-gray-50 py-1 text-gray-900 shadow-lg outline-1 outline-gray-200 transition-[transform,scale,opacity] duration-100 data-ending-style:transition-none data-starting-style:scale-95 data-starting-style:opacity-0"
          :aria-busy="pending || undefined"
        >
          <Combobox.Status>
            <div
              v-if="pending"
              class="flex items-center gap-2 py-1 pr-5 pl-2 text-sm text-gray-600"
            >
              <span
                aria-hidden="true"
                class="inline-block size-3 animate-spin rounded-full border border-current border-r-transparent"
              ></span>
              Searching…
            </div>
            <div
              v-else-if="trimmed === '' && !selected"
              class="flex items-center gap-2 py-1 pr-5 pl-2 text-sm text-gray-600"
            >
              Start typing to search…
            </div>
          </Combobox.Status>
          <Combobox.Empty>
            <div v-if="trimmed !== '' && !pending" class="py-2 pr-4 pl-2 text-sm/4 text-gray-600">
              No results found.
            </div>
          </Combobox.Empty>
          <Combobox.List>
            <Combobox.Collection v-slot="{ item }">
              <Combobox.Item
                :value="item"
                class="grid grid-cols-[1rem_1fr] items-start gap-2 py-2 pr-2 pl-2.5 text-sm/[1.2rem] outline-hidden select-none [@media(hover:hover)]:data-highlighted:relative [@media(hover:hover)]:data-highlighted:z-0 [@media(hover:hover)]:data-highlighted:before:absolute [@media(hover:hover)]:data-highlighted:before:inset-x-1 [@media(hover:hover)]:data-highlighted:before:inset-y-0 [@media(hover:hover)]:data-highlighted:before:z-[-1] [@media(hover:hover)]:data-highlighted:before:rounded [@media(hover:hover)]:data-highlighted:before:bg-gray-100"
              >
                <Combobox.ItemIndicator class="col-start-1 mt-1">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="size-4">
                    <path
                      d="M6 14.15L10.0321 18L18 7"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </Combobox.ItemIndicator>
                <span class="col-start-2 flex flex-col gap-0.5">
                  <span class="text-sm font-semibold">{{ (item as Product).name }}</span>
                  <span class="text-xs text-gray-600">{{ (item as Product).description }}</span>
                </span>
              </Combobox.Item>
            </Combobox.Collection>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
