<script setup lang="ts">
import { useId } from 'vue'
import { Checkbox } from '@shardsui/vue/checkbox'
import { CheckboxGroup } from '@shardsui/vue/checkbox-group'

const id = useId()

const topics = [
  { value: 'updates', label: 'Updates' },
  { value: 'mentions', label: 'Mentions' },
  { value: 'activity', label: 'Activity' }
]
</script>

<template>
  <CheckboxGroup
    :value="['activity']"
    class="flex flex-col items-start gap-2 text-gray-900"
    :aria-labelledby="id"
  >
    <div class="text-sm font-semibold" :id="id">Notify me about</div>

    <label
      v-for="topic in topics"
      :key="topic.value"
      class="flex items-center gap-2 text-sm font-normal"
    >
      <Checkbox.Root
        name="topics"
        :value="topic.value"
        class="flex size-4 shrink-0 items-center justify-center rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 data-checked:bg-gray-900 data-unchecked:border data-unchecked:border-gray-300"
      >
        <Checkbox.Indicator class="flex text-gray-50 data-unchecked:hidden">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="size-4">
            <path
              d="M6 14.15L10.0321 18L18 7"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Checkbox.Indicator>
      </Checkbox.Root>
      {{ topic.label }}
    </label>
  </CheckboxGroup>
</template>
