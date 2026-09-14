<script setup lang="ts">
import { h, shallowRef } from 'vue'
import { Tooltip } from '@shardsui/vue/tooltip'

const layoutTooltip = Tooltip.createHandle()

const icon = { viewBox: '0 0 24 24', fill: 'none', class: 'size-4', 'aria-hidden': 'true' }
const stroke = {
  stroke: 'currentColor',
  'stroke-width': '1.5',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}

const GridIcon = () =>
  h('svg', icon, [
    h('path', {
      d: 'M3.75 8.55C3.75 6.86984 3.75 6.02976 4.07698 5.38803C4.3646 4.82354 4.82354 4.3646 5.38803 4.07698C6.02976 3.75 6.86984 3.75 8.55 3.75H10.25V10.25H3.75V8.55Z',
      ...stroke
    }),
    h('path', {
      d: 'M13.75 3.75H15.45C17.1302 3.75 17.9702 3.75 18.612 4.07698C19.1765 4.3646 19.6354 4.82354 19.923 5.38803C20.25 6.02976 20.25 6.86984 20.25 8.55V10.25H13.75V3.75Z',
      ...stroke
    }),
    h('path', {
      d: 'M3.75 13.75H10.25V20.25H8.55C6.86984 20.25 6.02976 20.25 5.38803 19.923C4.82354 19.6354 4.3646 19.1765 4.07698 18.612C3.75 17.9702 3.75 17.1302 3.75 15.45V13.75Z',
      ...stroke
    }),
    h('path', {
      d: 'M13.75 13.75H20.25V15.45C20.25 17.1302 20.25 17.9702 19.923 18.612C19.6354 19.1765 19.1765 19.6354 18.612 19.923C17.9702 20.25 17.1302 20.25 15.45 20.25H13.75V13.75Z',
      ...stroke
    })
  ])

const ListIcon = () =>
  h('svg', icon, [
    h('path', { d: 'M8.75 6L20.25 6', ...stroke }),
    h('circle', { cx: '4.2', cy: '5.9998', r: '1.2', fill: 'currentColor' }),
    h('path', { d: 'M8.75 12L20.25 12', ...stroke }),
    h('circle', { cx: '4.2', cy: '11.9998', r: '1.2', fill: 'currentColor' }),
    h('path', { d: 'M8.75 18L20.25 18', ...stroke }),
    h('circle', { cx: '4.2', cy: '17.9998', r: '1.2', fill: 'currentColor' })
  ])

const ColumnsIcon = () =>
  h('svg', icon, [
    h('path', {
      d: 'M17.25 3.75H6.75C5.09315 3.75 3.75 5.09315 3.75 6.75V17.25C3.75 18.9069 5.09315 20.25 6.75 20.25H17.25C18.9069 20.25 20.25 18.9069 20.25 17.25V6.75C20.25 5.09315 18.9069 3.75 17.25 3.75Z',
      ...stroke
    }),
    h('path', { d: 'M9.25 4V20', ...stroke }),
    h('path', { d: 'M14.75 4V20', ...stroke })
  ])

const views = [
  { id: 'view-grid', label: 'Grid', icon: GridIcon },
  { id: 'view-list', label: 'List', icon: ListIcon },
  { id: 'view-columns', label: 'Columns', icon: ColumnsIcon }
]

const open = shallowRef(false)
const triggerId = shallowRef<string | null>(null)

function revealList() {
  triggerId.value = 'view-list'
  open.value = true
}
</script>

<template>
  <Tooltip.Provider>
    <div class="flex flex-wrap items-center justify-center gap-3">
      <div class="flex">
        <Tooltip.Trigger
          v-for="view in views"
          :key="view.id"
          class="flex size-8 items-center justify-center border border-gray-200 bg-gray-50 text-sm font-normal text-gray-900 select-none not-first:border-l-0 first:rounded-l-md last:rounded-r-md hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-gray-950 active:bg-gray-100 data-popup-open:bg-gray-100"
          :handle="layoutTooltip"
          :id="view.id"
          :aria-label="view.label"
        >
          <component :is="view.icon" />
        </Tooltip.Trigger>
      </div>

      <button
        type="button"
        class="flex h-8 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3 text-sm font-normal text-gray-900 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-gray-950 active:bg-gray-100"
        @click="revealList"
      >
        Reveal list tooltip
      </button>
    </div>

    <Tooltip.Root v-model:open="open" v-model:trigger-id="triggerId" :handle="layoutTooltip">
      <Tooltip.Portal>
        <Tooltip.Positioner :side-offset="10" class="max-w-(--available-width)">
          <Tooltip.Popup
            class="origin-(--transform-origin) rounded-md bg-gray-50 px-2 py-1 text-sm text-gray-900 shadow-lg outline-1 outline-gray-200 transition-[transform,scale,opacity] duration-100 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:transition-none data-starting-style:scale-95 data-starting-style:opacity-0"
          >
            <Tooltip.Arrow
              class="data-[side=bottom]:-top-2 data-[side=left]:-right-3.25 data-[side=left]:rotate-90 data-[side=right]:-left-3.25 data-[side=right]:-rotate-90 data-[side=top]:-bottom-2 data-[side=top]:rotate-180"
            >
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                <path
                  d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
                  class="fill-gray-50"
                />
                <path
                  d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
                  class="fill-gray-200"
                />
                <path
                  d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
                />
              </svg>
            </Tooltip.Arrow>
            Change layout
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
</template>
