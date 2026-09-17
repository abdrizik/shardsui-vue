<script setup lang="ts">
import { computed, mergeProps, onScopeDispose, watch } from 'vue'
import { FieldContext } from '@/components/field/context'
import { getFieldAriaInvalid, getFieldState, getFieldStateAttrs } from '@/components/field/field'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { contains, getTarget, listen } from '@/internal/dom'
import { createTypeahead } from '@/internal/floating/typeahead'
import { LabelableContext } from '@/internal/labelable-context'
import { usePartElement } from '@/internal/part-element'
import { usePartTag } from '@/internal/part-tag'
import { isMouseWithinBounds } from '@/internal/pseudo-element-bounds'
import { REASONS } from '@/internal/reasons'
import { createTimeout } from '@/internal/timeout'
import type { PartProps } from '@/internal/types'
import { ComboboxContext, type ComboboxTriggerState } from './context'

type Props = PartProps & {
  id?: string
  disabled?: boolean
  onClick?: (event: MouseEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onKeyup?: (event: KeyboardEvent) => void
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
  onFocusout?: (event: FocusEvent) => void
  onMousedown?: (event: MouseEvent) => void
  onPointerdown?: (event: PointerEvent) => void
  onPointerenter?: (event: PointerEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'button',
  id: idProp,
  disabled = false,
  onClick,
  onKeydown,
  onKeyup,
  onFocus,
  onBlur,
  onFocusout,
  onMousedown,
  onPointerdown,
  onPointerenter
} = defineProps<Props>()

defineSlots<{ default?: (state: ComboboxTriggerState) => any }>()

const combobox = ComboboxContext.get()
const field = FieldContext.getOr()
const labelable = LabelableContext.get()

const element = usePartElement()

const tag = usePartTag({ as: () => as, defaultTag: 'button', element })

watch(
  () => element.value,
  (node) => {
    combobox.triggerElement.value = node ?? null
  },
  { immediate: true, flush: 'sync' }
)

const id = computed(() =>
  combobox.inputInsidePopup.value ? (idProp ?? combobox.rootId.value) : idProp
)

const isDisabled = computed(() => disabled || combobox.disabled.value)

let currentPointerType = ''

const ariaControls = computed(() => {
  if (!combobox.open.value) return undefined
  if (combobox.inputInsidePopup.value)
    return combobox.popupId.value ?? `${combobox.rootId.value}-popup`
  return combobox.listId.value
})

const ariaLabelledBy = computed(() => labelable.labelId.value ?? combobox.labelId.value)

const selectedIdx = computed(() => combobox.findByValue(combobox.value.value))
const labels = computed(() => combobox.itemLabels())

const closedTypeahead = createTypeahead({
  enabled: () =>
    !combobox.open.value &&
    !combobox.readOnly.value &&
    !isDisabled.value &&
    !combobox.multiple.value &&
    !combobox.noSelection.value,
  items: labels,
  activeIndex: selectedIdx,
  selectedIndex: () => (selectedIdx.value >= 0 ? selectedIdx.value : null),
  open: combobox.open,
  referenceElement: () =>
    combobox.inputInsidePopup.value ? element.value : combobox.inputElement.value,
  floatingElement: combobox.positionerElement,
  onMatch: (index) => {
    const matched = combobox.getValueAtIndex(index)
    if (matched === undefined) return
    combobox.setValue(matched)
  }
})

function markFieldFocused() {
  if (field) field.focused.value = true
}

const focusTimeout = createTimeout()
onScopeDispose(focusTimeout.clear)

function forceMountItems() {
  if (isDisabled.value || combobox.readOnly.value) return
  if (!combobox.hasItems.value) combobox.forceMount.value = true
}

function forceMountItemsOnFocus() {
  focusTimeout.start(0, forceMountItems)
}

function commitFieldOnBlur(event: FocusEvent) {
  if (contains(combobox.positionerElement.value, event.relatedTarget)) return

  field?.commitOnBlur(combobox.noSelection.value ? combobox.inputValue.value : combobox.value.value)
}

function toggleOpen(event: MouseEvent) {
  if (combobox.readOnly.value) return
  combobox.openInteractionHandlers.onClick(event)
  combobox.setOpen(!combobox.open.value, REASONS.triggerPress)
}

function trackPointerType(event: PointerEvent) {
  currentPointerType = event.pointerType
}

function focusInputFromTrigger(event: MouseEvent) {
  if (isDisabled.value || combobox.readOnly.value) return

  forceMountItems()

  if (currentPointerType !== 'touch') {
    combobox.inputElement.value?.focus()
    if (!combobox.inputInsidePopup.value) {
      event.preventDefault()
    }
  }

  if (combobox.open.value) return

  if (combobox.inputInsidePopup.value) {
    const doc = element.value?.ownerDocument ?? document
    listen(
      doc,
      'mouseup',
      (mouseEvent: MouseEvent) => {
        const node = element.value
        if (!node) return
        const positioner = combobox.positionerElement.value
        const target = getTarget(mouseEvent)

        if (
          contains(node, target) ||
          contains(positioner, target) ||
          contains(combobox.listElement.value, target)
        ) {
          return
        }

        if (isMouseWithinBounds(mouseEvent, node)) return

        combobox.setOpen(false, REASONS.cancelOpen)
      },
      { once: true }
    )
  }
}

function openOnKey(event: KeyboardEvent) {
  if (combobox.readOnly.value) return
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    event.stopPropagation()
    combobox.setOpen(true, REASONS.listNavigation)
    combobox.inputElement.value?.focus()
    return
  }
  closedTypeahead.matchKey(event)
}

const button = useButton({
  disabled: isDisabled,
  as: tag,
  tabindex: () => (combobox.inputInsidePopup.value ? 0 : -1),
  onClick: () => chain(onClick, toggleOpen),
  onMousedown: () => chain(onMousedown, focusInputFromTrigger),
  onKeydown: () => chain(onKeydown, openOnKey),
  onKeyup: () => onKeyup,
  onPointerdown: () =>
    chain(onPointerdown, trackPointerType, combobox.openInteractionHandlers.onPointerdown)
})

const comboboxState = computed<ComboboxTriggerState>(() => ({
  ...getFieldState(field),
  open: combobox.open.value,
  disabled: isDisabled.value,
  popupSide: combobox.popupSide.value,
  listEmpty: combobox.isEmpty.value,
  placeholder: combobox.showsPlaceholder.value
}))

const stateAttrs = computed(() =>
  dataAttrs({
    'popup-open': combobox.open.value,
    pressed: combobox.open.value,
    disabled: isDisabled.value,
    'popup-side': combobox.popupSide.value ?? undefined,
    'list-empty': combobox.isEmpty.value,
    placeholder: combobox.showsPlaceholder.value,
    ...getFieldStateAttrs(field)
  })
)

const ownAttrs = computed(() => ({
  id: id.value,
  role: combobox.inputInsidePopup.value ? 'combobox' : undefined,
  'aria-haspopup': combobox.inputInsidePopup.value ? 'dialog' : 'listbox',
  'aria-expanded': combobox.open.value,
  'aria-controls': ariaControls.value,
  'aria-required': combobox.inputInsidePopup.value
    ? combobox.required.value || undefined
    : undefined,
  'aria-invalid': getFieldAriaInvalid(field, isDisabled.value),
  'aria-labelledby': ariaLabelledBy.value,
  onFocus: chain(onFocus, markFieldFocused, forceMountItemsOnFocus),
  onBlur: chain(onBlur, commitFieldOnBlur),
  onFocusout: chain(onFocusout, closedTypeahead.resetOnFocusLeave),
  onPointerenter: chain(onPointerenter, trackPointerType)
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
