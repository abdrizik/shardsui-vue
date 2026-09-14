<script setup lang="ts">
import { Tabs } from '@shardsui/vue/tabs'

const tabs = [
  {
    value: 'overview',
    label: 'Overview',
    body: 'A short overview of closures and where they tend to show up throughout everyday code.'
  },
  {
    value: 'transcript',
    label: 'Transcript',
    body: 'A closure is a function that remembers the scope where it was originally created in.'
  },
  {
    value: 'notes',
    label: 'Notes',
    body: 'Revisit the counter example — the returned function keeps its own copy of count.'
  }
]
</script>

<template>
  <Tabs.Root class="w-fit rounded-md border border-gray-200" value="overview">
    <Tabs.List class="relative z-0 flex gap-1 border-b border-gray-200 px-1">
      <Tabs.Tab
        v-for="tab in tabs"
        :key="tab.value"
        class="flex h-8 items-center justify-center border-0 px-3 text-sm font-normal whitespace-nowrap text-gray-600 outline-hidden select-none before:inset-x-0 before:inset-y-1 before:rounded-xs before:-outline-offset-1 before:outline-gray-950 hover:text-gray-900 focus-visible:relative focus-visible:before:absolute focus-visible:before:outline-2 data-active:text-gray-900"
        :value="tab.value"
      >
        {{ tab.label }}
      </Tabs.Tab>
      <Tabs.Indicator
        class="absolute top-1/2 left-0 z-[-1] h-6 w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-1/2 rounded-xs bg-gray-100 transition-[translate,width] duration-150 ease-in-out"
      />
    </Tabs.List>
    <Tabs.Panel
      v-for="tab in tabs"
      :key="tab.value"
      class="w-0 min-w-full p-4 text-sm/5.75 text-gray-700"
      :value="tab.value"
    >
      {{ tab.body }}
    </Tabs.Panel>
  </Tabs.Root>
</template>
