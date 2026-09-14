import { shallowRef, toValue, type ComputedRef, type MaybeRefOrGetter, type ShallowRef } from 'vue'
import { resolveIndex } from '@/internal/floating/list-navigation'
import { isElementDisabled } from '@/internal/is-element-disabled'
import { compareItemEquality, type ItemEqualityComparer } from '@/internal/item-equality'
import { createItemList } from '@/internal/item-list'
import type { SelectItem } from './context'

export type SelectItemRegistryOptions = {
  isItemEqualToValue: () => ItemEqualityComparer
  scroller: MaybeRefOrGetter<HTMLElement | null>
}

export type SelectItemRegistry = {
  items: ShallowRef<SelectItem[]>
  count: ComputedRef<number>
  highlightedIndex: ShallowRef<number>
  registerItem: (element: HTMLElement, item: { value: unknown }) => () => void
  indexOf: (element: Element | null) => number
  labels: () => string[]
  getValueAtIndex: (index: number) => unknown
  isItemDisabled: (index: number) => boolean
  stepIndex: (start: number, dir: 1 | -1) => number
  firstIndex: () => number
  lastIndex: () => number
  findByValue: (value: unknown) => number
  focusItemElement: (index: number, scroll?: boolean) => void
}

function scrollItemIntoScroller(scroller: HTMLElement, item: HTMLElement): void {
  const itemRect = item.getBoundingClientRect()
  const scrollerRect = scroller.getBoundingClientRect()
  if (itemRect.top < scrollerRect.top) {
    scroller.scrollTop += itemRect.top - scrollerRect.top
  } else if (itemRect.bottom > scrollerRect.bottom) {
    scroller.scrollTop += itemRect.bottom - scrollerRect.bottom
  }
}

export function createSelectItemRegistry(options: SelectItemRegistryOptions): SelectItemRegistry {
  const list = createItemList<{ value: unknown }>({ container: options.scroller })
  const { items, count, registerItem, indexOf } = list

  const highlightedIndex = shallowRef(-1)

  function labels(): string[] {
    return items.value.map((item) => item.element.textContent?.trim() ?? '')
  }

  function getValueAtIndex(index: number): unknown {
    return items.value[index]?.value
  }

  function isItemDisabled(index: number): boolean {
    return isElementDisabled(items.value[index]?.element ?? null)
  }

  function stepIndex(start: number, dir: 1 | -1): number {
    return resolveIndex(dir === 1 ? 'next' : 'previous', {
      count: items.value.length,
      current: start
    })
  }

  function firstIndex(): number {
    return items.value.length > 0 ? 0 : -1
  }

  function lastIndex(): number {
    return items.value.length - 1
  }

  function findByValue(value: unknown): number {
    return items.value.findIndex((item) =>
      compareItemEquality(item.value, value, options.isItemEqualToValue())
    )
  }

  function focusItemElement(index: number, scroll = true): void {
    const item = items.value[index]
    if (!item) return
    item.element.focus({ preventScroll: true })
    if (!scroll) return
    const scroller = toValue(options.scroller)
    if (scroller) scrollItemIntoScroller(scroller, item.element)
  }

  return {
    items,
    count,
    highlightedIndex,
    registerItem,
    indexOf,
    labels,
    getValueAtIndex,
    isItemDisabled,
    stepIndex,
    firstIndex,
    lastIndex,
    findByValue,
    focusItemElement
  }
}
