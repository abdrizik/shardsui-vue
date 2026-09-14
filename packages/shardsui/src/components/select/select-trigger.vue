<script setup lang="ts">
import {
  computed,
  mergeProps,
  onScopeDispose,
  onWatcherCleanup,
  useTemplateRef,
  watchEffect,
  watchPostEffect
} from 'vue'
import { FieldContext } from '@/components/field/context'
import { getFieldAriaInvalid, getFieldState, getFieldStateAttrs } from '@/components/field/field'
import { ToolbarContext } from '@/components/toolbar/context'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { contains } from '@/internal/dom'
import { useCompositeItem } from '@/internal/floating/composite'
import { createTriggerFocusGuards } from '@/internal/floating/trigger-focus-guards'
import { createTypeahead } from '@/internal/floating/typeahead'
import FocusGuard from '@/internal/focus-guard.vue'
import { LabelableContext } from '@/internal/labelable-context'
import { mergeDescribedBy } from '@/internal/labelable'
import { REASONS } from '@/internal/reasons'
import { createTimeout } from '@/internal/timeout'
import type { PartProps } from '@/internal/types'
import { SelectContext, type SelectTriggerState } from './context'

// Opening the popup can place an item under the cursor: mouseup selection stays disabled this
// long so releasing over an item doesn't commit an accidental selection.
const MOUSE_UP_SELECTION_DELAY_MS = 400
const OPEN_KEYS = new Set(['ArrowDown', 'ArrowUp', 'Enter', ' '])

type Props = PartProps & {
  id?: string
  disabled?: boolean
  tabindex?: number
  ariaDescribedby?: string
  onClick?: (event: MouseEvent) => void
  onMousedown?: (event: MouseEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onKeyup?: (event: KeyboardEvent) => void
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
  onFocusout?: (event: FocusEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'button',
  id: idProp,
  disabled = false,
  tabindex: tabindexProp = undefined,
  ariaDescribedby: ariaDescribedByProp = undefined,
  onClick,
  onMousedown,
  onKeydown,
  onKeyup,
  onFocus,
  onBlur,
  onFocusout
} = defineProps<Props>()

defineSlots<{ default?: (state: SelectTriggerState) => any }>()

const select = SelectContext.get()
const registry = select.itemRegistry
const field = FieldContext.getOr()
const labelable = LabelableContext.get()

const element = useTemplateRef<HTMLElement>('element')
const afterGuard = useTemplateRef<InstanceType<typeof FocusGuard>>('afterGuard')

const id = computed(() => idProp ?? select.rootId.value)
const isDisabled = computed(() => disabled || select.disabled.value)
const ariaDescribedBy = computed(() =>
  mergeDescribedBy(ariaDescribedByProp, labelable.messageIds.value)
)

watchPostEffect(() => {
  select.triggerElement.value = element.value
  onWatcherCleanup(() => {
    select.triggerElement.value = null
  })
})

watchPostEffect(() => {
  const guard = afterGuard.value?.element ?? null
  select.triggerFocusTargetElement.value = guard
  onWatcherCleanup(() => {
    if (select.triggerFocusTargetElement.value === guard) {
      select.triggerFocusTargetElement.value = null
    }
  })
})

watchEffect(() => {
  onWatcherCleanup(labelable.registerControlId(id.value))
})

const mouseUpSelectionTimeout = createTimeout()
onScopeDispose(mouseUpSelectionTimeout.clear)

const toolbar = ToolbarContext.getOr()

const item = toolbar
  ? useCompositeItem({
      composite: toolbar.composite,
      ref: element,
      disabled: isDisabled
    })
  : undefined

watchPostEffect(() => {
  if (select.open.value) {
    mouseUpSelectionTimeout.start(MOUSE_UP_SELECTION_DELAY_MS, () => {
      select.mouseUpSelection.allowUnselected = true
      select.mouseUpSelection.allowSelected = true
    })

    onWatcherCleanup(() => {
      mouseUpSelectionTimeout.clear()
    })
    return
  }

  select.mouseUpSelection.allowSelected = false
  select.mouseUpSelection.allowUnselected = false
  select.mouseUpSelection.dragY = 0
})

const lastSelected = computed(() =>
  select.multiple.value ? select.selectedValues.value.at(-1) : select.value.value
)
const selectedIndex = computed(() =>
  select.multiple.value && select.selectedValues.value.length === 0
    ? -1
    : registry.findByValue(lastSelected.value)
)

const closedTypeahead = createTypeahead({
  enabled: () => !select.disabled.value && !select.readOnly.value && !select.multiple.value,
  items: () => registry.labels(),
  activeIndex: selectedIndex,
  selectedIndex: () => (selectedIndex.value >= 0 ? selectedIndex.value : null),
  open: select.open,
  referenceElement: element,
  floatingElement: select.positionerElement,
  // Native `<select>` skips disabled options while typing.
  isIndexDisabled: (index) => registry.isItemDisabled(index),
  onMatch: (index) => {
    const matched = registry.getValueAtIndex(index)
    if (matched === undefined) return
    select.setValue(matched)
  }
})

const selectState = computed<SelectTriggerState>(() => ({
  ...getFieldState(field),
  open: select.open.value,
  disabled: isDisabled.value,
  readOnly: select.readOnly.value,
  popupSide: select.popupSide.value,
  value: select.value.value,
  placeholder: !select.hasValue.value
}))

const stateAttrs = computed(() =>
  dataAttrs({
    'popup-open': select.open.value,
    pressed: select.open.value,
    disabled: isDisabled.value,
    readonly: select.readOnly.value,
    placeholder: !select.hasValue.value,
    'popup-side': select.popupSide.value,
    ...getFieldStateAttrs(field)
  })
)

function toggleOpen(event: MouseEvent) {
  if (select.readOnly.value) return
  select.openInteractionHandlers.onClick(event)
  select.setOpen(!select.open.value, REASONS.triggerPress, event)
}

function openOnKey(event: KeyboardEvent) {
  if (select.readOnly.value) return
  if (OPEN_KEYS.has(event.key)) {
    event.preventDefault()
    if (!select.open.value) select.setOpen(true, REASONS.triggerPress, event)
  } else if (!select.open.value) {
    closedTypeahead.matchKey(event)
  }
}

function markFieldFocused() {
  if (field) field.focused.value = true
  select.forceMount.value = true
}

function commitFieldOnBlur(event: FocusEvent) {
  if (contains(select.positionerElement.value, event.relatedTarget as Node | null)) return
  field?.commitOnBlur(select.value.value)
}

const guards = createTriggerFocusGuards({
  close: (event) => select.setOpen(false, REASONS.focusOut, event),
  positionerElement: select.positionerElement,
  popupElement: select.popupElement,
  triggerFocusTargetElement: select.triggerFocusTargetElement,
  preFocusGuardElement: null
})

const button = useButton({
  disabled: isDisabled,
  as: () => as,
  composite: () => !!toolbar,
  tabindex: () => tabindexProp,
  onClick: () => chain(onClick, toggleOpen),
  onMousedown: () => onMousedown,
  onKeydown: () => chain(onKeydown, openOnKey),
  onKeyup: () => onKeyup,
  onPointerdown: () => select.openInteractionHandlers.onPointerdown
})

const ownAttrs = computed(() => ({
  id: id.value,
  role: 'combobox',
  'aria-haspopup': 'listbox',
  'aria-expanded': select.open.value,
  'aria-controls': select.open.value ? (select.listId.value ?? select.popupId.value) : undefined,
  'aria-labelledby': labelable.labelId.value ?? select.labelId.value,
  'aria-required': select.required.value || undefined,
  'aria-readonly': select.readOnly.value || undefined,
  'aria-describedby': ariaDescribedBy.value,
  'aria-invalid': getFieldAriaInvalid(field, isDisabled.value),
  ...(item ? { tabindex: item.tabindex.value } : undefined),
  onFocus: chain(onFocus, item?.onFocus, markFieldFocused),
  onBlur: chain(onBlur, commitFieldOnBlur),
  onFocusout: chain(onFocusout, closedTypeahead.resetOnFocusLeave)
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
  <FocusGuard v-if="select.open.value" ref="afterGuard" @focus="guards.closeAndFocusAfter" />
</template>
