<script setup lang="ts">
import { Combobox } from '@shardsui/vue/combobox'
import { Dialog } from '@shardsui/vue/dialog'
import { computed, shallowRef, useId, useTemplateRef } from 'vue'

type Tag = {
  id: string
  value: string
  creatable?: string
}

const id = useId()

const tags = shallowRef<Tag[]>([
  { id: 'kerning', value: 'kerning' },
  { id: 'tracking', value: 'tracking' },
  { id: 'leading', value: 'leading' }
])
const selected = shallowRef<Tag[]>([])
const query = shallowRef('')
const openDialog = shallowRef(false)
const draftName = shallowRef('')
const createInput = useTemplateRef<HTMLInputElement>('createInput')
const highlighted = shallowRef<Tag | undefined>()

const trimmed = computed(() => query.value.trim())
const match = computed(() => findTag(trimmed.value))

const items = computed<Tag[]>(() =>
  trimmed.value !== '' && !match.value
    ? [
        ...tags.value,
        { id: `create:${trimmed.value}`, value: trimmed.value, creatable: trimmed.value }
      ]
    : tags.value
)

function findTag(value: string) {
  const lower = value.toLowerCase()
  return tags.value.find((t) => t.value.toLowerCase() === lower)
}

function addTag(tag: Tag) {
  if (!selected.value.some((s) => s.id === tag.id)) selected.value = [...selected.value, tag]
}

function commitSelection(next: Tag[] | null | undefined) {
  const chosen = next ?? []
  const draft = chosen.find(
    (t) => t.creatable && !selected.value.some((s) => s.id === t.id)
  )?.creatable

  if (draft) {
    draftName.value = draft
    openDialog.value = true
    return
  }

  selected.value = chosen.filter((t) => !t.creatable)
  query.value = ''
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' || highlighted.value || !trimmed.value) return

  if (match.value) {
    addTag(match.value)
    query.value = ''
    return
  }

  draftName.value = trimmed.value
  openDialog.value = true
}

function createTag(event: Event) {
  event.preventDefault()
  const value = draftName.value.trim()
  if (!value) return

  const existing = findTag(value)
  if (existing) {
    addTag(existing)
  } else {
    const base = value.toLowerCase().replace(/\s+/g, '-')
    let nextId = base
    for (let i = 2; tags.value.some((t) => t.id === nextId); i += 1) nextId = `${base}-${i}`

    const tag: Tag = { id: nextId, value }
    tags.value = [...tags.value, tag]
    addTag(tag)
  }

  openDialog.value = false
  query.value = ''
}
</script>

<template>
  <Combobox.Root
    :items="items"
    :value="selected"
    @update:value="commitSelection"
    v-model:input-value="query"
    multiple
    :is-item-equal-to-value="(a: Tag, b: Tag) => a.id === b.id"
    @item-highlighted="(item?: Tag) => (highlighted = item)"
  >
    <div class="flex max-w-md flex-col gap-1 text-sm/5 font-semibold text-gray-900">
      <label :for="id">Tags</label>
      <Combobox.InputGroup
        class="min-h-8 w-64 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-gray-950 min-[500px]:w-88"
      >
        <Combobox.Chips class="flex w-full flex-wrap items-center gap-1">
          <Combobox.Chip
            v-for="tag in selected"
            :key="tag.id"
            :aria-label="tag.value"
            class="flex min-h-5.5 items-center gap-1 rounded-md bg-gray-100 py-0 pr-1 pl-2 text-sm text-gray-900 outline-hidden focus-within:bg-gray-950 focus-within:text-gray-50"
          >
            {{ tag.value }}
            <Combobox.ChipRemove
              class="flex size-4 items-center justify-center rounded-md p-0 text-inherit hover:bg-gray-200"
              :aria-label="`Remove ${tag.value}`"
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
            :on-keydown="onKeydown"
            :placeholder="selected.length > 0 ? '' : 'e.g. kerning'"
            class="h-5.5 min-w-12 flex-1 rounded-md border-0 bg-transparent p-0 text-sm font-normal text-gray-900 outline-hidden any-pointer-coarse:text-base"
          />
        </Combobox.Chips>
      </Combobox.InputGroup>
    </div>

    <Combobox.Portal>
      <Combobox.Positioner class="z-50 outline-hidden" :side-offset="4">
        <Combobox.Popup
          class="max-h-[min(var(--available-height),24.5rem)] w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) scroll-py-1 overflow-y-auto overscroll-contain rounded-md bg-gray-50 py-1 text-gray-900 shadow-lg outline-1 outline-gray-200 transition-[transform,scale,opacity] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0"
        >
          <Combobox.Empty>
            <div class="py-2 pr-4 pl-2 text-sm/4 text-gray-600">No tags found.</div>
          </Combobox.Empty>
          <Combobox.List>
            <Combobox.Collection v-slot="{ item }">
              <Combobox.Item
                :value="item"
                class="grid grid-cols-[1rem_1fr] items-center gap-2 py-2 pr-2 pl-2.5 text-sm/4 outline-hidden select-none [@media(hover:hover)]:data-highlighted:relative [@media(hover:hover)]:data-highlighted:z-0 [@media(hover:hover)]:data-highlighted:text-gray-50 [@media(hover:hover)]:data-highlighted:before:absolute [@media(hover:hover)]:data-highlighted:before:inset-x-1 [@media(hover:hover)]:data-highlighted:before:inset-y-0 [@media(hover:hover)]:data-highlighted:before:z-[-1] [@media(hover:hover)]:data-highlighted:before:rounded-sm [@media(hover:hover)]:data-highlighted:before:bg-gray-900"
              >
                <template v-if="(item as Tag).creatable">
                  <span class="col-start-1">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="size-4">
                      <path
                        d="M12 3.75V12M12 12V20.25M12 12H3.75M12 12H20.25"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                  <span class="col-start-2">Create "{{ (item as Tag).creatable }}"</span>
                </template>
                <template v-else>
                  <Combobox.ItemIndicator class="col-start-1">
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
                  <span class="col-start-2">{{ (item as Tag).value }}</span>
                </template>
              </Combobox.Item>
            </Combobox.Collection>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>

  <Dialog.Root v-model:open="openDialog">
    <Dialog.Portal>
      <Dialog.Backdrop
        class="fixed inset-0 min-h-dvh bg-black opacity-20 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute"
      />
      <Dialog.Popup
        :initial-focus="() => createInput"
        class="fixed top-1/2 left-1/2 w-80 max-w-[calc(100vw-3rem)] -translate-1/2 rounded-lg bg-gray-50 p-4 text-gray-900 outline-1 outline-gray-200 transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0"
      >
        <Dialog.Title class="mb-1 text-base font-semibold">Create tag</Dialog.Title>
        <Dialog.Description class="mb-4 text-sm text-gray-600">
          Add a new tag to select.
        </Dialog.Description>
        <form @submit="createTag">
          <input
            ref="createInput"
            v-model="draftName"
            placeholder="Tag name"
            class="h-8 w-full rounded-md border border-gray-200 px-2 text-sm font-normal text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-gray-950 any-pointer-coarse:text-base"
          />
          <div class="mt-4 flex justify-end gap-3">
            <Dialog.Close
              class="flex h-8 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3 text-sm font-normal text-gray-900 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-gray-950 active:bg-gray-100"
            >
              Cancel
            </Dialog.Close>
            <button
              type="submit"
              class="flex h-8 items-center justify-center rounded-md border border-gray-900 bg-gray-900 px-3 text-sm font-normal text-gray-50 select-none hover:bg-gray-700 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-gray-950 active:bg-gray-700"
            >
              Create
            </button>
          </div>
        </form>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>
