<script setup lang="ts">
import { Combobox } from '@shardsui/vue/combobox'
import { computed, shallowRef, useId } from 'vue'

type Person = {
  id: string
  name: string
  role: string
}

const { contains } = Combobox.createFilter()

const id = useId()

const directory: Person[] = [
  { id: 'rand', name: 'Paul Rand', role: 'Identity' },
  { id: 'bass', name: 'Saul Bass', role: 'Motion' },
  { id: 'glaser', name: 'Milton Glaser', role: 'Illustration' },
  { id: 'vignelli', name: 'Massimo Vignelli', role: 'Typography' },
  { id: 'scher', name: 'Paula Scher', role: 'Identity' },
  { id: 'rams', name: 'Dieter Rams', role: 'Industrial' },
  { id: 'sagmeister', name: 'Stefan Sagmeister', role: 'Editorial' },
  { id: 'aicher', name: 'Otl Aicher', role: 'Systems' }
]

const results = shallowRef<Person[]>([])
const value = shallowRef<Person[]>([])
const query = shallowRef('')
const pending = shallowRef(false)
let controller: AbortController | null = null

const trimmed = computed(() => query.value.trim())

const items = computed(() => {
  if (value.value.length === 0) return results.value
  const merged = [...results.value]
  for (const person of value.value) {
    if (!merged.some((r) => r.id === person.id)) merged.push(person)
  }
  return merged
})

function search(text: string, signal: AbortSignal): Promise<Person[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (signal.aborted) return resolve([])
      resolve(directory.filter((p) => contains(p.name, text) || contains(p.role, text)))
    }, 400)
  })
}

function searchDirectory(next: string) {
  controller?.abort()

  if (!next.trim()) {
    results.value = []
    pending.value = false
    return
  }

  controller = new AbortController()
  const signal = controller.signal
  pending.value = true
  search(next, signal).then((found) => {
    if (signal.aborted) return
    results.value = found
    pending.value = false
  })
}

function onValueChange(next: Person[] | null | undefined) {
  query.value = ''
  if (!next?.length) results.value = []
}

function onOpenChangeComplete(open: boolean) {
  if (!open) results.value = []
}
</script>

<template>
  <Combobox.Root
    multiple
    :items="items"
    v-model:value="value"
    v-model:input-value="query"
    :item-to-string-label="(p: Person) => p.name"
    :is-item-equal-to-value="(a: Person, b: Person) => a.id === b.id"
    :filter="null"
    @update:input-value="searchDirectory"
    @update:value="onValueChange"
    @open-change-complete="onOpenChangeComplete"
  >
    <div class="flex max-w-md flex-col gap-1 text-sm/5 font-semibold text-gray-900">
      <label :for="id">Collaborators</label>
      <Combobox.InputGroup
        class="flex min-h-8 w-64 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-gray-950 min-[500px]:w-88"
      >
        <Combobox.Chips class="flex w-full flex-wrap items-center gap-1">
          <Combobox.Chip
            v-for="person in value"
            :key="person.id"
            :aria-label="person.name"
            class="flex min-h-5.5 items-center gap-1 rounded-md bg-gray-100 py-0 pr-1 pl-2 text-sm text-gray-900 outline-hidden focus-within:bg-gray-950 focus-within:text-gray-50"
          >
            {{ person.name }}
            <Combobox.ChipRemove
              class="flex size-4 items-center justify-center rounded-md p-0 text-inherit hover:bg-gray-200"
              :aria-label="`Remove ${person.name}`"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="size-4">
                <path
                  d="M6.25 6.25L17.75 17.75M17.75 6.25L6.25 17.75"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </Combobox.ChipRemove>
          </Combobox.Chip>
          <Combobox.Input
            :id="id"
            :placeholder="value.length > 0 ? '' : 'Search people…'"
            class="h-5.5 min-w-12 flex-1 rounded-md border-0 bg-transparent p-0 text-sm font-normal text-gray-900 outline-hidden any-pointer-coarse:text-base"
          />
        </Combobox.Chips>
      </Combobox.InputGroup>
    </div>

    <Combobox.Portal>
      <Combobox.Positioner class="z-50 outline-hidden" :side-offset="4">
        <Combobox.Popup
          class="max-h-[min(var(--available-height),24.5rem)] w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) scroll-py-1 overflow-y-auto overscroll-contain rounded-md bg-gray-50 py-1 text-gray-900 shadow-lg outline-1 outline-gray-200 transition-[transform,scale,opacity] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0"
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
              v-else-if="trimmed === '' && value.length === 0"
              class="flex items-center gap-2 py-1 pr-5 pl-2 text-sm text-gray-600"
            >
              Start typing to search people…
            </div>
          </Combobox.Status>
          <Combobox.Empty>
            <div v-if="trimmed !== '' && !pending" class="py-2 pr-4 pl-2 text-sm/4 text-gray-600">
              No people found.
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
                  <span class="text-sm font-semibold">{{ (item as Person).name }}</span>
                  <span class="text-xs text-gray-600">{{ (item as Person).role }}</span>
                </span>
              </Combobox.Item>
            </Combobox.Collection>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
