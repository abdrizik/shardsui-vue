<script setup lang="ts">
import { Accordion } from '@shardsui/vue/accordion'

const faqs = [
  {
    question: 'Kerning or tracking?',
    answer:
      'Kerning adjusts the space between two specific characters. Tracking spaces a whole word or block uniformly.'
  },
  {
    question: 'Ease-in or ease-out for an entrance?',
    answer:
      'Ease-out. It starts fast and settles into place, so entrances feel natural — ease-in feels reluctant.'
  }
]
</script>

<template>
  <Accordion.Root class="flex w-full max-w-80 flex-col text-gray-900">
    <Accordion.Item v-for="faq in faqs" :key="faq.question" class="border-b border-gray-200">
      <Accordion.Header as="h2">
        <Accordion.Trigger
          class="group relative flex w-full items-center justify-between gap-4 bg-gray-50 px-3 py-2 text-left text-sm font-normal focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-gray-950"
        >
          {{ faq.question }}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            class="block size-4 shrink-0 transition-transform duration-100 ease-out group-data-panel-open:rotate-45"
          >
            <path
              d="M12 3.75V12M12 12V20.25M12 12H3.75M12 12H20.25"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel
        class="h-(--accordion-panel-height) overflow-hidden text-sm text-gray-600 transition-[height] duration-150 ease-out data-ending-style:h-0 data-starting-style:h-0"
      >
        <div class="px-3 py-2">{{ faq.answer }}</div>
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion.Root>
</template>
