import {
  nextTick,
  shallowRef,
  toValue,
  type ComputedRef,
  type MaybeRefOrGetter,
  type ShallowRef
} from 'vue'
import { createAnimationFrame } from '@/internal/animation-frame'
import { isElementVisible, resolveIndex } from '@/internal/floating/list-navigation'
import { createItemList } from '@/internal/item-list'

type MenuItemRegistryOptions = {
  loopFocus: MaybeRefOrGetter<boolean>
  container: MaybeRefOrGetter<HTMLElement | null>
}

type MenuItem = { label: string; element: HTMLElement }

export type MenuItemRegistry = {
  items: ShallowRef<MenuItem[]>
  count: ComputedRef<number>
  highlightedIndex: ShallowRef<number>
  observeContainer: () => void
  registerItem: (element: HTMLElement, item: { label: string }) => () => void
  indexOf: (element: Element | null) => number
  focusItem: (index: number, scrollIntoViewIfNeeded?: boolean) => void
  stepIndex: (start: number, dir: 1 | -1) => number
  firstIndex: () => number
  lastIndex: () => number
  clearQueuedFocus: () => void
  applyPendingFocus: (pendingFocus: 'first' | 'last') => void
  elements: () => HTMLElement[]
  labels: () => string[]
}

function scrollIntoView(element: HTMLElement) {
  element.scrollIntoView({ block: 'nearest', inline: 'nearest' })
}

export function createMenuItemRegistry(options: MenuItemRegistryOptions): MenuItemRegistry {
  const list = createItemList<{ label: string }>({ container: options.container }, false)
  const { items, count, observeContainer, indexOf } = list
  const queuedFocusFrame = createAnimationFrame()

  const highlightedIndex = shallowRef(-1)

  function registerItem(element: HTMLElement, item: { label: string }): () => void {
    const unregister = list.registerItem(element, item)
    return () => {
      unregister()
      if (highlightedIndex.value >= items.value.length) {
        highlightedIndex.value = items.value.length - 1
      }
    }
  }

  function focusItem(i: number, scrollIntoViewIfNeeded = true): void {
    const item = items.value[i]
    if (!item) return
    queuedFocusFrame.cancel()
    highlightedIndex.value = i
    item.element.focus({ preventScroll: true })
    if (scrollIntoViewIfNeeded) scrollIntoView(item.element)
  }

  function isNativelyDisabled(i: number): boolean {
    const el = items.value[i]?.element
    return !!el && el.matches(':disabled')
  }

  function isHidden(i: number): boolean {
    const el = items.value[i]?.element
    return !!el && !isElementVisible(el)
  }

  function isSkipped(i: number): boolean {
    return isNativelyDisabled(i) || isHidden(i)
  }

  function stepIndex(start: number, dir: 1 | -1): number {
    return resolveIndex(dir === 1 ? 'next' : 'previous', {
      count: items.value.length,
      current: start,
      isSkipped,
      loop: toValue(options.loopFocus)
    })
  }

  function firstIndex(): number {
    const length = items.value.length
    if (length === 0) return -1
    for (let i = 0; i < length; i++) if (!isSkipped(i)) return i
    return 0
  }

  function lastIndex(): number {
    const length = items.value.length
    if (length === 0) return -1
    for (let i = length - 1; i >= 0; i--) if (!isSkipped(i)) return i
    return length - 1
  }

  function clearQueuedFocus(): void {
    queuedFocusFrame.cancel()
  }

  function applyPendingFocus(pendingFocus: 'first' | 'last'): void {
    if (items.value.length === 0) return
    const i = pendingFocus === 'first' ? firstIndex() : lastIndex()
    if (i === -1) return
    highlightedIndex.value = i
    const element = items.value[i]!.element
    // Focus must land synchronously where it can, or the next keystroke of the keydown that set
    // `pendingFocus` reaches the still-focused parent menu.
    queuedFocusFrame.cancel()
    element.focus({ preventScroll: true })
    const reassertFocus = () => {
      const document = element.ownerDocument
      if (document.activeElement !== element && document.activeElement === document.body) {
        element.focus({ preventScroll: true })
      }
    }
    void nextTick(reassertFocus)
    queuedFocusFrame.request(() => {
      reassertFocus()
      scrollIntoView(element)
    })
  }

  function elements(): HTMLElement[] {
    return items.value.map((it) => it.element)
  }

  function labels(): string[] {
    return items.value.map((it) => it.label)
  }

  return {
    items,
    count,
    highlightedIndex,
    observeContainer,
    registerItem,
    indexOf,
    focusItem,
    stepIndex,
    firstIndex,
    lastIndex,
    clearQueuedFocus,
    applyPendingFocus,
    elements,
    labels
  }
}
