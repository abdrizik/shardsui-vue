import {
  computed,
  onWatcherCleanup,
  shallowRef,
  toValue,
  watch,
  watchPostEffect,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
  type ShallowRef
} from 'vue'
import { FieldContext } from '@/components/field/context'
import { FormContext } from '@/components/form/context'
import { areArraysEqual } from '@/internal/are-arrays-equal'
import { contains } from '@/internal/dom'
import type { Side } from '@/internal/floating/anchor-positioning'
import { useDismiss } from '@/internal/floating/dismiss'
import { compareItemEquality, type ItemEqualityComparer } from '@/internal/item-equality'
import { focusElementWithVisible } from '@/internal/label-interaction'
import { openChangeComplete } from '@/internal/open-change-complete'
import {
  useOpenInteractionHandlers,
  type OpenInteractionHandlers
} from '@/internal/open-interaction-handlers'
import { REASONS, type ChangeEventReason } from '@/internal/reasons'
import {
  resolveSelectedLabel,
  stringifyAsLabel,
  stringifyAsValue
} from '@/internal/resolve-value-label'
import { getMaxScrollOffset, normalizeScrollOffset } from '@/internal/scroll-edges'
import { useTransitionStatus, type TransitionStatus } from '@/internal/transition-status'
import type { SelectItem } from './context'
import { createSelectItemRegistry, type SelectItemRegistry } from './item-registry'

export type SelectRootOptions = {
  id: MaybeRefOrGetter<string>
  value: () => unknown
  setValue: (value: unknown) => void
  open: MaybeRefOrGetter<boolean>
  setOpen: (open: boolean) => void
  onOpenChangeComplete?: () => ((open: boolean) => void) | undefined
  name: MaybeRefOrGetter<string | undefined>
  disabled: MaybeRefOrGetter<boolean>
  readOnly: MaybeRefOrGetter<boolean>
  required: MaybeRefOrGetter<boolean>
  modal: MaybeRefOrGetter<boolean>
  multiple: MaybeRefOrGetter<boolean>
  highlightItemOnHover: MaybeRefOrGetter<boolean>
  items: MaybeRefOrGetter<readonly unknown[] | Record<string, unknown> | undefined>
  isItemEqualToValue: () => ItemEqualityComparer
  itemToStringLabel: () => ((item: unknown) => string) | undefined
  itemToStringValue: () => ((item: unknown) => string) | undefined
}

export type MouseUpSelection = {
  allowSelected: boolean
  allowUnselected: boolean
  dragY: number
}

export type SelectRoot = {
  triggerElement: ShallowRef<HTMLElement | null>
  triggerFocusTargetElement: ShallowRef<HTMLElement | null>
  hiddenInputElement: ShallowRef<HTMLInputElement | null>
  positionerElement: ShallowRef<HTMLElement | null>
  popupElement: ShallowRef<HTMLElement | null>
  listElement: ShallowRef<HTMLElement | null>
  listId: ShallowRef<string | undefined>
  popupId: ShallowRef<string | undefined>
  labelId: ShallowRef<string | undefined>
  popupSide: ShallowRef<Side | null>
  scrollUpArrowVisible: ShallowRef<boolean>
  scrollDownArrowVisible: ShallowRef<boolean>
  forceMount: ShallowRef<boolean>
  lastCloseEvent: ShallowRef<Event | null>
  openChangeReason: ShallowRef<ChangeEventReason | null>
  openMethod: ShallowRef<string | null>
  typing: boolean
  isPointerModality: boolean
  mouseUpSelection: MouseUpSelection
  itemRegistry: SelectItemRegistry
  openInteractionHandlers: OpenInteractionHandlers
  value: ComputedRef<unknown>
  selectedValues: ComputedRef<unknown[]>
  hasValue: ComputedRef<boolean>
  serializedValue: ComputedRef<string>
  disabled: ComputedRef<boolean>
  resolvedName: ComputedRef<string | undefined>
  hiddenInputName: ComputedRef<string | undefined>
  selectedLabel: ComputedRef<string>
  hasScrollArrows: ComputedRef<boolean>
  scroller: ComputedRef<HTMLElement | null>
  open: ComputedRef<boolean>
  required: ComputedRef<boolean>
  readOnly: ComputedRef<boolean>
  modal: ComputedRef<boolean>
  multiple: ComputedRef<boolean>
  highlightItemOnHover: ComputedRef<boolean>
  items: ComputedRef<readonly unknown[] | Record<string, unknown> | undefined>
  isItemEqualToValue: ComputedRef<ItemEqualityComparer>
  onOpenChangeComplete: ComputedRef<((open: boolean) => void) | undefined>
  rootId: ComputedRef<string>
  mounted: Readonly<Ref<boolean>>
  transitionStatus: Readonly<Ref<TransitionStatus>>
  serialize: (value: unknown) => string
  setValue: (next: unknown) => void
  isValueSelected: (itemValue: unknown) => boolean
  setOpen: (next: boolean, reason?: ChangeEventReason, event?: Event) => void
  onFocus: () => void
  onChange: (event: Event) => void
  updateScrollArrowVisibility: () => void
  registerScrollArrow: () => () => void
}

export function useSelectRoot(options: SelectRootOptions): SelectRoot {
  const triggerElement = shallowRef<HTMLElement | null>(null)
  const triggerFocusTargetElement = shallowRef<HTMLElement | null>(null)
  const hiddenInputElement = shallowRef<HTMLInputElement | null>(null)
  const positionerElement = shallowRef<HTMLElement | null>(null)
  const popupElement = shallowRef<HTMLElement | null>(null)
  const listElement = shallowRef<HTMLElement | null>(null)
  const listId = shallowRef<string | undefined>(undefined)
  const popupId = shallowRef<string | undefined>(undefined)
  const labelId = shallowRef<string | undefined>(undefined)
  const popupSide = shallowRef<Side | null>(null)
  const scrollUpArrowVisible = shallowRef(false)
  const scrollDownArrowVisible = shallowRef(false)
  const forceMount = shallowRef(false)
  const lastCloseEvent = shallowRef<Event | null>(null)
  const openChangeReason = shallowRef<ChangeEventReason | null>(null)
  const openMethod = shallowRef<string | null>(null)
  const scrollArrowsMountedCount = shallowRef(0)

  const field = FieldContext.getOr()
  const formRoot = FormContext.getOr()

  let highlightSyncedOnOpen = false
  let typing = false
  let isPointerModality = false

  const open = computed(() => toValue(options.open))
  const required = computed(() => toValue(options.required))
  const readOnly = computed(() => toValue(options.readOnly))
  const modal = computed(() => toValue(options.modal))
  const multiple = computed(() => toValue(options.multiple))
  const highlightItemOnHover = computed(() => toValue(options.highlightItemOnHover))
  const items = computed(() => toValue(options.items))
  const isItemEqualToValue = computed(() => options.isItemEqualToValue())
  const onOpenChangeComplete = computed(() => options.onOpenChangeComplete?.())
  const rootId = computed(() => toValue(options.id))

  const value = computed(() => {
    const current = options.value()
    if (current !== undefined) return current
    return multiple.value ? [] : null
  })

  const selectedValues = computed(() => (Array.isArray(value.value) ? value.value : []))

  function serialize(entry: unknown): string {
    return stringifyAsValue(entry, options.itemToStringValue())
  }

  const hasValue = computed(() => {
    if (value.value == null) return false
    if (multiple.value && Array.isArray(value.value)) {
      return selectedValues.value.length > 0
    }
    return serialize(value.value) !== ''
  })

  const fieldStringValue = computed(() =>
    multiple.value && Array.isArray(value.value)
      ? value.value.map((entry) => serialize(entry))
      : serialize(value.value)
  )

  const serializedValue = computed(() => (multiple.value ? '' : serialize(value.value)))

  const disabled = computed(() => (field?.disabled.value ?? false) || toValue(options.disabled))

  const resolvedName = computed(() => field?.name.value ?? toValue(options.name))

  const hiddenInputName = computed(() => (multiple.value ? undefined : resolvedName.value))

  const selectedLabel = computed(() => {
    const currentItems = items.value
    const itemToStringLabel = options.itemToStringLabel()
    if (Array.isArray(value.value)) {
      return selectedValues.value
        .map((entry) => resolveSelectedLabel(entry, currentItems, itemToStringLabel))
        .join(', ')
    }
    return resolveSelectedLabel(value.value, currentItems, itemToStringLabel)
  })

  const hasScrollArrows = computed(() => scrollArrowsMountedCount.value > 0)

  const scroller = computed(() => listElement.value ?? popupElement.value)

  const itemRegistry = createSelectItemRegistry({
    isItemEqualToValue: options.isItemEqualToValue,
    scroller
  })

  const initialValue = value.value

  const transition = useTransitionStatus({
    open
  })

  const openInteractionHandlers = useOpenInteractionHandlers({
    open
  })

  watch(
    openInteractionHandlers.openMethod,
    (method) => {
      if (method !== null) openMethod.value = method
    },
    { flush: 'post' }
  )

  function isSameValue(a: unknown, b: unknown): boolean {
    if (Array.isArray(a) && Array.isArray(b)) {
      return areArraysEqual(a, b, (itemValue, otherValue) =>
        compareItemEquality(itemValue, otherValue, options.isItemEqualToValue())
      )
    }

    return a === b
  }

  function setValue(next: unknown): void {
    options.setValue(next)
  }

  function isValueSelected(itemValue: unknown): boolean {
    if (multiple.value) {
      return selectedValues.value.some((selected) =>
        compareItemEquality(itemValue, selected, options.isItemEqualToValue())
      )
    }
    return compareItemEquality(itemValue, value.value, options.isItemEqualToValue())
  }

  function setOpen(next: boolean, reason?: ChangeEventReason, event?: Event): void {
    if (disabled.value && next) return
    // A close immediately followed by an open collapses into one flush, so the highlight sync
    // never observes the closed state.
    if (!next) highlightSyncedOnOpen = false
    lastCloseEvent.value = next ? null : (event ?? null)
    openChangeReason.value = reason ?? null
    options.setOpen(next)
    if (!next && (reason === REASONS.outsidePress || reason === REASONS.focusOut)) {
      field?.commitOnBlur(value.value)
    }
  }

  function onFocus(): void {
    if (triggerElement.value) focusElementWithVisible(triggerElement.value)
  }

  function findItemMatchingAutofill(autofilledText: string): SelectItem | undefined {
    const target = autofilledText.toLowerCase()
    const byValueOrLabel = itemRegistry.items.value.find(
      (item) =>
        serialize(item.value).toLowerCase() === target ||
        stringifyAsLabel(item.value, options.itemToStringLabel()).toLowerCase() === target
    )
    if (byValueOrLabel) return byValueOrLabel

    const index = itemRegistry
      .labels()
      .findIndex((label) => label !== '' && label.toLowerCase() === target)
    return index === -1 ? undefined : itemRegistry.items.value[index]
  }

  function onChange(event: Event): void {
    const input = hiddenInputElement.value
    if (!input) return
    if (event.defaultPrevented || toValue(options.disabled) || readOnly.value || multiple.value) {
      input.value = serializedValue.value
      return
    }

    const autofilledText = input.value
    forceMount.value = true
    queueMicrotask(() => {
      const matchingItem = findItemMatchingAutofill(autofilledText)
      if (matchingItem) {
        setValue(matchingItem.value)
      } else {
        input.value = serializedValue.value
      }
    })
  }

  function updateScrollArrowVisibility(): void {
    const element = scroller.value
    if (!element) return

    const maxScrollTop = getMaxScrollOffset(element.scrollHeight, element.clientHeight)
    const scrollTop = normalizeScrollOffset(element.scrollTop, maxScrollTop)

    scrollUpArrowVisible.value = scrollTop > 0
    scrollDownArrowVisible.value = scrollTop < maxScrollTop
  }

  function registerScrollArrow(): () => void {
    scrollArrowsMountedCount.value += 1
    return () => {
      scrollArrowsMountedCount.value -= 1
    }
  }

  watchPostEffect(() => {
    if (!field || disabled.value) return
    onWatcherCleanup(
      field.registerControl({
        id: `${rootId.value}-control`,
        element: () => triggerElement.value,
        validationElement: () => hiddenInputElement.value,
        value: () => value.value,
        formValue: () => fieldStringValue.value,
        name: () => toValue(options.name)
      })
    )
  })

  watchPostEffect(() => {
    if (!field) return
    field.filled.value = hasValue.value
  })

  let previousCommittedValue = value.value
  watch(
    value,
    (current) => {
      if (isSameValue(current, previousCommittedValue)) return
      previousCommittedValue = current
      formRoot?.clearErrors(resolvedName.value)
      if (!field) return
      field.setDirty(!isSameValue(current, field.validityData.value.initialValue))
      field.commitValue(current)
    },
    { flush: 'post' }
  )

  openChangeComplete({
    open,
    element: popupElement,
    onComplete: () => {
      if (open.value) return
      transition.mounted.value = false
      itemRegistry.highlightedIndex.value = -1
      openMethod.value = null
      scrollUpArrowVisible.value = false
      scrollDownArrowVisible.value = false
      options.onOpenChangeComplete?.()?.(false)
    }
  })

  useDismiss({
    open,
    onClose: (reason, event) => {
      const closeReason = reason === REASONS.escapeKey ? REASONS.escapeKey : REASONS.outsidePress
      setOpen(false, closeReason, event)
    },
    popupElement: positionerElement,
    referenceElement: triggerElement,
    isInsideElement: (target) =>
      contains(positionerElement.value, target) || contains(triggerElement.value, target)
  })

  function hasItemFor(entry: unknown): boolean {
    return itemRegistry.items.value.some((item) =>
      compareItemEquality(item.value, entry, options.isItemEqualToValue())
    )
  }

  watch(
    itemRegistry.count,
    (count, previousCount) => {
      if (count === 0 || previousCount === 0) return

      const current = value.value
      if (multiple.value) {
        if (!Array.isArray(current)) return
        const remaining = current.filter((entry) => hasItemFor(entry))
        if (remaining.length !== current.length) setValue(remaining)
        return
      }

      if (current == null || hasItemFor(current)) return
      const hasInitial = initialValue != null && hasItemFor(initialValue)
      setValue(hasInitial ? initialValue : null)
    },
    { flush: 'post' }
  )

  function indexToHighlightOnOpen(): number {
    if (multiple.value && Array.isArray(value.value)) {
      return itemRegistry.findByValue(value.value.at(-1))
    }
    return itemRegistry.findByValue(value.value)
  }

  watch(
    () => [open.value, itemRegistry.count.value] as const,
    () => {
      if (!open.value) {
        highlightSyncedOnOpen = false
        return
      }
      if (highlightSyncedOnOpen) return
      if (itemRegistry.count.value === 0) return

      const index = indexToHighlightOnOpen()
      const fallback = highlightItemOnHover.value ? itemRegistry.firstIndex() : -1
      isPointerModality = false
      itemRegistry.highlightedIndex.value = index >= 0 ? index : fallback
      highlightSyncedOnOpen = true
    },
    { flush: 'post', immediate: true }
  )

  return {
    triggerElement,
    triggerFocusTargetElement,
    hiddenInputElement,
    positionerElement,
    popupElement,
    listElement,
    listId,
    popupId,
    labelId,
    popupSide,
    scrollUpArrowVisible,
    scrollDownArrowVisible,
    forceMount,
    lastCloseEvent,
    openChangeReason,
    openMethod,
    get typing() {
      return typing
    },
    set typing(next: boolean) {
      typing = next
    },
    get isPointerModality() {
      return isPointerModality
    },
    set isPointerModality(next: boolean) {
      isPointerModality = next
    },
    mouseUpSelection: { allowSelected: false, allowUnselected: false, dragY: 0 },
    itemRegistry,
    openInteractionHandlers,
    value,
    selectedValues,
    hasValue,
    serializedValue,
    disabled,
    resolvedName,
    hiddenInputName,
    selectedLabel,
    hasScrollArrows,
    scroller,
    open,
    required,
    readOnly,
    modal,
    multiple,
    highlightItemOnHover,
    items,
    isItemEqualToValue,
    onOpenChangeComplete,
    rootId,
    mounted: transition.mounted,
    transitionStatus: transition.status,
    serialize,
    setValue,
    isValueSelected,
    setOpen,
    onFocus,
    onChange,
    updateScrollArrowVisibility,
    registerScrollArrow
  }
}
