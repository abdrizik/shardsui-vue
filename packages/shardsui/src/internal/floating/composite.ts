import {
  computed,
  shallowReactive,
  shallowRef,
  toValue,
  watch,
  watchPostEffect,
  type MaybeRefOrGetter
} from 'vue'
import type { ModifierKey } from '../composite'
import { scrollIntoViewIfNeeded } from '../composite'
import { DirectionContext } from '../direction-context'
import { observeDocumentOrder } from '../document-order'
import { sortByDocumentPosition } from '../document-position'
import { getTarget, isHTMLElement } from '../dom'
import { isElementDisabled } from '../is-element-disabled'
import type { Orientation } from '../types'
import { resolveIndex, type IndexAction } from './list-navigation'

export type CompositeOrientation = Orientation | 'both'

function isNativeInput(
  element: EventTarget
): element is HTMLElement & (HTMLInputElement | HTMLTextAreaElement) {
  if (!isHTMLElement(element)) return false
  if (element.tagName === 'TEXTAREA') return true
  return (
    element.tagName === 'INPUT' && 'selectionStart' in element && element.selectionStart != null
  )
}

type Item = { element: HTMLElement; disabled: boolean; active: boolean }

type CompositeOptions = {
  orientation: MaybeRefOrGetter<CompositeOrientation>
  loopFocus: MaybeRefOrGetter<boolean>
  ref: MaybeRefOrGetter<HTMLElement | null>
  enableHomeAndEnd?: MaybeRefOrGetter<boolean | undefined>
  highlightItemOnHover?: MaybeRefOrGetter<boolean | undefined>
  modifierKeys?: MaybeRefOrGetter<ModifierKey[] | undefined>
}

export function useCompositeRoot(options: CompositeOptions) {
  const items = shallowReactive(new Map<HTMLElement, Item>())
  const direction = DirectionContext.get().direction

  const highlightedIndex = shallowRef(0)
  let hasSetDefaultIndex = false

  const highlightItemOnHover = computed(() => toValue(options.highlightItemOnHover) ?? false)

  const orientation = computed(() => toValue(options.orientation))
  const ref = computed(() => toValue(options.ref))
  const loopFocus = computed(() => toValue(options.loopFocus))
  const enableHomeAndEnd = computed(() => toValue(options.enableHomeAndEnd) ?? false)
  const modifierKeys = computed(() => toValue(options.modifierKeys) ?? [])

  // A DOM move leaves the registration set untouched, so the sort needs an explicit signal.
  const order = shallowRef(0)

  // `compareDocumentPosition` orders disconnected nodes inconsistently.
  const sorted = computed(() => {
    void order.value
    return Array.from(items.values())
      .filter((item) => item.element.isConnected)
      .sort((a, b) => sortByDocumentPosition(a.element, b.element))
  })

  const indexMap = computed(
    () => new Map(sorted.value.map((item, i): [HTMLElement, number] => [item.element, i]))
  )

  function isNavTarget(item: Item | undefined): boolean {
    if (!item) return false
    return item.element.isConnected && !item.disabled
  }

  function navTargetIndex(action: IndexAction, current?: number): number {
    const list = sorted.value
    return resolveIndex(action, {
      count: list.length,
      current,
      isSkipped: (i) => !isNavTarget(list[i]),
      loop: (action === 'next' || action === 'previous') && loopFocus.value
    })
  }

  function scrollIndexIntoView(i: number) {
    scrollIntoViewIfNeeded(
      ref.value,
      sorted.value[i]?.element ?? null,
      direction.value,
      orientation.value
    )
  }

  function setHighlightedIndex(i: number, shouldScrollIntoView = false) {
    highlightedIndex.value = i
    if (shouldScrollIntoView) scrollIndexIntoView(i)
  }

  function indexOfElement(element: HTMLElement): number {
    return indexMap.value.get(element) ?? -1
  }

  function register(element: HTMLElement, opts: { disabled: boolean; active?: boolean }) {
    items.set(element, { element, disabled: opts.disabled, active: opts.active ?? false })
    return () => {
      items.delete(element)
    }
  }

  function focusIndex(i: number) {
    const item = sorted.value[i]
    if (!item || !item.element.isConnected) return
    setHighlightedIndex(i, true)
    item.element.focus()
  }

  observeDocumentOrder({
    container: ref,
    items: sorted,
    elementOf: (item: Item) => item.element,
    reorder: () => {
      order.value += 1
    }
  })

  watchPostEffect(() => {
    const list = sorted.value
    if (list.length === 0) return

    if (!hasSetDefaultIndex) {
      hasSetDefaultIndex = true
      const activeIndex = list.findIndex((item) => item.active)
      if (activeIndex !== -1) {
        setHighlightedIndex(activeIndex, true)
        return
      }
    }

    if (isNavTarget(list[highlightedIndex.value])) return
    const firstNavTargetIndex = navTargetIndex('first')
    if (firstNavTargetIndex >= 0) {
      setHighlightedIndex(firstNavTargetIndex)
    }
  })

  function onKeydown(event: KeyboardEvent) {
    const isRtl = direction.value === 'rtl'
    const allowedModifiers = modifierKeys.value

    if (
      (event.shiftKey && !allowedModifiers.includes('Shift')) ||
      (event.ctrlKey && !allowedModifiers.includes('Control')) ||
      (event.altKey && !allowedModifiers.includes('Alt')) ||
      (event.metaKey && !allowedModifiers.includes('Meta'))
    ) {
      return
    }

    const axis = orientation.value
    const horizontalNext = isRtl ? 'ArrowLeft' : 'ArrowRight'
    const horizontalPrev = isRtl ? 'ArrowRight' : 'ArrowLeft'

    const target = getTarget(event)
    if (target && isNativeInput(target) && !isElementDisabled(target)) {
      const selectionStart = target.selectionStart
      const selectionEnd = target.selectionEnd
      const value = target.value

      if (selectionStart != null) {
        if (selectionStart !== selectionEnd) return

        const forwardKey = axis === 'vertical' ? 'ArrowDown' : horizontalNext
        const backwardKey = axis === 'vertical' ? 'ArrowUp' : horizontalPrev

        if (event.key !== backwardKey && selectionStart < value.length) return
        if (event.key !== forwardKey && selectionStart > 0) return
      }
    }

    const allowsVertical = axis !== 'horizontal'
    const allowsHorizontal = axis !== 'vertical'

    const isForward =
      (allowsVertical && event.key === 'ArrowDown') ||
      (allowsHorizontal && event.key === horizontalNext)
    const isBackward =
      (allowsVertical && event.key === 'ArrowUp') ||
      (allowsHorizontal && event.key === horizontalPrev)
    const isHome = enableHomeAndEnd.value && event.key === 'Home'
    const isEnd = enableHomeAndEnd.value && event.key === 'End'

    if (!isForward && !isBackward && !isHome && !isEnd) return

    const newIndex = isHome
      ? navTargetIndex('first')
      : isEnd
        ? navTargetIndex('last')
        : navTargetIndex(isForward ? 'next' : 'previous', highlightedIndex.value)

    if (newIndex !== highlightedIndex.value) {
      event.preventDefault()
      event.stopPropagation()
      focusIndex(newIndex)
    }
  }

  function onFocus(event: FocusEvent) {
    const target = getTarget(event)
    if (target == null || !isNativeInput(target)) return
    target.setSelectionRange(0, target.value.length)
  }

  return {
    highlightedIndex,
    highlightItemOnHover,
    setHighlightedIndex,
    indexOfElement,
    register,
    onKeydown,
    onFocus
  }
}

export type CompositeRoot = ReturnType<typeof useCompositeRoot>

type CompositeItemOptions = {
  composite: CompositeRoot
  ref: MaybeRefOrGetter<HTMLElement | null>
  disabled: MaybeRefOrGetter<boolean>
  active?: MaybeRefOrGetter<boolean | undefined>
}

export function useCompositeItem(options: CompositeItemOptions) {
  const composite = options.composite
  const ref = computed(() => toValue(options.ref))
  const disabled = computed(() => toValue(options.disabled))
  const active = computed(() => toValue(options.active) ?? false)

  watch(
    () => [ref.value, disabled.value] as const,
    ([el, isDisabled], _previous, onCleanup) => {
      if (!el) return
      onCleanup(composite.register(el, { disabled: isDisabled, active: active.value }))
    },
    { immediate: true, flush: 'sync' }
  )

  const index = computed(() => (ref.value ? composite.indexOfElement(ref.value) : -1))
  const isHighlighted = computed(() => index.value === composite.highlightedIndex.value)
  const tabindex = computed(() => (isHighlighted.value ? 0 : -1))

  function onFocus() {
    if (index.value !== -1) composite.setHighlightedIndex(index.value)
  }

  function focusOnHover() {
    const element = ref.value
    if (!element || !composite.highlightItemOnHover.value) return
    if (!isHighlighted.value && !disabled.value) element.focus()
  }

  return { index, isHighlighted, tabindex, onFocus, focusOnHover }
}

export type CompositeItem = ReturnType<typeof useCompositeItem>
