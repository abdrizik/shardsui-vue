<script setup lang="ts">
import { useId } from 'vue'
import { Radio } from '@shardsui/vue/radio'
import { RadioGroup } from '@shardsui/vue/radio-group'

const id = useId()

const levels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
]
</script>

<template>
  <RadioGroup
    value="intermediate"
    class="flex flex-col items-start gap-1 text-gray-900"
    :aria-labelledby="id"
  >
    <div class="text-sm font-semibold" :id="id">Difficulty</div>

    <label
      v-for="level in levels"
      :key="level.value"
      class="flex items-center gap-2 text-sm font-normal"
    >
      <Radio.Root
        :value="level.value"
        class="flex size-4 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 data-checked:bg-gray-900 data-unchecked:border data-unchecked:border-gray-300"
      >
        <Radio.Indicator class="flex before:size-2 before:rounded-full before:bg-gray-50" />
      </Radio.Root>
      {{ level.label }}
    </label>
  </RadioGroup>
</template>
