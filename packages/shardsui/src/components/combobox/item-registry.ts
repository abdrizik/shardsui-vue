import {
  computed,
  shallowReactive,
  shallowRef,
  toValue,
  watchPostEffect,
  type ComputedRef,
  type MaybeRefOrGetter,
  type ShallowRef
} from 'vue'
import { isElementVisible } from '@/internal/floating/list-navigation'
import { createItemList } from '@/internal/item-list'

// Assumed width of a grid whose rows carry no `[role="row"]` element to measure.
const GRID_COLUMNS = 2

type RegisteredItem = { value: unknown; id?: () => string | undefined }

export type HighlightReason = 'keyboard' | 'pointer' | 'none'

export type ComboboxItemRegistryOptions = {
  loopFocus: MaybeRefOrGetter<boolean>
  autoHighlight: MaybeRefOrGetter<boolean | 'always'>
  virtualized: MaybeRefOrGetter<boolean>
  grid: MaybeRefOrGetter<boolean>
  itemCount: MaybeRefOrGetter<number>
  container: MaybeRefOrGetter<HTMLElement | null>
}

export type ComboboxItemRegistry = {
  items: ShallowRef<(RegisteredItem & { element: HTMLElement })[]>
  count: ComputedRef<number>
  highlightedIndex: ShallowRef<number>
  lastHighlightReason: ShallowRef<HighlightReason>
  registerItem: (element: HTMLElement, item: RegisteredItem) => () => void
  registerVirtualItem: (index: number, element: HTMLElement) => () => void
  indexOf: (element: Element | null) => number
  stepIndex: (start: number, dir: 1 | -1) => number
  moveHighlight: (dir: 1 | -1) => void
  firstIndex: () => number
  lastIndex: () => number
  setHighlightedIndex: (index: number, reason?: HighlightReason) => void
  focusItem: (index: number, reason?: HighlightReason) => void
  getItemElement: (index: number) => HTMLElement | null
  getItemId: (index: number) => string | undefined
}

export function createComboboxItemRegistry(
  options: ComboboxItemRegistryOptions
): ComboboxItemRegistry {
  const list = createItemList<RegisteredItem>({ container: options.container })
  const { items, registerItem, indexOf } = list

  const virtualItems = shallowReactive(new Map<number, HTMLElement>())

  const highlightedIndex = shallowRef(-1)
  const lastHighlightReason = shallowRef<HighlightReason>('none')

  const count = computed(() =>
    toValue(options.virtualized) ? toValue(options.itemCount) : items.value.length
  )

  const allowEscape = computed(() => toValue(options.loopFocus) && !toValue(options.autoHighlight))

  function getItemElement(i: number): HTMLElement | null {
    if (toValue(options.virtualized)) {
      return virtualItems.get(i) ?? null
    }
    return items.value[i]?.element ?? null
  }

  function getItemId(i: number): string | undefined {
    if (toValue(options.virtualized)) {
      return virtualItems.get(i)?.id || undefined
    }
    const item = items.value[i]
    return (item?.id?.() ?? item?.element.id) || undefined
  }

  const grid = computed(() => {
    const total = count.value
    const rows: number[][] = []
    const rowOf: number[] = []
    let currentRowElement: Element | null | undefined
    let hasRowElements = false
    let renderedCount = 0

    for (let i = 0; i < total; i += 1) {
      const element = getItemElement(i)
      if (!element) continue
      renderedCount += 1
      const rowElement = element.closest('[role="row"]')
      if (rowElement) hasRowElements = true
      if (rows.length === 0 || rowElement !== currentRowElement) {
        rows.push([])
        currentRowElement = rowElement
      }
      rows[rows.length - 1]!.push(i)
      rowOf[i] = rows.length - 1
    }

    let hasDomRows = false
    let widestRow = 0
    if (hasRowElements) {
      for (const row of rows) {
        if (row.length > widestRow) widestRow = row.length
        if (row.length !== GRID_COLUMNS) hasDomRows = true
      }
    }

    return {
      rows,
      rowOf,
      hasDomRows,
      hasGaps: hasDomRows && renderedCount < total,
      columns: widestRow || GRID_COLUMNS
    }
  })

  watchPostEffect(() => {
    if (highlightedIndex.value < count.value) return
    lastHighlightReason.value = 'none'
    highlightedIndex.value = -1
  })

  function registerVirtualItem(index: number, element: HTMLElement): () => void {
    virtualItems.set(index, element)

    return () => {
      if (virtualItems.get(index) !== element) return
      virtualItems.delete(index)
    }
  }

  function isSkipped(i: number): boolean {
    const element = getItemElement(i)
    return !!element && !isElementVisible(element)
  }

  function step(start: number, dir: 1 | -1, amount = 1): number {
    const total = count.value
    let i = start
    do {
      i += dir * amount
    } while (i >= 0 && i <= total - 1 && isSkipped(i))
    return i
  }

  function minIndex(): number {
    return step(-1, 1)
  }

  function maxIndex(): number {
    return step(count.value, -1)
  }

  function stepIndex(start: number, dir: 1 | -1): number {
    const total = count.value
    if (total === 0) return start
    const escapes = allowEscape.value
    let i = step(start, dir)
    if (i < 0) {
      if (!toValue(options.loopFocus)) return start
      if (escapes && start !== -1) return -1
      i = maxIndex()
    } else if (i >= total) {
      if (!toValue(options.loopFocus)) return start
      if (escapes && start !== total) return -1
      i = minIndex()
    }
    return i < 0 || i >= total ? start : i
  }

  function moveThroughDomRows(start: number, dir: 1 | -1): number | undefined {
    const { rows, rowOf, hasDomRows, hasGaps } = grid.value
    if (!hasDomRows) return undefined
    const currentRow = rowOf[start]
    if (currentRow == null) return undefined

    const column = rows[currentRow]!.indexOf(start)

    for (let nextRow = currentRow + dir, i = 0; i < rows.length; i += 1, nextRow += dir) {
      if (nextRow < 0 || nextRow >= rows.length) {
        if (!toValue(options.loopFocus) || hasGaps) return undefined
        nextRow = nextRow < 0 ? rows.length - 1 : 0
      }
      const row = rows[nextRow]!
      for (let c = Math.min(column, row.length - 1); c >= 0; c -= 1) {
        if (!isSkipped(row[c]!)) return row[c]
      }
    }

    return undefined
  }

  function moveThroughInferredRows(start: number, dir: 1 | -1): number | undefined {
    const { hasGaps, columns } = grid.value
    if (!hasGaps) return undefined

    const highest = maxIndex()
    const column = start % columns
    const rowStep = dir * columns
    const lastRowStart = highest - (highest % columns)
    const rowCount = Math.floor(highest / columns) + 1

    for (
      let rowStart = start - column + rowStep, visited = 0;
      visited < rowCount;
      visited += 1, rowStart += rowStep
    ) {
      if (rowStart < 0 || rowStart > highest) {
        if (!toValue(options.loopFocus)) return undefined
        rowStart = rowStart < 0 ? lastRowStart : 0
      }
      const rowEnd = Math.min(rowStart + column, highest, rowStart + columns - 1)
      for (let candidate = rowEnd; candidate >= rowStart; candidate -= 1) {
        if (!isSkipped(candidate)) return candidate
      }
    }

    return undefined
  }

  function gridMove(start: number, dir: 1 | -1): number {
    const total = count.value
    if (total === 0 || start < 0 || start >= total) return start

    let next = moveThroughDomRows(start, dir) ?? moveThroughInferredRows(start, dir)

    if (next === undefined) {
      const { columns } = grid.value
      const highest = maxIndex()
      next = step(start, dir, columns)

      if (toValue(options.loopFocus)) {
        if (dir === -1 && (start - columns < minIndex() || next < 0)) {
          const column = start % columns
          const lastColumn = highest % columns
          const offset = highest - (lastColumn - column)
          if (lastColumn === column) next = highest
          else next = lastColumn > column ? offset : offset - columns
        }
        if (dir === 1 && start + columns > highest) {
          next = step((start % columns) - columns, 1, columns)
        }
      }
    }

    return next < 0 || next >= total ? start : next
  }

  function setHighlightedIndex(i: number, reason: HighlightReason = 'none'): void {
    lastHighlightReason.value = reason
    highlightedIndex.value = i
    if (reason === 'pointer') return
    getItemElement(i)?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  function focusItem(i: number, reason: HighlightReason = 'keyboard'): void {
    if (i !== -1 && !toValue(options.virtualized) && !items.value[i]) return
    setHighlightedIndex(i, reason)
  }

  function moveHighlight(dir: 1 | -1): void {
    const current = highlightedIndex.value
    if (current >= 0 && toValue(options.grid)) {
      focusItem(gridMove(current, dir))
      return
    }
    const edgeStart = dir === 1 ? -1 : count.value
    const start = current >= 0 ? current : edgeStart
    focusItem(stepIndex(start, dir))
  }

  function lastIndex(): number {
    const i = maxIndex()
    return i < 0 ? -1 : i
  }

  function firstIndex(): number {
    const i = minIndex()
    return i >= count.value ? -1 : i
  }

  return {
    items,
    count,
    highlightedIndex,
    lastHighlightReason,
    registerItem,
    registerVirtualItem,
    indexOf,
    stepIndex,
    moveHighlight,
    firstIndex,
    lastIndex,
    setHighlightedIndex,
    focusItem,
    getItemElement,
    getItemId
  }
}
