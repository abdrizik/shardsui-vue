<script setup lang="ts">
import { isElement } from '@floating-ui/utils/dom'
import { computed, mergeProps, nextTick, watch, watchPostEffect } from 'vue'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { getTarget } from '@/internal/dom'
import { findItemIndex } from '@/internal/item-equality'
import { usePartElement } from '@/internal/part-element'
import { usePartTag } from '@/internal/part-tag'
import { REASONS } from '@/internal/reasons'
import { stringifyAsLabel } from '@/internal/resolve-value-label'
import type { PartProps } from '@/internal/types'
import {
  ComboboxContext,
  ComboboxItemContext,
  ComboboxRowContext,
  type ComboboxItemState
} from './context'

type Props = PartProps & {
  id?: never
  value?: unknown
  index?: number
  disabled?: boolean
  onClick?: (event: MouseEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onKeyup?: (event: KeyboardEvent) => void
  onMousedown?: (event: MouseEvent) => void
  onMousemove?: (event: MouseEvent) => void
  onMouseup?: (event: MouseEvent) => void
  onPointerdown?: (event: PointerEvent) => void
  onPointerleave?: (event: PointerEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  value = null,
  index: indexProp = undefined,
  disabled = false,
  onClick,
  onKeydown,
  onKeyup,
  onMousedown,
  onMousemove,
  onMouseup,
  onPointerdown,
  onPointerleave
} = defineProps<Props>()

defineSlots<{ default?: (state: ComboboxItemState) => any }>()

const combobox = ComboboxContext.get()
const registry = combobox.itemRegistry
const isInRow = ComboboxRowContext.get()
const isDisabled = computed(() => disabled || combobox.disabled.value)
let didPointerDown = false

const element = usePartElement()

const tag = usePartTag({ as: () => as, defaultTag: 'div', element })

watchPostEffect(() => {
  if (!combobox.open.value) didPointerDown = false
})

const resolvedVirtualIndex = computed(
  () =>
    indexProp ??
    findItemIndex(combobox.flatFilteredItems.value, value, combobox.isItemEqualToValue.value)
)

const index = computed(() => {
  if (indexProp != null) return indexProp
  if (combobox.virtualized.value) return resolvedVirtualIndex.value
  return element.value ? registry.indexOf(element.value) : -1
})

const id = computed(() =>
  index.value >= 0 ? `${combobox.rootId.value}-${index.value}` : undefined
)

watch(
  () => [element.value, combobox.virtualized.value, resolvedVirtualIndex.value, value] as const,
  ([node, virtualized, virtualIndex, itemValue], _previous, onCleanup) => {
    if (!node) return
    if (virtualized) {
      if (virtualIndex < 0) return
      onCleanup(registry.registerVirtualItem(virtualIndex, node))
      return
    }
    onCleanup(registry.registerItem(node, { value: itemValue, id: () => id.value }))
  },
  { immediate: true, flush: 'sync' }
)

const selected = computed(() => !combobox.noSelection.value && combobox.isValueSelected(value))
const highlighted = computed(
  () => registry.highlightedIndex.value === index.value && index.value >= 0
)

ComboboxItemContext.set({ selected })

function selectItem(domEvent: Event) {
  const targetEl = getTarget(domEvent)
  const href = isElement(targetEl) ? targetEl.closest('a')?.getAttribute('href') : undefined
  if (href) {
    if (href.startsWith('#')) {
      combobox.setOpen(false, REASONS.itemPress)
    }
    return
  }
  combobox.selectValue(value)
  if (!combobox.multiple.value) {
    const fillsInput = combobox.noSelection.value
      ? combobox.popupElement.value !== null
      : !combobox.inputInsidePopup.value
    if (fillsInput) {
      combobox.setInputValue(
        stringifyAsLabel(value, combobox.itemToStringLabel.value),
        REASONS.itemPress
      )
    }
    combobox.setOpen(false, REASONS.itemPress)
  } else {
    const inputEl = combobox.inputElement.value as HTMLInputElement | null
    const wasFiltering = inputEl ? inputEl.value.trim() !== '' : false
    if (wasFiltering) {
      if (combobox.inputInsidePopup.value) {
        combobox.setInputValue('', REASONS.inputClear)
      } else {
        combobox.setOpen(false, REASONS.itemPress)
      }
    }
  }
  combobox.inputElement.value?.focus()
}

function commitSelection(event: MouseEvent) {
  selectItem(event)
  // `requestSubmit` reads the form synchronously, so the hidden input must already carry the
  // new value.
  if (combobox.submitOnItemClick.value) void nextTick(() => combobox.requestSubmit())
}

function selectOnClick(event: MouseEvent) {
  if (combobox.readOnly.value) return
  commitSelection(event)
}

function highlightOnHover() {
  if (!isDisabled.value && index.value >= 0 && combobox.highlightItemOnHover.value) {
    registry.focusItem(index.value, 'pointer')
  }
}

function clearHighlightOnLeave() {
  if (combobox.keepHighlight.value) return
  if (registry.getItemElement(registry.highlightedIndex.value) !== element.value) return
  registry.setHighlightedIndex(-1, 'pointer')
}

function preventFocusLoss(event: MouseEvent) {
  // iOS Safari can emit a synthetic mousedown for touch taps without a preceding
  // pointerdown. Prevent default here too so tapping an item does not blur the input.
  event.preventDefault()
}

function markPointerDown(event: PointerEvent) {
  if (event.isPrimary) didPointerDown = true
  event.preventDefault()
}

function selectOnMouseUp(event: MouseEvent) {
  const pointerStartedOnItem = didPointerDown
  didPointerDown = false

  if (
    isDisabled.value ||
    combobox.readOnly.value ||
    event.button !== 0 ||
    pointerStartedOnItem ||
    !highlighted.value
  ) {
    return
  }

  commitSelection(event)
}

const button = useButton({
  disabled: isDisabled,
  focusableWhenDisabled: true,
  as: tag,
  composite: true,
  onClick: () => chain(onClick, selectOnClick),
  onMousedown: () => chain(onMousedown, preventFocusLoss),
  onKeydown: () => onKeydown,
  onKeyup: () => onKeyup,
  onPointerdown: () => chain(onPointerdown, markPointerDown)
})

const comboboxState = computed<ComboboxItemState>(() => ({
  selected: selected.value,
  highlighted: highlighted.value,
  disabled: isDisabled.value
}))

const stateAttrs = computed(() => dataAttrs(comboboxState.value))

const ownAttrs = computed(() => ({
  id: id.value,
  role: isInRow ? 'gridcell' : 'option',
  'aria-selected': combobox.noSelection.value ? undefined : selected.value,
  onMousemove: chain(onMousemove, highlightOnHover),
  onMouseup: chain(onMouseup, selectOnMouseUp),
  onPointerleave: chain(onPointerleave, clearHighlightOnLeave)
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(button.attrs.value, stateAttrs, ownAttrs, $attrs)"
  >
    <slot v-bind="comboboxState" />
  </component>
</template>
