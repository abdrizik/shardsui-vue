<script setup lang="ts">
import {
  computed,
  mergeProps,
  onWatcherCleanup,
  useId,
  watch,
  watchEffect,
  watchSyncEffect
} from 'vue'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { DirectionContext } from '@/internal/direction-context'
import { listen } from '@/internal/dom'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import { ComboboxContext, ComboboxPositionerContext, type ComboboxListState } from './context'

type Props = PartProps & {
  id?: string
  onKeydown?: (event: KeyboardEvent) => void
}

defineOptions({ inheritAttrs: false })

const { as = 'div', id: idProp, onKeydown } = defineProps<Props>()

defineSlots<{ default?: (state: ComboboxListState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const combobox = ComboboxContext.get()
const positioner = ComboboxPositionerContext.getOr()
const registry = combobox.itemRegistry
const direction = DirectionContext.get()
const forwardArrowKey = computed(() =>
  direction.direction.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
)

const element = usePartElement()

watch(
  () => element.value,
  (node) => {
    combobox.listElement.value = node ?? null
    if (!positioner) combobox.positionerElement.value = node ?? null
  },
  { immediate: true, flush: 'sync' }
)

watchEffect(() => {
  const current = id.value
  combobox.listId.value = current
  onWatcherCleanup(() => {
    if (combobox.listId.value === current) combobox.listId.value = undefined
  })
})

function navigateList(event: KeyboardEvent) {
  if (combobox.disabled.value || combobox.readOnly.value) return
  if (event.key === 'Enter') {
    const activeIndex = registry.highlightedIndex.value
    if (activeIndex < 0) return
    event.preventDefault()
    event.stopPropagation()
    registry.getItemElement(activeIndex)?.click()
    return
  }

  if (!combobox.open.value) return

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    event.stopPropagation()
    registry.moveHighlight(event.key === 'ArrowDown' ? 1 : -1)
  } else if (combobox.grid.value && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
    event.preventDefault()
    event.stopPropagation()
    registry.focusItem(
      registry.stepIndex(
        registry.highlightedIndex.value,
        event.key === forwardArrowKey.value ? 1 : -1
      )
    )
  } else if (combobox.inputInsidePopup.value && (event.key === 'Home' || event.key === 'End')) {
    event.preventDefault()
    event.stopPropagation()
    registry.focusItem(event.key === 'Home' ? registry.firstIndex() : registry.lastIndex())
  }
}

watchSyncEffect(() => {
  const node = element.value
  if (!node) return
  onWatcherCleanup(
    listen(node, 'keydown', (event: KeyboardEvent) => chain(onKeydown, navigateList)(event))
  )
})

const comboboxState = computed<ComboboxListState>(() => ({ empty: combobox.isEmpty.value }))

const stateAttrs = computed(() => dataAttrs(comboboxState.value))

const ownAttrs = computed(() => ({
  id: id.value,
  tabindex: -1,
  role: combobox.grid.value ? 'grid' : 'listbox',
  'aria-multiselectable': combobox.multiple.value || undefined
}))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)">
    <slot v-bind="comboboxState" />
  </component>
</template>
