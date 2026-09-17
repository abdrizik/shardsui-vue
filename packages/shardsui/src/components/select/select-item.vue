<script setup lang="ts">
import { computed, mergeProps, watch } from 'vue'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { contains, isHTMLElement } from '@/internal/dom'
import { isVirtualClick } from '@/internal/floating/event'
import { removeItem } from '@/internal/item-equality'
import { usePartElement } from '@/internal/part-element'
import { usePartTag } from '@/internal/part-tag'
import { REASONS } from '@/internal/reasons'
import type { PartProps } from '@/internal/types'
import { SelectContext, SelectItemContext, type SelectItemState } from './context'

type Props = PartProps & {
  id?: never
  value?: unknown
  disabled?: boolean
  onClick?: (event: MouseEvent) => void
  onMousedown?: (event: MouseEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onKeyup?: (event: KeyboardEvent) => void
  onPointerenter?: (event: PointerEvent) => void
  onPointermove?: (event: PointerEvent) => void
  onPointerdown?: (event: PointerEvent) => void
  onMouseup?: (event: MouseEvent) => void
  onMousemove?: (event: MouseEvent) => void
  onPointerleave?: (event: PointerEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  value = null,
  disabled = false,
  onClick,
  onMousedown,
  onKeydown,
  onKeyup,
  onPointerenter,
  onPointermove,
  onPointerdown,
  onMouseup,
  onMousemove,
  onPointerleave
} = defineProps<Props>()

defineSlots<{ default?: (state: SelectItemState) => any }>()

const select = SelectContext.get()
const registry = select.itemRegistry

const element = usePartElement()

const tag = usePartTag({ as: () => as, defaultTag: 'div', element })

const isDisabled = computed(() => disabled || select.disabled.value)
let pointerType = 'mouse'
let allowMouseSelection = false

const itemValue = computed(() => value)

watch(
  () => [element.value, itemValue.value] as const,
  ([node], _previous, onCleanup) => {
    if (!node) return
    onCleanup(registry.registerItem(node, { value: itemValue.value }))
  },
  { immediate: true, flush: 'sync' }
)

const index = computed(() => (element.value ? registry.indexOf(element.value) : -1))
const selected = computed(() => select.isValueSelected(itemValue.value))
const highlighted = computed(
  () => registry.highlightedIndex.value === index.value && index.value >= 0
)

SelectItemContext.set({ selected })

function commitSelection(event: Event) {
  if (select.disabled.value || select.readOnly.value) return
  if (select.multiple.value) {
    select.setValue(
      selected.value
        ? removeItem(select.selectedValues.value, itemValue.value, select.isItemEqualToValue.value)
        : [...select.selectedValues.value, itemValue.value]
    )
  } else {
    select.setValue(itemValue.value)
    select.setOpen(false, REASONS.itemPress, event)
  }
}

function highlightOnKeyDown(event: KeyboardEvent) {
  registry.highlightedIndex.value = index.value

  if (event.key === ' ' && select.typing) {
    event.preventDefault()
  }
}

function isBlockedMouseClick(event: MouseEvent) {
  if (pointerType === 'touch') return false
  const isActivatingVirtualClick =
    isVirtualClick(event) && ('pointerType' in event || highlighted.value)
  return !isActivatingVirtualClick && !allowMouseSelection
}

function selectOnClick(event: MouseEvent) {
  // Safari leaves focus where it was when a non-button element is clicked.
  element.value?.focus({ preventScroll: true })

  const blockedMouseClick = isBlockedMouseClick(event)
  allowMouseSelection = false

  if (blockedMouseClick) return

  commitSelection(event)
}

function trackPointerType(event: PointerEvent) {
  pointerType = event.pointerType
}

function trackDragDistance(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || event.buttons !== 1) return

  const selection = select.mouseUpSelection
  selection.dragY += event.movementY
  if (selection.dragY ** 2 >= 64) selection.allowUnselected = true
}

function beginMouseSelection(event: PointerEvent) {
  pointerType = event.pointerType
  allowMouseSelection = true
  select.mouseUpSelection.dragY = 0
}

function selectOnMouseUp() {
  select.mouseUpSelection.dragY = 0

  if (isDisabled.value || pointerType === 'touch') return
  if (allowMouseSelection) return

  const allowed = selected.value
    ? select.mouseUpSelection.allowSelected
    : select.mouseUpSelection.allowUnselected
  if (!allowed) return

  allowMouseSelection = true
  element.value?.click()
  allowMouseSelection = false
}

function highlightOnHover() {
  if (isDisabled.value || !select.highlightItemOnHover.value || index.value < 0) return
  if (registry.highlightedIndex.value === index.value) return
  select.isPointerModality = true
  registry.highlightedIndex.value = index.value
}

function clearHighlightOnLeave(event: PointerEvent) {
  if (!select.open.value || !select.isPointerModality || event.pointerType === 'touch') return
  if (!select.highlightItemOnHover.value) return

  const relatedTarget = event.relatedTarget
  if (isHTMLElement(relatedTarget) && registry.indexOf(relatedTarget) !== -1) return

  registry.highlightedIndex.value = -1

  const popup = select.popupElement.value
  if (!popup) return
  if (contains(popup, popup.ownerDocument.activeElement)) {
    popup.focus({ preventScroll: true })
  }
}

const button = useButton({
  disabled: isDisabled,
  as: tag,
  composite: true,
  focusableWhenDisabled: true,
  onClick: () => chain(onClick, selectOnClick),
  onMousedown: () => onMousedown,
  onKeydown: () => chain(onKeydown, highlightOnKeyDown),
  onKeyup: () => onKeyup,
  onPointerdown: () => chain(onPointerdown, beginMouseSelection)
})

const selectState = computed<SelectItemState>(() => ({
  selected: selected.value,
  highlighted: highlighted.value,
  disabled: isDisabled.value
}))

const stateAttrs = computed(() => dataAttrs(selectState.value))

const ownAttrs = computed(() => ({
  role: 'option',
  'aria-selected': selected.value,
  tabindex: select.open.value && highlighted.value ? 0 : -1,
  onPointerenter: chain(onPointerenter, trackPointerType),
  onPointermove: chain(onPointermove, trackDragDistance),
  onMouseup: chain(onMouseup, selectOnMouseUp),
  onMousemove: chain(onMousemove, highlightOnHover),
  onPointerleave: chain(onPointerleave, clearHighlightOnLeave)
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(button.attrs.value, stateAttrs, ownAttrs, $attrs)"
  >
    <slot v-bind="selectState" />
  </component>
</template>
