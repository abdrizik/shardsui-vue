<script setup lang="ts">
import Bar from '~/components/thumbnail/bar.vue'
import CheckboxItem from '~/components/thumbnail/checkbox-item.vue'
import ChevronDownIcon from '~/components/thumbnail/chevron-down-icon.vue'
import EllipsisIcon from '~/components/thumbnail/ellipsis-icon.vue'
import FormField from '~/components/thumbnail/form-field.vue'
import MenuItems from '~/components/thumbnail/menu-items.vue'
import ModalPreview from '~/components/thumbnail/modal-preview.vue'
import RadioItem from '~/components/thumbnail/radio-item.vue'
import Track from '~/components/thumbnail/track.vue'
import XIcon from '~/components/thumbnail/x-icon.vue'

const { slug } = defineProps<{ slug: string }>()
</script>

<template>
  <div
    class="pointer-events-none flex h-52 items-center justify-center overflow-hidden rounded-lg bg-gray-100/60 px-6 py-5 select-none"
    aria-hidden="true"
  >
    <div
      v-if="slug === 'accordion'"
      class="flex w-full max-w-56 flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60"
    >
      <div class="flex-1 divide-y divide-gray-100">
        <div class="px-3 py-2.5">
          <div class="flex items-center gap-2">
            <div class="flex flex-1 flex-col gap-2">
              <Bar variant="main" class="w-1/2" />
              <Bar variant="secondary" class="w-11/12" />
            </div>
            <ChevronDownIcon class="rotate-180" />
          </div>
        </div>
        <div class="px-3 py-2.5">
          <div class="flex items-center justify-between gap-2">
            <Bar variant="main" class="w-3/5" />
            <ChevronDownIcon />
          </div>
        </div>
      </div>
    </div>
    <ModalPreview v-else-if="slug === 'alert-dialog'">
      <div class="flex flex-col gap-3">
        <Bar variant="main" class="w-1/2" />
        <Bar variant="secondary" class="w-11/12" />
      </div>
    </ModalPreview>
    <div v-else-if="slug === 'autocomplete'" class="flex max-w-56 flex-1 flex-col gap-2">
      <div class="flex w-full max-w-56 flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60">
        <div class="flex flex-1 items-center px-3 py-2.5">
          <Bar variant="main" class="w-2/5" />
        </div>
      </div>
      <div class="flex w-full max-w-56 flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60">
        <div class="flex flex-1 flex-col gap-3 p-3">
          <Bar variant="secondary" class="w-4/5" />
          <Bar variant="secondary" class="w-3/5" />
          <Bar variant="secondary" class="w-11/12" />
        </div>
      </div>
    </div>
    <div v-else-if="slug === 'avatar'" class="size-12 shrink-0 rounded-full bg-gray-200"></div>
    <div
      v-else-if="slug === 'button'"
      class="flex w-fit flex-col rounded-md bg-gray-900 px-3 py-2.5"
    >
      <Bar variant="inverse" class="w-10" />
    </div>
    <div v-else-if="slug === 'checkbox'" class="flex max-w-36 flex-1 flex-col gap-3">
      <CheckboxItem :checked="false" bar-width="w-4/5" />
      <CheckboxItem checked bar-width="w-3/5" />
    </div>
    <div v-else-if="slug === 'checkbox-group'" class="flex max-w-36 flex-1 flex-col gap-3">
      <CheckboxItem checked bar-width="w-4/5" />
      <CheckboxItem checked bar-width="w-3/5" class="ps-4" />
      <CheckboxItem :checked="false" bar-width="w-11/12" class="ps-4" />
      <CheckboxItem :checked="false" bar-width="w-2/3" />
    </div>
    <div
      v-else-if="slug === 'collapsible'"
      class="flex w-full max-w-56 flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60"
    >
      <div class="flex-1 divide-y divide-gray-100">
        <div class="flex items-center justify-between px-3 py-2.5">
          <Bar variant="main" class="w-3/5" />
          <ChevronDownIcon class="rotate-180" />
        </div>
        <div class="flex flex-col gap-2 p-3">
          <Bar variant="secondary" class="w-4/5" />
          <Bar variant="secondary" class="w-2/3" />
        </div>
      </div>
    </div>
    <div
      v-else-if="slug === 'combobox'"
      class="flex w-full max-w-56 flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60"
    >
      <div class="flex flex-1 items-center gap-2 px-3 py-2.5">
        <div class="flex h-5 items-center gap-1 rounded-sm bg-gray-100 py-0.5 ps-2 pe-1">
          <Bar variant="main" class="w-10" />
          <XIcon />
        </div>
        <div class="flex h-5 items-center gap-1 rounded-sm bg-gray-100 py-0.5 ps-2 pe-1">
          <Bar variant="main" class="w-6" />
          <XIcon />
        </div>
      </div>
    </div>
    <div v-else-if="slug === 'context-menu'" class="flex max-w-56 flex-1 flex-col">
      <div class="min-h-20 flex-1 rounded-lg border border-dashed border-gray-200"></div>
      <div class="ms-24 -mt-6 flex w-fit flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60">
        <MenuItems />
      </div>
    </div>
    <ModalPreview v-else-if="slug === 'dialog'">
      <div class="flex flex-col gap-3">
        <Bar variant="main" class="w-3/5" />
        <div class="flex flex-col gap-2">
          <Bar variant="secondary" class="w-full" />
          <Bar variant="secondary" class="w-4/5" />
        </div>
      </div>
    </ModalPreview>
    <div v-else-if="slug === 'drawer'" class="flex size-full flex-1 flex-col justify-end gap-2">
      <div class="min-h-20 flex-1 rounded-lg border border-dashed border-gray-200"></div>
      <div
        class="flex w-full max-w-none shrink-0 flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60"
      >
        <div class="flex flex-col gap-2 px-3 pt-1 pb-4">
          <div class="flex justify-center py-2">
            <div class="h-1 w-12 rounded-full bg-gray-300"></div>
          </div>
          <Bar variant="main" class="w-2/5" />
          <Bar variant="secondary" class="w-4/5" />
        </div>
      </div>
    </div>
    <div v-else-if="slug === 'field'" class="flex max-w-56 flex-1 flex-col gap-3">
      <FormField show-error />
    </div>
    <div v-else-if="slug === 'fieldset'" class="flex max-w-56 flex-1 flex-col gap-4">
      <FormField label-width="w-14" value-width="w-3/5" />
      <FormField label-width="w-20" value-width="w-2/5" />
    </div>
    <div v-else-if="slug === 'form'" class="flex max-w-56 flex-1 flex-col gap-4">
      <FormField />
      <div class="flex flex-col rounded-lg bg-gray-900">
        <div class="flex flex-1 items-center justify-center px-3 py-2.5">
          <Bar variant="inverse" class="w-10" />
        </div>
      </div>
    </div>
    <div
      v-else-if="slug === 'input'"
      class="flex w-full max-w-56 flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60"
    >
      <div class="flex-1 px-3 py-2.5">
        <Bar variant="main" class="w-3/5" />
      </div>
    </div>
    <div v-else-if="slug === 'menu'" class="flex max-w-56 flex-1 flex-col items-end gap-2">
      <div class="flex w-fit flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60">
        <div class="flex flex-1 items-center gap-2 p-2">
          <EllipsisIcon />
        </div>
      </div>
      <div class="flex w-fit flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60">
        <MenuItems />
      </div>
    </div>
    <div
      v-else-if="slug === 'menubar'"
      class="flex w-fit flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60"
    >
      <div class="flex flex-1 items-center gap-0.5 p-1">
        <div class="rounded-md px-3 py-2"><Bar variant="secondary" class="w-8" /></div>
        <div class="rounded-md bg-gray-100 px-3 py-2"><Bar variant="main" class="w-8" /></div>
        <div class="rounded-md px-3 py-2"><Bar variant="secondary" class="w-8" /></div>
      </div>
    </div>
    <div v-else-if="slug === 'meter'" class="flex max-w-56 flex-1 flex-col gap-2">
      <div class="flex items-center justify-between">
        <Bar variant="main" class="w-1/2" />
        <Bar variant="main" class="w-8" />
      </div>
      <Track fill-width="w-3/4" />
    </div>
    <div
      v-else-if="slug === 'navigation-menu'"
      class="flex w-full max-w-56 flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60"
    >
      <div class="flex flex-1 flex-col gap-3 p-3">
        <div class="flex items-center gap-4 border-b border-gray-100 pb-2">
          <div><Bar variant="main" class="w-10" /></div>
          <div><Bar variant="secondary" class="w-8" /></div>
          <div><Bar variant="secondary" class="w-6" /></div>
        </div>
        <div class="flex flex-col rounded-lg bg-gray-50 p-3 ring-1 ring-gray-200/60">
          <Bar variant="secondary" class="w-4/5" />
        </div>
      </div>
    </div>
    <div v-else-if="slug === 'popover'" class="flex max-w-56 flex-1 flex-col items-center gap-2">
      <div class="flex w-fit flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60">
        <div class="flex flex-1 items-center gap-2 px-3 py-2.5">
          <Bar variant="main" class="w-12" />
        </div>
      </div>
      <div class="flex w-full max-w-56 flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60">
        <div class="flex flex-1 flex-col gap-3 p-3">
          <Bar variant="main" class="w-2/3" />
          <div class="flex flex-col gap-1.5">
            <Bar variant="secondary" class="w-4/5" />
            <Bar variant="secondary" class="w-3/5" />
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="slug === 'preview-card'"
      class="flex max-w-36 flex-1 flex-col items-center gap-2"
    >
      <div class="size-3 shrink-0 rounded-full bg-gray-300"></div>
      <div
        class="flex w-full max-w-36 flex-col gap-2 rounded-lg bg-gray-50 p-2 ring-1 ring-gray-200/60"
      >
        <div class="aspect-video w-full rounded-md bg-gray-200"></div>
        <div class="flex flex-col gap-2">
          <Bar variant="main" class="w-2/3" />
          <Bar variant="secondary" class="w-full" />
          <Bar variant="secondary" class="w-3/5" />
        </div>
      </div>
    </div>
    <div v-else-if="slug === 'progress'" class="flex max-w-56 flex-1 flex-col gap-2">
      <Track fill-width="w-1/2" />
    </div>
    <div v-else-if="slug === 'radio'" class="flex max-w-36 flex-1 flex-col gap-3">
      <RadioItem checked bar-width="w-4/5" />
      <RadioItem :checked="false" bar-width="w-3/5" />
      <RadioItem :checked="false" bar-width="w-11/12" />
    </div>
    <div
      v-else-if="slug === 'scroll-area'"
      class="flex w-full max-w-36 flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60"
    >
      <div class="relative flex-1">
        <div class="flex flex-col gap-2 p-3">
          <Bar variant="secondary" class="w-4/5" />
          <Bar variant="secondary" class="w-11/12" />
          <Bar variant="secondary" class="w-2/3" />
          <Bar variant="secondary" class="w-5/6" />
          <Bar variant="secondary" class="w-11/12" />
          <Bar variant="secondary" class="w-4/5" />
        </div>
        <div class="absolute inset-e-1 top-2 h-8 w-1 rounded-full bg-gray-300"></div>
      </div>
    </div>
    <div v-else-if="slug === 'select'" class="flex max-w-56 flex-1 flex-col gap-2">
      <div class="flex w-full max-w-56 flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60">
        <div class="flex flex-1 items-center justify-between gap-2 px-3 py-2.5">
          <Bar variant="main" class="w-3/5" />
          <ChevronDownIcon />
        </div>
      </div>
      <div class="flex w-full max-w-56 flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60">
        <div class="flex flex-1 flex-col gap-3 p-3">
          <Bar variant="secondary" class="w-4/5" />
          <Bar variant="main" class="w-3/5" />
          <Bar variant="secondary" class="w-11/12" />
        </div>
      </div>
    </div>
    <div v-else-if="slug === 'separator'" class="flex w-full max-w-56 flex-col">
      <div class="flex flex-1 flex-col divide-y divide-gray-200">
        <div class="flex flex-col gap-2 py-4">
          <Bar variant="main" class="w-3/5" />
          <Bar variant="secondary" class="w-4/5" />
        </div>
        <div class="flex divide-x divide-gray-200 py-4">
          <div class="flex-1 pe-3"><Bar variant="secondary" class="w-4/5" /></div>
          <div class="flex-1 px-3"><Bar variant="secondary" class="w-3/5" /></div>
          <div class="flex-1 ps-3"><Bar variant="secondary" class="w-full" /></div>
        </div>
      </div>
    </div>
    <div v-else-if="slug === 'slider'" class="flex w-full max-w-56 items-center">
      <div class="relative h-1 flex-1 rounded-full bg-gray-200">
        <div class="absolute inset-y-0 inset-s-0 w-1/2 rounded-full bg-gray-900">
          <div
            class="absolute -inset-e-2 top-1/2 size-4 -translate-y-1/2 rounded-full bg-gray-50 shadow-sm ring-1 ring-gray-200/60"
          ></div>
        </div>
      </div>
    </div>
    <div
      v-else-if="slug === 'switch'"
      class="inline-flex h-5 w-9 shrink-0 items-center justify-end rounded-md bg-gray-900 p-px [corner-shape:squircle] supports-[corner-shape:squircle]:rounded-[11px]"
    >
      <div
        class="aspect-square h-full rounded-[3px] bg-gray-50 [corner-shape:squircle] supports-[corner-shape:squircle]:rounded-[7px]"
      ></div>
    </div>
    <div v-else-if="slug === 'tabs'" class="flex max-w-56 flex-col gap-4">
      <div class="flex rounded-lg bg-gray-100 p-1">
        <div class="rounded-md px-3 py-2"><Bar variant="secondary" class="w-6" /></div>
        <div class="flex flex-col rounded-lg bg-gray-50 px-3 py-2 ring-1 ring-gray-200/60">
          <Bar variant="main" class="w-6" />
        </div>
        <div class="rounded-md px-3 py-2"><Bar variant="secondary" class="w-6" /></div>
      </div>
      <div class="flex flex-col gap-2">
        <Bar variant="main" class="w-2/3" />
        <Bar variant="secondary" />
      </div>
    </div>
    <div v-else-if="slug === 'toast'" class="relative flex flex-1 justify-center">
      <div
        class="absolute inset-x-0 top-0 mx-auto flex h-11 w-full max-w-56 -translate-y-6 scale-80 flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60"
      ></div>
      <div
        class="absolute inset-x-0 top-0 mx-auto flex h-11 w-full max-w-56 -translate-y-3 scale-90 flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60"
      ></div>
      <div
        class="relative flex w-full max-w-56 flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60"
      >
        <div class="flex flex-1 flex-col gap-2 p-3">
          <Bar variant="main" class="w-3/5" />
          <Bar variant="secondary" class="w-4/5" />
        </div>
      </div>
    </div>
    <div
      v-else-if="slug === 'toggle'"
      class="flex flex-1 flex-col items-center justify-center gap-2"
    >
      <div class="flex w-full max-w-12 shrink-0 flex-col rounded-md bg-gray-100">
        <div class="flex-1 p-4">
          <Bar variant="strong" />
        </div>
      </div>
      <div
        class="flex w-full max-w-12 shrink-0 flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60"
      >
        <div class="flex-1 p-4">
          <Bar />
        </div>
      </div>
    </div>
    <div
      v-else-if="slug === 'toggle-group'"
      class="flex w-auto shrink-0 flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60"
    >
      <div class="flex">
        <div class="flex-1 bg-gray-100 p-4">
          <Bar variant="strong" class="w-4" />
        </div>
        <div class="flex-1 p-4">
          <Bar variant="main" class="w-4" />
        </div>
        <div class="flex-1 p-4">
          <Bar variant="main" class="w-4" />
        </div>
      </div>
    </div>
    <div
      v-else-if="slug === 'toolbar'"
      class="flex items-center gap-1 rounded-lg p-1 ring-1 ring-gray-200/60"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="flex w-fit flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60"
      >
        <div class="flex-1 p-4">
          <Bar variant="main" class="w-4" />
        </div>
      </div>
    </div>
    <div v-else-if="slug === 'tooltip'" class="flex max-w-36 flex-1 flex-col items-center gap-2">
      <div class="flex w-full max-w-36 flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60">
        <div class="flex-1 px-3 py-2.5">
          <Bar variant="main" class="w-3/5" />
        </div>
      </div>
      <div class="size-3 shrink-0 rounded-full bg-gray-300"></div>
    </div>
    <div
      v-else
      class="flex w-full max-w-56 flex-col gap-3 rounded-lg bg-gray-50 p-3 ring-1 ring-gray-200/60"
    >
      <Bar variant="main" class="w-2/5" />
      <Bar variant="secondary" class="w-4/5" />
      <Bar variant="secondary" class="w-3/5" />
    </div>
  </div>
</template>
