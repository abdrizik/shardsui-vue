import { onWatcherCleanup, toValue, watchPostEffect, type MaybeRefOrGetter } from 'vue'
import { sortByDocumentPosition } from './document-position'

function hasMovedNode(entries: MutationRecord[]): boolean {
  for (const entry of entries) {
    for (const node of entry.removedNodes) {
      if (node.isConnected) return true
    }
  }

  return false
}

type DocumentOrderOptions<T> = {
  container: MaybeRefOrGetter<HTMLElement | null>
  items: MaybeRefOrGetter<readonly T[]>
  elementOf: (item: T) => HTMLElement
  reorder: (sorted: T[]) => void
}

export function observeDocumentOrder<T>(options: DocumentOrderOptions<T>): void {
  watchPostEffect(() => {
    const element = toValue(options.container)
    if (!element) return

    const observer = new MutationObserver((entries) => {
      if (!hasMovedNode(entries)) return

      const items = toValue(options.items)
      const { elementOf, reorder } = options

      // A detached element has no comparable position, so the registry is mid-update and the
      // pending registration will record the order itself.
      if (items.some((item) => !elementOf(item).isConnected)) return

      const isOrdered = items.every(
        (item, i) =>
          i === 0 || sortByDocumentPosition(elementOf(items[i - 1]), elementOf(item)) <= 0
      )
      if (isOrdered) return

      reorder(items.toSorted((a, b) => sortByDocumentPosition(elementOf(a), elementOf(b))))
    })

    observer.observe(element, { childList: true, subtree: true })
    onWatcherCleanup(() => observer.disconnect())
  })
}
