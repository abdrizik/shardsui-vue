<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { createTypeahead } from '@/internal/floating/typeahead'

const {
  items = ['one', 'two', 'three'],
  onMatch = undefined,
  onTyping = undefined,
  enabled = undefined,
  resetMs = undefined,
  hiddenIndices = [],
  nestedInput = false
} = defineProps<{
  items?: string[]
  onMatch?: (index: number) => void
  onTyping?: (isTyping: boolean) => void
  enabled?: () => boolean
  resetMs?: number
  hiddenIndices?: number[]
  nestedInput?: boolean
}>()

const activeIndex = shallowRef(-1)
const itemEls = ref<(HTMLElement | null)[]>([])

const typeahead = createTypeahead({
  items: () => items,
  activeIndex,
  onMatch: (index) => {
    activeIndex.value = index
    onMatch?.(index)
  },
  onTyping: () => onTyping,
  enabled: () => enabled?.(),
  resetMs: () => resetMs,
  elements: itemEls
})
</script>

<template>
  <div
    role="listbox"
    data-testid="container"
    tabindex="0"
    @keydown="typeahead.matchKey"
    @blur="typeahead.resetOnFocusLeave"
  >
    <input v-if="nestedInput" data-testid="nested-input" readonly />
    <div
      v-for="(item, i) in items"
      :key="i"
      :ref="(el) => (itemEls[i] = el as HTMLElement | null)"
      role="option"
      :data-testid="`item-${i}`"
      :aria-selected="activeIndex === i"
      :style="hiddenIndices.includes(i) ? { display: 'none' } : undefined"
    >
      {{ item }}
    </div>
  </div>
</template>
