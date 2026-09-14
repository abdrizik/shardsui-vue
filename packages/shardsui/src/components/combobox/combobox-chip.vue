<script setup lang="ts">
import { computed, mergeProps, useTemplateRef, watch } from 'vue'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { DirectionContext } from '@/internal/direction-context'
import { REASONS } from '@/internal/reasons'
import type { PartProps } from '@/internal/types'
import {
  ComboboxChipContext,
  ComboboxChipsContext,
  ComboboxContext,
  type ComboboxChipsContextValue,
  type ComboboxChipState
} from './context'

type Props = PartProps & {
  onKeydown?: (event: KeyboardEvent) => void
}

defineOptions({ inheritAttrs: false })

const { as = 'div', onKeydown } = defineProps<Props>()

defineSlots<{ default?: (state: ComboboxChipState) => any }>()

const combobox = ComboboxContext.get()
const chips = ComboboxChipsContext.getOr()
const direction = DirectionContext.get()

const element = useTemplateRef<HTMLElement>('element')

watch(
  () => element.value,
  (node, _previous, onCleanup) => {
    if (!node || !chips) return
    onCleanup(chips.registerChip(node))
  },
  { immediate: true, flush: 'sync' }
)

const index = computed(() => {
  if (!element.value || !chips) return -1
  return chips.elements.value.indexOf(element.value)
})

const isRtl = computed(() => direction.direction.value === 'rtl')
const backwardArrowKey = computed(() => (isRtl.value ? 'ArrowRight' : 'ArrowLeft'))
const forwardArrowKey = computed(() => (isRtl.value ? 'ArrowLeft' : 'ArrowRight'))

function handleChipKey(
  event: KeyboardEvent,
  context: ComboboxChipsContextValue
): number | undefined {
  if (event.key === backwardArrowKey.value) {
    event.preventDefault()
    return index.value > 0 ? index.value - 1 : undefined
  }
  if (event.key === forwardArrowKey.value) {
    event.preventDefault()
    return index.value < context.elements.value.length - 1 ? index.value + 1 : undefined
  }
  if (event.key === 'Backspace' || event.key === 'Delete') {
    event.preventDefault()
    event.stopPropagation()
    return combobox.removeSelectedValueAt(index.value)
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    event.stopPropagation()
    return undefined
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    event.stopPropagation()
    combobox.setOpen(true, REASONS.listNavigation)
    return undefined
  }
  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    return undefined
  }
  return index.value
}

function navigateChips(event: KeyboardEvent) {
  if (combobox.disabled.value || combobox.readOnly.value) return
  if (!chips) return

  const nextIndex = handleChipKey(event, chips)
  chips.highlightedIndex.value = nextIndex

  if (nextIndex === undefined) {
    combobox.inputElement.value?.focus()
  } else {
    chips.elements.value[nextIndex]?.focus()
  }
}

ComboboxChipContext.set({ index })

const comboboxState = computed<ComboboxChipState>(() => ({ disabled: combobox.disabled.value }))

const stateAttrs = computed(() => dataAttrs(comboboxState.value))

const ownAttrs = computed(() => ({
  tabindex: -1,
  'aria-disabled': combobox.disabled.value || undefined,
  'aria-readonly': combobox.readOnly.value || undefined,
  onKeydown: chain(onKeydown, navigateChips)
}))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)">
    <slot v-bind="comboboxState" />
  </component>
</template>
