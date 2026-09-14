import {
  computed,
  onScopeDispose,
  shallowRef,
  toValue,
  watch,
  watchEffect,
  watchPostEffect,
  type ComputedRef,
  type MaybeRefOrGetter
} from 'vue'
import { FieldContext } from '@/components/field/context'
import { isAndroid, isGecko } from '@/internal/detect-browser'
import { DirectionContext } from '@/internal/direction-context'
import { LabelableContext } from '@/internal/labelable-context'
import { REASONS } from '@/internal/reasons'
import { isTypedInput, type ComboboxRoot } from './combobox'
import {
  ComboboxChipsContext,
  ComboboxPositionerContext,
  type ComboboxChipsContextValue
} from './context'

type ComboboxInputOptions = {
  ref: MaybeRefOrGetter<HTMLElement | null>
  id: MaybeRefOrGetter<string | undefined>
  uid: MaybeRefOrGetter<string>
  disabled: MaybeRefOrGetter<boolean>
}

export type ComboboxInput = {
  insidePopup: ComputedRef<boolean>
  id: ComputedRef<string>
  disabled: ComputedRef<boolean>
  highlightedItemId: ComputedRef<string | undefined>
  onCompositionstart: () => void
  onCompositionend: (event: CompositionEvent) => void
  onFocus: () => void
  onClick: (event: MouseEvent) => void
  onBlur: () => void
  onInput: (event: Event) => void
  onKeydown: (event: KeyboardEvent) => void
}

export function useComboboxInput(
  combobox: ComboboxRoot,
  options: ComboboxInputOptions
): ComboboxInput {
  const field = FieldContext.getOr()
  const labelable = LabelableContext.get()
  const chips = ComboboxChipsContext.getOr()
  const direction = DirectionContext.get()
  const insidePositioner = ComboboxPositionerContext.getOr() != null

  let isComposing = false
  const composingValue = shallowRef<string | null>(null)
  let highlightToRestore: number | null = null

  const insidePopup = computed(() => insidePositioner || combobox.inline.value)

  const id = computed(
    () =>
      toValue(options.id) ??
      (!insidePopup.value ? combobox.rootId.value : undefined) ??
      toValue(options.uid)
  )

  const disabled = computed(() => toValue(options.disabled) || combobox.disabled.value)

  const highlightedItemId = computed(() => {
    const registry = combobox.itemRegistry
    return registry.highlightedIndex.value < 0
      ? undefined
      : registry.getItemId(registry.highlightedIndex.value)
  })

  const inputElement = computed(() => toValue(options.ref) as HTMLInputElement | null)

  const rtl = computed(() => direction.direction.value === 'rtl')
  const backwardArrowKey = computed(() => (rtl.value ? 'ArrowRight' : 'ArrowLeft'))
  const forwardArrowKey = computed(() => (rtl.value ? 'ArrowLeft' : 'ArrowRight'))

  watchEffect(() => {
    combobox.inputInsidePopup.value = insidePopup.value
  })
  onScopeDispose(() => {
    combobox.inputInsidePopup.value = true
  })

  watch(
    () => id.value,
    (currentId, _previous, onCleanup) => {
      onCleanup(labelable.registerControlId(currentId))
    },
    { immediate: true, flush: 'sync' }
  )

  watch(
    () => toValue(options.ref),
    (element, _previous, onCleanup) => {
      if (!element) return
      combobox.inputElement.value = element
      if (insidePopup.value && !combobox.hasInputValue) {
        combobox.setInputValue('', REASONS.none)
      }
      onCleanup(() => {
        combobox.inputElement.value = null
      })
    },
    { immediate: true, flush: 'sync' }
  )

  watchPostEffect(() => {
    const node = inputElement.value
    if (!node) return
    const next = composingValue.value ?? combobox.inputValue.value
    if (node.value !== next) node.value = next
  })

  function onCompositionstart(): void {
    // Android with some keyboards (e.g. Samsung with predictive text on) reports all text as
    // always-composing, so composition state can't gate anything there.
    if (isAndroid) return
    isComposing = true
    composingValue.value = inputElement.value?.value ?? null
  }

  function onCompositionend(event: CompositionEvent): void {
    isComposing = false
    const next = inputElement.value?.value ?? ''
    composingValue.value = null
    combobox.setInputValue(next, REASONS.inputChange, event)
  }

  function onFocus(): void {
    if (field) field.focused.value = true

    if (combobox.inline.value && highlightToRestore != null) {
      const index = highlightToRestore
      highlightToRestore = null
      if (index < combobox.flatFilteredItems.value.length) {
        combobox.itemRegistry.setHighlightedIndex(index)
      }
    }
  }

  function onClick(event: MouseEvent): void {
    combobox.openInteractionHandlers.onClick(event)
    if (!disabled.value && !combobox.readOnly.value && combobox.openOnInputClick.value) {
      combobox.setOpen(true)
    }
  }

  function onBlur(): void {
    const registry = combobox.itemRegistry
    const activeIndex = registry.highlightedIndex.value
    if (combobox.inline.value && activeIndex >= 0 && combobox.autoHighlight.value !== 'always') {
      highlightToRestore = activeIndex
      registry.setHighlightedIndex(-1)
    }

    field?.commitOnBlur(
      combobox.noSelection.value ? combobox.inputValue.value : combobox.value.value
    )
  }

  function onInput(event: Event): void {
    const registry = combobox.itemRegistry
    const composing = isComposing
    const canOpen =
      !disabled.value && !combobox.readOnly.value && (composing || isTypedInput(event))
    const next = inputElement.value?.value ?? ''

    if (composing) {
      composingValue.value = next
    } else {
      combobox.setInputValue(next, REASONS.inputChange, event)

      if (
        next === '' &&
        !combobox.multiple.value &&
        !combobox.noSelection.value &&
        !combobox.inputInsidePopup.value
      ) {
        combobox.setValue(null)
      }
    }

    if (next.trim() !== '' && canOpen && !combobox.open.value) {
      combobox.setOpen(true, REASONS.inputChange)
    } else if (
      next === '' &&
      !combobox.openOnInputClick.value &&
      !combobox.inputInsidePopup.value
    ) {
      combobox.setOpen(false, REASONS.inputClear)
    }

    const keepsHighlight = combobox.autoHighlight.value && (!composing || next.trim() !== '')
    if (combobox.open.value && registry.highlightedIndex.value !== -1 && !keepsHighlight) {
      registry.setHighlightedIndex(-1)
    }
  }

  function focusChip(context: ComboboxChipsContextValue, index: number | undefined): void {
    context.highlightedIndex.value = index
    if (index !== undefined) context.elements.value[index]?.focus()
  }

  function enterChipsFromInput(event: KeyboardEvent, context: ComboboxChipsContextValue): boolean {
    if (event.key !== backwardArrowKey.value) return false
    if ((inputElement.value?.selectionStart ?? 0) !== 0) return false
    if (combobox.selectedValues.value.length === 0) return false

    event.preventDefault()
    const elements = context.elements.value
    focusChip(context, elements.length > 0 ? elements.length - 1 : undefined)
    return true
  }

  function navigateChips(
    event: KeyboardEvent,
    context: ComboboxChipsContextValue,
    index: number
  ): boolean {
    if (event.key === backwardArrowKey.value) {
      event.preventDefault()
      focusChip(context, index > 0 ? index - 1 : undefined)
      return true
    }
    if (event.key === forwardArrowKey.value) {
      event.preventDefault()
      focusChip(context, index < context.elements.value.length - 1 ? index + 1 : undefined)
      return true
    }
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault()
      const chipCount = combobox.selectedValues.value.length
      const nextIndex = index >= chipCount - 1 ? chipCount - 2 : index
      combobox.itemRegistry.setHighlightedIndex(-1)
      focusChip(context, nextIndex >= 0 ? nextIndex : undefined)
      return true
    }
    return false
  }

  function consumedByChips(event: KeyboardEvent): boolean {
    if (!chips) return false
    const highlightedIndex = chips.highlightedIndex.value
    if (highlightedIndex === undefined) return enterChipsFromInput(event, chips)
    return navigateChips(event, chips, highlightedIndex)
  }

  function onKeydown(event: KeyboardEvent): void {
    const registry = combobox.itemRegistry
    const inputEl = inputElement.value!

    if (disabled.value || combobox.readOnly.value) return

    if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) return

    if (consumedByChips(event)) return

    if (
      chips &&
      event.key === 'Backspace' &&
      combobox.multiple.value &&
      inputEl.value === '' &&
      combobox.selectedValues.value.length > 0
    ) {
      const chipsCount = chips.elements.value.length
      const removalIndex =
        chipsCount > 0 ? chipsCount - 1 : combobox.selectedValues.value.length - 1
      combobox.removeSelectedValueAt(removalIndex)
    }

    if (event.isComposing && event.key.startsWith('Arrow')) return

    if (
      combobox.grid.value &&
      registry.highlightedIndex.value >= 0 &&
      (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
    ) {
      event.preventDefault()
      if (!combobox.open.value) return
      const dir = event.key === forwardArrowKey.value ? 1 : -1
      registry.focusItem(registry.stepIndex(registry.highlightedIndex.value, dir))
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!combobox.open.value) {
        combobox.pendingOpenHighlight.current = 'first'
        combobox.setOpen(true, REASONS.listNavigation)
        // Items only register once the popup mounts, so there is nothing to move to yet.
        if (combobox.focusItemOnOpen.value && combobox.itemRegistry.count.value === 0) {
          registry.setHighlightedIndex(0)
        }
      }
      registry.moveHighlight(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!combobox.open.value) {
        combobox.pendingOpenHighlight.current = 'last'
        combobox.setOpen(true, REASONS.listNavigation)
      }
      registry.moveHighlight(-1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      event.stopPropagation()
      const cursor = isGecko && rtl.value ? inputEl.value.length : 0
      inputEl.setSelectionRange(cursor, cursor)
      inputEl.scrollLeft = 0
    } else if (event.key === 'End') {
      event.preventDefault()
      event.stopPropagation()
      const scrollAmount = inputEl.scrollWidth - inputEl.clientWidth
      const cursor = isGecko && rtl.value ? 0 : inputEl.value.length
      inputEl.setSelectionRange(cursor, cursor)
      inputEl.scrollLeft = rtl.value ? -scrollAmount : scrollAmount
    } else if (event.key === 'Enter') {
      if (event.isComposing) return
      if (combobox.open.value) {
        if (registry.highlightedIndex.value < 0) {
          if (!combobox.inline.value) combobox.setOpen(false, REASONS.none)
          return
        }
        event.preventDefault()
        event.stopPropagation()
        registry.getItemElement(registry.highlightedIndex.value)?.click()
      }
    } else if (event.key === 'Escape') {
      if (combobox.open.value) {
        combobox.setOpen(false, REASONS.escapeKey)
        // The dismiss listener sits on the document, so by the time it could stop propagation
        // the event has already passed every ancestor. Only the input is early enough.
        if (!combobox.inline.value && !combobox.escapeKeyBubbles.value) event.stopPropagation()
      } else if (!combobox.mounted.value) {
        const isClear = combobox.multiple.value
          ? !combobox.hasSelectedValue.value
          : combobox.value.value === null

        combobox.setInputValue('', REASONS.escapeKey)
        if (!combobox.noSelection.value) combobox.setValue(combobox.multiple.value ? [] : null)
        if (!isClear && !combobox.inline.value) event.stopPropagation()
      }
    }
  }

  return {
    insidePopup,
    id,
    disabled,
    highlightedItemId,
    onCompositionstart,
    onCompositionend,
    onFocus,
    onClick,
    onBlur,
    onInput,
    onKeydown
  }
}
