<script setup lang="ts">
import { computed, mergeProps, shallowRef, useTemplateRef, watch, watchEffect } from 'vue'
import { chain } from '@/internal/chain'
import { observeDocumentOrder } from '@/internal/document-order'
import { sortByDocumentPosition } from '@/internal/document-position'
import type { PartProps } from '@/internal/types'
import { ComboboxChipsContext, ComboboxContext } from './context'
import { focusInputOnPress } from './focus-input-on-press'

type Props = PartProps & {
  onMousedown?: (event: MouseEvent) => void
}

defineOptions({ inheritAttrs: false })

const { as = 'div', onMousedown } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const combobox = ComboboxContext.get()

const element = useTemplateRef<HTMLElement>('element')

watch(
  () => element.value,
  (node) => {
    combobox.chipsContainerElement.value = node ?? null
  },
  { immediate: true, flush: 'sync' }
)

const highlightedIndex = shallowRef<number | undefined>(undefined)

const chipElements: HTMLElement[] = []
const elements = shallowRef<HTMLElement[]>([])

function publish() {
  elements.value = [...chipElements]
}

function registerChip(chip: HTMLElement): () => void {
  const following = chipElements.findIndex((other) => sortByDocumentPosition(other, chip) > 0)
  chipElements.splice(following === -1 ? chipElements.length : following, 0, chip)
  publish()

  return () => {
    const index = chipElements.indexOf(chip)
    if (index === -1) return
    chipElements.splice(index, 1)
    publish()
  }
}

watchEffect(() => {
  if (combobox.open.value && highlightedIndex.value !== undefined) {
    highlightedIndex.value = undefined
  }
})

observeDocumentOrder({
  container: element,
  items: elements,
  elementOf: (chip: HTMLElement) => chip,
  reorder: (sorted: HTMLElement[]) => {
    chipElements.splice(0, chipElements.length, ...sorted)
    publish()
  }
})

const hasChips = computed(() => combobox.multiple.value && combobox.hasSelectedValue.value)

function onPress(event: MouseEvent) {
  focusInputOnPress(event, combobox, element.value)
}

ComboboxChipsContext.set({ highlightedIndex, elements, registerChip })

const ownAttrs = computed(() => ({
  // NVDA enters browse mode instead of staying in focus mode when navigating with arrow keys
  // inside a container unless it has a toolbar role.
  role: hasChips.value ? 'toolbar' : undefined,
  onMousedown: chain(onMousedown, onPress)
}))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(ownAttrs, $attrs)">
    <slot />
  </component>
</template>
