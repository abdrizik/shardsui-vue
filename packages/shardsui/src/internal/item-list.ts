import { computed, shallowRef, type ComputedRef, type MaybeRefOrGetter, type ShallowRef } from 'vue'
import { observeDocumentOrder } from './document-order'
import { insertInDocumentOrder } from './document-position'

type ItemListOptions = {
  container: MaybeRefOrGetter<HTMLElement | null>
}

export type ItemList<Data extends object> = {
  items: ShallowRef<(Data & { element: HTMLElement })[]>
  count: ComputedRef<number>
  observeContainer: () => void
  registerItem: (element: HTMLElement, item: Data) => () => void
  indexOf: (element: Element | null) => number
}

export function createItemList<Data extends object>(
  options: ItemListOptions,
  observe = true
): ItemList<Data> {
  const items = shallowRef<(Data & { element: HTMLElement })[]>([])

  const count = computed(() => items.value.length)

  const indexMap = computed(
    () =>
      new Map<Element, number>(
        items.value.map((item, index): [Element, number] => [item.element, index])
      )
  )

  function observeContainer(): void {
    observeDocumentOrder({
      container: options.container,
      items,
      elementOf: (item: Data & { element: HTMLElement }) => item.element,
      reorder: (sorted: (Data & { element: HTMLElement })[]) => {
        items.value = sorted
      }
    })
  }

  function registerItem(element: HTMLElement, item: Data): () => void {
    const next = items.value.slice()
    insertInDocumentOrder(next, { ...item, element })
    items.value = next

    return () => {
      const index = items.value.findIndex((registered) => registered.element === element)
      if (index !== -1) {
        const remaining = items.value.slice()
        remaining.splice(index, 1)
        items.value = remaining
      }
    }
  }

  function indexOf(element: Element | null): number {
    return element ? (indexMap.value.get(element) ?? -1) : -1
  }

  if (observe) observeContainer()

  return { items, count, observeContainer, registerItem, indexOf }
}
