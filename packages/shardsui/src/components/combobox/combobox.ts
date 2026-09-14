import { getOverflowAncestors, isHTMLElement } from '@floating-ui/utils/dom'
import {
  computed,
  nextTick,
  onWatcherCleanup,
  shallowRef,
  toValue,
  watch,
  watchPostEffect,
  type ComputedRef,
  type MaybeRefOrGetter,
  type ShallowRef
} from 'vue'
import { FieldContext } from '@/components/field/context'
import { FormContext } from '@/components/form/context'
import { areArraysEqual } from '@/internal/are-arrays-equal'
import { contains } from '@/internal/dom'
import type { Side } from '@/internal/floating/anchor-positioning'
import {
  compareItemEquality,
  findItemIndex,
  type ItemEqualityComparer
} from '@/internal/item-equality'
import { openChangeComplete } from '@/internal/open-change-complete'
import {
  useOpenInteractionHandlers,
  type OpenInteractionHandlers
} from '@/internal/open-interaction-handlers'
import { REASONS, type ChangeEventReason } from '@/internal/reasons'
import {
  isGroupedItems,
  stringifyAsLabel,
  stringifyAsValue,
  type Group
} from '@/internal/resolve-value-label'
import { isScrollable } from '@/internal/scrollable'
import { useTransitionStatus, type TransitionStatus } from '@/internal/transition-status'
import { useComboboxFilter } from './filter'
import {
  createComboboxItemRegistry,
  type ComboboxItemRegistry,
  type HighlightReason
} from './item-registry'

export type ComboboxRootOptions = {
  id: MaybeRefOrGetter<string>
  value: () => unknown
  setValue: (value: unknown) => void
  inputValue: MaybeRefOrGetter<string | undefined>
  setInputValue: (value: string) => void
  open: MaybeRefOrGetter<boolean>
  setOpen: (next: boolean) => void
  onOpenChangeComplete?: () => ((open: boolean) => void) | undefined
  name: MaybeRefOrGetter<string | undefined>
  form: MaybeRefOrGetter<string | undefined>
  disabled: MaybeRefOrGetter<boolean>
  readOnly: MaybeRefOrGetter<boolean>
  required: MaybeRefOrGetter<boolean>
  modal: MaybeRefOrGetter<boolean>
  loopFocus: MaybeRefOrGetter<boolean>
  grid: MaybeRefOrGetter<boolean>
  isItemEqualToValue: () => ItemEqualityComparer
  selectionMode: MaybeRefOrGetter<'single' | 'multiple' | 'none' | undefined>
  openOnInputClick: MaybeRefOrGetter<boolean>
  autoHighlight: MaybeRefOrGetter<boolean | 'always'>
  highlightItemOnHover: MaybeRefOrGetter<boolean>
  keepHighlight: MaybeRefOrGetter<boolean>
  onItemHighlighted?: () =>
    | ((highlightedValue: unknown, reason: HighlightReason, index: number) => void)
    | undefined
  itemToStringValue: () => ((item: unknown) => string) | undefined
  itemToStringLabel: () => ((item: unknown) => string) | undefined
  items: MaybeRefOrGetter<readonly unknown[] | readonly Group<unknown>[] | undefined>
  filteredItems: MaybeRefOrGetter<readonly unknown[] | readonly Group<unknown>[] | undefined>
  filter: () =>
    | null
    | ((item: unknown, query: string, itemToString?: (item: unknown) => string) => boolean)
    | undefined
  limit: MaybeRefOrGetter<number>
  locale: MaybeRefOrGetter<Intl.LocalesArgument>
  inline: MaybeRefOrGetter<boolean>
  autoComplete: MaybeRefOrGetter<'list' | 'both' | 'inline' | 'none'>
  submitOnItemClick: MaybeRefOrGetter<boolean>
  virtualized: MaybeRefOrGetter<boolean>
}

// Autofill omits `inputType` in Chrome and reports `insertReplacementText` in Firefox.
export function isTypedInput(event: Event | undefined): boolean {
  if (!event) return true
  if (event.type === 'compositionend') return true
  const inputType = event instanceof InputEvent ? event.inputType : undefined
  return inputType != null && inputType !== '' && inputType !== 'insertReplacementText'
}

export type ComboboxRoot = {
  inputElement: ShallowRef<HTMLElement | null>
  hiddenInputElement: ShallowRef<HTMLInputElement | null>
  triggerElement: ShallowRef<HTMLElement | null>
  clearElement: ShallowRef<HTMLElement | null>
  chipsContainerElement: ShallowRef<HTMLElement | null>
  inputGroupElement: ShallowRef<HTMLElement | null>
  startDismissElement: ShallowRef<HTMLElement | null>
  endDismissElement: ShallowRef<HTMLElement | null>
  inputInsidePopup: ShallowRef<boolean>
  positionerElement: ShallowRef<HTMLElement | null>
  popupElement: ShallowRef<HTMLElement | null>
  listElement: ShallowRef<HTMLElement | null>
  emptyElement: ShallowRef<HTMLElement | null>
  listId: ShallowRef<string | undefined>
  popupId: ShallowRef<string | undefined>
  labelId: ShallowRef<string | undefined>
  popupSide: ShallowRef<Side | null>
  forceMount: ShallowRef<boolean>
  openChangeReason: ShallowRef<ChangeEventReason | null>
  lastCloseEvent: ShallowRef<Event | null>
  openInteractionHandlers: OpenInteractionHandlers
  itemRegistry: ComboboxItemRegistry
  multiple: ComputedRef<boolean>
  noSelection: ComputedRef<boolean>
  inputOwnsFormValue: ComputedRef<boolean>
  selectedValues: ComputedRef<unknown[]>
  hasSelectedValue: ComputedRef<boolean>
  showsPlaceholder: ComputedRef<boolean>
  serializedValue: ComputedRef<unknown>
  inputValue: ComputedRef<string>
  hasInputValue: boolean
  open: ComputedRef<boolean>
  mounted: ComputedRef<boolean>
  transitionStatus: ComputedRef<TransitionStatus>
  openMethod: ComputedRef<string | null | undefined>
  rootId: ComputedRef<string>
  name: ComputedRef<string | undefined>
  disabled: ComputedRef<boolean>
  hasItems: ComputedRef<boolean>
  computedFilteredItems: ComputedRef<readonly unknown[] | readonly Group<unknown>[]>
  flatFilteredItems: ComputedRef<readonly unknown[]>
  focusItemOnOpen: ComputedRef<boolean>
  isEmpty: ComputedRef<boolean>
  escapeKeyBubbles: ComputedRef<boolean>
  grid: ComputedRef<boolean>
  form: ComputedRef<string | undefined>
  onOpenChangeComplete: ComputedRef<((open: boolean) => void) | undefined>
  readOnly: ComputedRef<boolean>
  required: ComputedRef<boolean>
  modal: ComputedRef<boolean>
  focusManagerModal: ComputedRef<boolean>
  openOnInputClick: ComputedRef<boolean>
  submitOnItemClick: ComputedRef<boolean>
  autoHighlight: ComputedRef<boolean | 'always'>
  highlightItemOnHover: ComputedRef<boolean>
  keepHighlight: ComputedRef<boolean>
  itemToStringLabel: ComputedRef<((item: unknown) => string) | undefined>
  isItemEqualToValue: ComputedRef<ItemEqualityComparer>
  inline: ComputedRef<boolean>
  autoComplete: ComputedRef<'list' | 'both' | 'inline' | 'none'>
  virtualized: ComputedRef<boolean>
  items: ComputedRef<readonly unknown[] | readonly Group<unknown>[] | undefined>
  value: ComputedRef<unknown>
  pendingOpenHighlight: { current: 'first' | 'last' | null }
  findVisibleIndex: (value: unknown) => number
  serialize: (value: unknown) => string
  commitAutofilledValue: (event: Event) => void
  requestSubmit: () => void
  setValue: (next: unknown) => void
  selectValue: (itemValue: unknown) => void
  removeSelectedValueAt: (index: number) => number | undefined
  isValueSelected: (itemValue: unknown) => boolean
  setInputValue: (next: string, reason?: ChangeEventReason, event?: Event) => void
  setOpen: (next: boolean, reason?: ChangeEventReason, event?: Event) => void
  setMounted: (next: boolean) => void
  itemLabels: () => Array<string | undefined>
  findByValue: (value: unknown) => number
  getValueAtIndex: (index: number) => unknown
}

export function useComboboxRoot(options: ComboboxRootOptions): ComboboxRoot {
  const field = FieldContext.getOr()
  const formRoot = FormContext.getOr()

  const inputElement = shallowRef<HTMLElement | null>(null)
  const hiddenInputElement = shallowRef<HTMLInputElement | null>(null)
  const triggerElement = shallowRef<HTMLElement | null>(null)
  const clearElement = shallowRef<HTMLElement | null>(null)
  const chipsContainerElement = shallowRef<HTMLElement | null>(null)
  const inputGroupElement = shallowRef<HTMLElement | null>(null)
  const startDismissElement = shallowRef<HTMLElement | null>(null)
  const endDismissElement = shallowRef<HTMLElement | null>(null)
  const inputInsidePopup = shallowRef(true)
  const positionerElement = shallowRef<HTMLElement | null>(null)
  const popupElement = shallowRef<HTMLElement | null>(null)
  const listElement = shallowRef<HTMLElement | null>(null)
  const emptyElement = shallowRef<HTMLElement | null>(null)
  const listId = shallowRef<string | undefined>(undefined)
  const popupId = shallowRef<string | undefined>(undefined)
  const labelId = shallowRef<string | undefined>(undefined)
  const popupSide = shallowRef<Side | null>(null)
  const forceMount = shallowRef(false)
  const openChangeReason = shallowRef<ChangeEventReason | null>(null)
  const lastCloseEvent = shallowRef<Event | null>(null)

  const queryChangedAfterOpen = shallowRef(false)
  const closeQuery = shallowRef<string | null>(null)
  const pendingOpenHighlight: { current: 'first' | 'last' | null } = { current: null }
  const pendingQueryHighlight = shallowRef<{ hasQuery: boolean; bySelection?: boolean } | null>(
    null
  )
  const selectionSeed = shallowRef<{ value: unknown } | null>(null)

  const hasInputValue = toValue(options.inputValue) !== undefined
  const initialInputValue = shallowRef('')
  let hadInputClear = false

  const open = computed(() => toValue(options.open))

  const transition = useTransitionStatus({
    open
  })
  const openInteractionHandlers = useOpenInteractionHandlers({
    open
  })

  const multiple = computed(() => toValue(options.selectionMode) === 'multiple')
  const noSelection = computed(() => toValue(options.selectionMode) === 'none')
  const inline = computed(() => toValue(options.inline))
  const inputOwnsFormValue = computed(
    () => noSelection.value && (inline.value || !inputInsidePopup.value)
  )
  const selectedValues = computed(() => {
    const value = options.value()
    return Array.isArray(value) ? value : []
  })

  const animatedElement = computed(() => {
    const positioner = positionerElement.value
    if (toValue(options.inline) && positioner) {
      return positioner.closest<HTMLElement>('[role="dialog"]')
    }
    return popupElement.value
  })

  const seedValue = computed(() =>
    multiple.value ? selectedValues.value[selectedValues.value.length - 1] : options.value()
  )
  const hasSelectedValue = computed(() =>
    multiple.value ? selectedValues.value.length > 0 : options.value() != null
  )
  const showsPlaceholder = computed(() => !noSelection.value && !hasSelectedValue.value)

  const inputValue = computed(() => toValue(options.inputValue) ?? initialInputValue.value)

  const serialize = (value: unknown): string => stringifyAsValue(value, options.itemToStringValue())

  const fieldStringValue = computed<unknown>(() => {
    if (noSelection.value) return inputValue.value
    const value = options.value()
    return Array.isArray(value) ? value.map((entry) => serialize(entry)) : serialize(value)
  })
  const serializedValue = computed<unknown>(() => {
    if (noSelection.value) return inputValue.value
    const value = options.value()
    return Array.isArray(value) ? '' : serialize(value)
  })

  const mounted = computed(() => transition.mounted.value)
  const transitionStatus = computed(() => transition.status.value)
  const openMethod = computed(() => openInteractionHandlers.openMethod.value)

  const rootId = computed(() => toValue(options.id))
  const name = computed(() => field?.name.value ?? toValue(options.name))
  const disabled = computed(() => toValue(options.disabled) || (field?.disabled.value ?? false))
  const hasItems = computed(() => toValue(options.items) !== undefined)

  const flatItems = computed((): readonly unknown[] => {
    const itemsProp = toValue(options.items)
    if (!itemsProp) return []
    if (isGroupedItems(itemsProp)) {
      return itemsProp.flatMap((group) => group.items)
    }
    return itemsProp
  })

  const rawQuery = computed(() => inputValue.value.trim())

  const filtering = useComboboxFilter({
    locale: options.locale,
    filteredItems: options.filteredItems,
    filter: options.filter,
    limit: options.limit,
    items: options.items,
    hasItems,
    flatItems,
    rawQuery,
    itemToStringLabel: options.itemToStringLabel,
    multiple,
    noSelection,
    currentValue: options.value,
    queryChangedAfterOpen,
    closeQuery
  })

  const computedFilteredItems = filtering.computedFilteredItems
  const flatFilteredItems = filtering.flatFilteredItems

  const itemRegistry = createComboboxItemRegistry({
    loopFocus: options.loopFocus,
    autoHighlight: options.autoHighlight,
    virtualized: options.virtualized,
    grid: options.grid,
    itemCount: () => flatFilteredItems.value.length,
    container: () => listElement.value ?? popupElement.value
  })

  const typeaheadValues = computed((): readonly unknown[] =>
    hasItems.value ? flatItems.value : itemRegistry.items.value.map((item) => item.value)
  )

  const focusItemOnOpen = computed(
    () => !(queryChangedAfterOpen.value || (noSelection.value && !toValue(options.autoHighlight)))
  )

  const isEmpty = computed(() => itemRegistry.count.value === 0)

  const escapeKeyBubbles = computed(
    () => hasItems.value && flatFilteredItems.value.length === 0 && emptyElement.value === null
  )

  const grid = computed(() => toValue(options.grid))
  const form = computed(() => toValue(options.form))
  const onOpenChangeComplete = computed(() => options.onOpenChangeComplete?.())
  const readOnly = computed(() => toValue(options.readOnly))
  const required = computed(() => toValue(options.required))
  const modal = computed(() => toValue(options.modal))
  const focusManagerModal = computed(() => !inputInsidePopup.value || toValue(options.modal))
  const openOnInputClick = computed(() => toValue(options.openOnInputClick))
  const submitOnItemClick = computed(() => toValue(options.submitOnItemClick))
  const autoHighlight = computed(() => toValue(options.autoHighlight))
  const highlightItemOnHover = computed(() => toValue(options.highlightItemOnHover))
  const keepHighlight = computed(() => toValue(options.keepHighlight))
  const itemToStringLabel = computed(() => options.itemToStringLabel())
  const isItemEqualToValue = computed(() => options.isItemEqualToValue())
  const autoComplete = computed(() => toValue(options.autoComplete))
  const virtualized = computed(() => toValue(options.virtualized))
  const items = computed(() => toValue(options.items))
  const value = computed(() => options.value())

  function isListNavigable(): boolean {
    return open.value || toValue(options.inline) || positionerElement.value?.hidden === false
  }

  function findVisibleIndex(target: unknown): number {
    const comparer = options.isItemEqualToValue()
    if (toValue(options.virtualized)) {
      return findItemIndex(flatFilteredItems.value, target, comparer)
    }
    return itemRegistry.items.value.findIndex((item) =>
      compareItemEquality(item.value, target, comparer)
    )
  }

  function restoreHighlightAfterQueryCleared(clearedBySelection: boolean): void {
    if (toValue(options.autoHighlight) === 'always' && !clearedBySelection && noSelection.value) {
      itemRegistry.setHighlightedIndex(0, 'none')
    }

    void nextTick().then(() => {
      if (!open.value && !toValue(options.inline)) return
      const input = inputElement.value as HTMLInputElement | null
      if (input && input.value.trim() !== '') return

      const seed = seedValue.value
      const hasSelection = !noSelection.value && seed != null

      if (hasSelection || clearedBySelection) {
        itemRegistry.setHighlightedIndex(hasSelection ? findVisibleIndex(seed) : -1, 'none')
      } else if (toValue(options.autoHighlight) === 'always') {
        itemRegistry.setHighlightedIndex(itemRegistry.firstIndex(), 'none')
      }
    })
  }

  function scrollListToTop(): void {
    const list = listElement.value
    if (toValue(options.virtualized) || !list) return

    const popup = popupElement.value
    for (const ancestor of getOverflowAncestors(list.firstElementChild ?? list)) {
      if (
        !isHTMLElement(ancestor) ||
        (popup ? !contains(popup, ancestor) : ancestor.getAttribute('role') === 'dialog')
      ) {
        break
      }
      if (isScrollable(ancestor, 'vertical')) {
        ancestor.scrollTop = 0
        break
      }
    }
  }

  function isSelectedValueDirty(next: unknown): boolean {
    const initialValue = field?.validityData.value.initialValue

    if (Array.isArray(next) && Array.isArray(initialValue)) {
      return !areArraysEqual(next, initialValue, (itemValue, initialItemValue) =>
        compareItemEquality(itemValue, initialItemValue, options.isItemEqualToValue())
      )
    }

    return next !== initialValue
  }

  function syncInputToSelectedLabel(next: unknown): void {
    const nextInputValue = stringifyAsLabel(next, options.itemToStringLabel())
    if (nextInputValue !== inputValue.value) {
      setInputValue(nextInputValue, REASONS.none)
    }
  }

  function rewriteInputElement(next: string, reason: ChangeEventReason): void {
    const input = inputElement.value as HTMLInputElement | null
    if (input && input.value !== next) setInputValue(next, reason)
  }

  function completeCloseUnmount(): void {
    transition.mounted.value = false
    itemRegistry.setHighlightedIndex(-1)
    options.onOpenChangeComplete?.()?.(false)

    queryChangedAfterOpen.value = false
    closeQuery.value = null

    if (noSelection.value) return

    if (multiple.value) {
      if (!hadInputClear) rewriteInputElement('', REASONS.inputClear)
      return
    }

    if (inputInsidePopup.value) {
      rewriteInputElement('', REASONS.inputClear)
      return
    }

    const label = stringifyAsLabel(options.value(), options.itemToStringLabel())
    rewriteInputElement(label, label === '' ? REASONS.inputClear : REASONS.none)
  }

  function findSerializedMatch(autofilledText: string): unknown {
    const target = autofilledText.toLowerCase()
    return flatFilteredItems.value.find(
      (candidate) => serialize(candidate).toLowerCase() === target
    )
  }

  function findAutofillValue(autofilledText: string): unknown {
    const target = autofilledText.toLowerCase()
    const label = options.itemToStringLabel()
    const candidates = hasItems.value
      ? flatFilteredItems.value
      : itemRegistry.items.value.map((item) => item.value)
    const match = candidates.find(
      (candidate) =>
        serialize(candidate).toLowerCase() === target ||
        stringifyAsLabel(candidate, label).toLowerCase() === target
    )
    if (match != null) return match

    return itemRegistry.items.value.find((item) => {
      const renderedLabel = item.element.textContent?.trim() ?? ''
      return renderedLabel !== '' && renderedLabel.toLowerCase() === target
    })?.value
  }

  function commitAutofilledValue(event: Event): void {
    const input = hiddenInputElement.value
    if (!input) return
    if (event.defaultPrevented || disabled.value || readOnly.value || multiple.value) {
      input.value = String(serializedValue.value)
      return
    }

    const autofilledText = input.value
    // Chrome fires both `input` and `change` for one autofill, so the second arrives with the
    // value already applied.
    if (autofilledText === serializedValue.value) return

    if (noSelection.value) {
      setInputValue(autofilledText, REASONS.none)
      return
    }

    if (!hasItems.value || findSerializedMatch(autofilledText) == null) {
      forceMount.value = true
    }
    queueMicrotask(() => {
      const match = findAutofillValue(autofilledText)
      if (match != null) setValue(match)
      else input.value = String(serializedValue.value)
    })
  }

  function requestSubmit(): void {
    const formElement =
      hiddenInputElement.value?.form ?? (inputElement.value as HTMLInputElement | null)?.form
    if (typeof formElement?.requestSubmit === 'function') formElement.requestSubmit()
  }

  function setValue(next: unknown): void {
    if (Object.is(next, options.value())) return
    options.setValue(next)
  }

  function selectValue(itemValue: unknown): void {
    if (noSelection.value) return
    if (!multiple.value) {
      setValue(itemValue)
      return
    }
    const comparer = options.isItemEqualToValue()
    const index = selectedValues.value.findIndex((selected) =>
      compareItemEquality(itemValue, selected, comparer)
    )
    const next =
      index >= 0
        ? [...selectedValues.value.slice(0, index), ...selectedValues.value.slice(index + 1)]
        : [...selectedValues.value, itemValue]
    setValue(next)
  }

  /** Returns the chip index that should be highlighted next. */
  function removeSelectedValueAt(index: number): number | undefined {
    const next = index >= selectedValues.value.length - 1 ? selectedValues.value.length - 2 : index
    itemRegistry.setHighlightedIndex(-1)
    setValue(selectedValues.value.filter((_, i) => i !== index))
    return next >= 0 ? next : undefined
  }

  function isValueSelected(itemValue: unknown): boolean {
    const comparer = options.isItemEqualToValue()
    if (multiple.value) {
      return selectedValues.value.some((selected) =>
        compareItemEquality(itemValue, selected, comparer)
      )
    }
    return compareItemEquality(itemValue, options.value(), comparer)
  }

  function setInputValue(
    next: string,
    reason: ChangeEventReason = REASONS.inputChange,
    event?: Event
  ): void {
    hadInputClear = reason === REASONS.inputClear
    options.setInputValue(next)
    if (noSelection.value) formRoot?.clearErrors(name.value)

    if (reason === REASONS.inputChange) {
      if (open.value && closeQuery.value !== null) closeQuery.value = null

      if (isTypedInput(event)) {
        const hasQuery = next.trim() !== ''
        if (hasQuery) {
          queryChangedAfterOpen.value = true
        }
        pendingQueryHighlight.value = { hasQuery }
        scrollListToTop()
      }
    } else if (reason === REASONS.inputClear && next === '' && inputInsidePopup.value) {
      pendingQueryHighlight.value = { hasQuery: false, bySelection: true }
    }
  }

  function setOpen(next: boolean, reason?: ChangeEventReason, event?: Event): void {
    if (disabled.value && next) return
    if (open.value === next) return
    openChangeReason.value = reason ?? null
    lastCloseEvent.value = next ? null : (event ?? null)
    options.setOpen(next)
    if (!next) {
      pendingOpenHighlight.current = null

      if (queryChangedAfterOpen.value) {
        const query = rawQuery.value
        const single = !multiple.value && !noSelection.value
        const isInline = toValue(options.inline)
        if (single) {
          if (!isInline) closeQuery.value = query
          if (query === '') queryChangedAfterOpen.value = false
        } else if (multiple.value) {
          if (!isInline) closeQuery.value = query
          if (inputInsidePopup.value) itemRegistry.setHighlightedIndex(-1)
          if (!inputInsidePopup.value || isInline) {
            setInputValue('', REASONS.inputClear)
          }
        }
      }
    } else if (inputInsidePopup.value && !toValue(options.inline) && closeQuery.value !== null) {
      queryChangedAfterOpen.value = false
      closeQuery.value = null
      if (inputValue.value !== '' && reason !== REASONS.inputChange) {
        setInputValue('', REASONS.inputClear)
      }
    }

    if (
      !next &&
      inputInsidePopup.value &&
      (reason === REASONS.focusOut || reason === REASONS.outsidePress)
    ) {
      field?.commitOnBlur(noSelection.value ? inputValue.value : options.value())
    }
  }

  function setMounted(next: boolean): void {
    transition.mounted.value = next
  }

  function itemLabels(): Array<string | undefined> {
    const label = options.itemToStringLabel()
    if (hasItems.value) {
      return flatItems.value.map((item) => stringifyAsLabel(item, label))
    }
    return itemRegistry.items.value.map(
      (item) => item.element.textContent?.trim() || stringifyAsLabel(item.value, label)
    )
  }

  function findByValue(target: unknown): number {
    return findItemIndex(typeaheadValues.value, target, options.isItemEqualToValue())
  }

  function getValueAtIndex(index: number): unknown {
    return typeaheadValues.value[index]
  }

  const initial =
    !multiple.value && !noSelection.value
      ? stringifyAsLabel(options.value() ?? null, options.itemToStringLabel())
      : ''
  initialInputValue.value = hasInputValue ? '' : initial
  if (toValue(options.inline)) selectionSeed.value = { value: seedValue.value }

  watchPostEffect(() => {
    if (!field || disabled.value) return
    onWatcherCleanup(
      field.registerControl({
        id: `${rootId.value}-control`,
        element: () => (inputInsidePopup.value ? triggerElement.value : inputElement.value),
        validationElement: () => hiddenInputElement.value,
        value: () => (noSelection.value ? inputValue.value : options.value()),
        formValue: () => fieldStringValue.value,
        name: () => toValue(options.name)
      })
    )
  })

  watchPostEffect(() => {
    if (!field) return
    field.filled.value = noSelection.value ? inputValue.value !== '' : hasSelectedValue.value
  })

  watch(
    () => closeQuery.value ?? rawQuery.value,
    (query) => {
      if (!open.value || query === '' || query === initialInputValue.value) return
      queryChangedAfterOpen.value = true
    },
    { flush: 'pre' }
  )

  // Runs after the DOM flush so the hidden validation input already carries the new value when
  // the field reads its native validity.
  watch(
    value,
    (next) => {
      if (noSelection.value) return
      formRoot?.clearErrors(name.value)
      field?.setDirty(isSelectedValueDirty(next))
      field?.commitValue(next)

      if (!multiple.value && !hasInputValue && !inputInsidePopup.value) {
        syncInputToSelectedLabel(next)
      }
    },
    { flush: 'post' }
  )

  watch(
    () => inputValue.value,
    (next) => {
      if (!noSelection.value) return
      formRoot?.clearErrors(name.value)
      if (!field) return
      field.setDirty(next !== field.validityData.value.initialValue)
      field.commitValue(next)
    },
    { flush: 'post' }
  )

  watch(
    items,
    () => {
      if (
        multiple.value ||
        noSelection.value ||
        hasInputValue ||
        inputInsidePopup.value ||
        queryChangedAfterOpen.value
      ) {
        return
      }
      syncInputToSelectedLabel(options.value())
    },
    { flush: 'post' }
  )

  openChangeComplete({
    open,
    element: animatedElement,
    onComplete: () => {
      if (!open.value) {
        completeCloseUnmount()
      }
    }
  })

  // Must land in the same flush as the query that caused it, and before the highlight is
  // reported below — hence declared first.
  watch(
    () => ({ pending: pendingQueryHighlight.value, inputValue: inputValue.value }),
    ({ pending }) => {
      if (!pending) return

      if (pending.hasQuery) {
        if (toValue(options.autoHighlight) && isListNavigable()) {
          itemRegistry.setHighlightedIndex(0, 'none')
        }
        pendingQueryHighlight.value = null
        return
      }

      if (inputValue.value.trim() !== '') return

      pendingQueryHighlight.value = null
      if (!isListNavigable()) return

      restoreHighlightAfterQueryCleared(pending.bySelection === true)
    },
    { flush: 'post' }
  )

  let previousHighlight: { index: number; value: unknown; resolved: boolean } = {
    index: -1,
    value: undefined,
    resolved: true
  }

  watch(
    () => {
      const index = itemRegistry.highlightedIndex.value
      if (!mounted.value && !toValue(options.inline)) {
        return { index: -1, value: undefined, resolved: true }
      }
      if (index < 0) return { index: -1, value: undefined, resolved: true }
      if (toValue(options.virtualized)) {
        return {
          index,
          value: flatFilteredItems.value[index],
          resolved: index < flatFilteredItems.value.length
        }
      }
      const item = itemRegistry.items.value[index]
      return { index, value: item?.value, resolved: item !== undefined }
    },
    (current) => {
      const previous = previousHighlight
      const unchanged =
        !current.resolved ||
        (previous.index === current.index &&
          compareItemEquality(current.value, previous.value, options.isItemEqualToValue()))
      if (unchanged) return
      previousHighlight = current
      options.onItemHighlighted?.()?.(
        current.value,
        itemRegistry.lastHighlightReason.value,
        current.index
      )
    },
    { flush: 'post' }
  )

  watchPostEffect(() => {
    if (open.value || noSelection.value) return
    selectionSeed.value = { value: seedValue.value }
  })

  watch(
    () => ({
      open: open.value,
      autoHighlight: autoHighlight.value,
      // Items register in their own watcher, so the first run of this one sees an empty registry;
      // the read here re-runs it once they are in.
      items: itemRegistry.items.value
    }),
    ({ open: isOpen, autoHighlight: autoHighlightProp }) => {
      if (!isOpen) return
      if (!autoHighlightProp && noSelection.value) return
      if (itemRegistry.count.value === 0) return
      const seed = selectionSeed.value
      selectionSeed.value = null
      const seedIndex = seed ? findVisibleIndex(seed.value) : -1
      if (seedIndex >= 0) {
        itemRegistry.setHighlightedIndex(seedIndex, 'none')
      } else if (autoHighlightProp === 'always') {
        if (itemRegistry.highlightedIndex.value < 0) {
          itemRegistry.setHighlightedIndex(itemRegistry.firstIndex(), 'none')
        }
      } else if (pendingOpenHighlight.current && !queryChangedAfterOpen.value) {
        const openIndex =
          pendingOpenHighlight.current === 'first'
            ? itemRegistry.firstIndex()
            : itemRegistry.stepIndex(itemRegistry.count.value, -1)
        if (openIndex !== -1) itemRegistry.setHighlightedIndex(openIndex, 'none')
      }
      pendingOpenHighlight.current = null
    },
    { flush: 'post', immediate: true }
  )

  return {
    inputElement,
    hiddenInputElement,
    triggerElement,
    clearElement,
    chipsContainerElement,
    inputGroupElement,
    startDismissElement,
    endDismissElement,
    inputInsidePopup,
    positionerElement,
    popupElement,
    listElement,
    emptyElement,
    listId,
    popupId,
    labelId,
    popupSide,
    forceMount,
    openChangeReason,
    lastCloseEvent,
    openInteractionHandlers,
    itemRegistry,
    multiple,
    noSelection,
    inputOwnsFormValue,
    selectedValues,
    hasSelectedValue,
    showsPlaceholder,
    serializedValue,
    inputValue,
    hasInputValue,
    open,
    mounted,
    transitionStatus,
    openMethod,
    rootId,
    name,
    disabled,
    hasItems,
    computedFilteredItems,
    flatFilteredItems,
    focusItemOnOpen,
    isEmpty,
    escapeKeyBubbles,
    grid,
    form,
    onOpenChangeComplete,
    readOnly,
    required,
    modal,
    focusManagerModal,
    openOnInputClick,
    submitOnItemClick,
    autoHighlight,
    highlightItemOnHover,
    keepHighlight,
    itemToStringLabel,
    isItemEqualToValue,
    inline,
    autoComplete,
    virtualized,
    items,
    value,
    pendingOpenHighlight,
    findVisibleIndex,
    serialize,
    commitAutofilledValue,
    requestSubmit,
    setValue,
    selectValue,
    removeSelectedValueAt,
    isValueSelected,
    setInputValue,
    setOpen,
    setMounted,
    itemLabels,
    findByValue,
    getValueAtIndex
  }
}
