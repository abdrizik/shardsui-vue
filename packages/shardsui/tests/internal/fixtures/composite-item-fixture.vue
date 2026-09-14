<script setup lang="ts">
import { computed, useTemplateRef, watch } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import type { CompositeRoot } from '@/internal/floating/composite'

const {
  composite,
  label,
  disabled = false
} = defineProps<{
  composite: CompositeRoot
  label: string
  disabled?: boolean
}>()

const el = useTemplateRef<HTMLElement>('el')

watch(
  () => [el.value, disabled] as const,
  ([element, isDisabled], _previous, onCleanup) => {
    if (!element) return
    onCleanup(composite.register(element, { disabled: isDisabled }))
  },
  { immediate: true, flush: 'sync' }
)

const ownIndex = computed(() => (el.value ? composite.indexOfElement(el.value) : -1))
const tabindex = computed(() => (ownIndex.value === composite.highlightedIndex.value ? 0 : -1))
const isActive = computed(() => ownIndex.value === composite.highlightedIndex.value)
const stateAttrs = computed(() => dataAttrs({ active: isActive.value }))
</script>

<template>
  <span
    ref="el"
    :data-testid="label"
    :tabindex="tabindex"
    :aria-disabled="disabled || undefined"
    :data-disabled="disabled ? '' : undefined"
    v-bind="stateAttrs"
    @focus="composite.setHighlightedIndex(ownIndex)"
  >
    {{ label }}
  </span>
</template>
