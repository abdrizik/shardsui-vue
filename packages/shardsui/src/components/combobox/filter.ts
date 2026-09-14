import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import { createCoreFilter } from '@/internal/create-filter'
import { isGroupedItems, stringifyAsLabel, type Group } from '@/internal/resolve-value-label'

type ComboboxFilterOptions = {
  locale: MaybeRefOrGetter<Intl.LocalesArgument>
  filteredItems: MaybeRefOrGetter<readonly unknown[] | readonly Group<unknown>[] | undefined>
  filter: () =>
    | null
    | ((item: unknown, query: string, itemToString?: (item: unknown) => string) => boolean)
    | undefined
  limit: MaybeRefOrGetter<number>
  items: MaybeRefOrGetter<readonly unknown[] | readonly Group<unknown>[] | undefined>
  hasItems: MaybeRefOrGetter<boolean>
  flatItems: MaybeRefOrGetter<readonly unknown[]>
  rawQuery: MaybeRefOrGetter<string>
  itemToStringLabel: () => ((item: unknown) => string) | undefined
  multiple: MaybeRefOrGetter<boolean>
  noSelection: MaybeRefOrGetter<boolean>
  currentValue: () => unknown
  queryChangedAfterOpen: MaybeRefOrGetter<boolean>
  closeQuery: MaybeRefOrGetter<string | null>
}

export type ComboboxFilter = {
  computedFilteredItems: ComputedRef<readonly unknown[] | readonly Group<unknown>[]>
  flatFilteredItems: ComputedRef<readonly unknown[]>
}

export function useComboboxFilter(options: ComboboxFilterOptions): ComboboxFilter {
  const collatorFilter = computed(() => createCoreFilter({ locale: toValue(options.locale) }))

  const selectedLabelString = computed(() =>
    !toValue(options.multiple) && !toValue(options.noSelection)
      ? stringifyAsLabel(options.currentValue(), options.itemToStringLabel())
      : ''
  )

  const query = computed(() => toValue(options.closeQuery) ?? toValue(options.rawQuery))

  const shouldBypassFiltering = computed(
    () =>
      !toValue(options.multiple) &&
      !toValue(options.noSelection) &&
      !toValue(options.queryChangedAfterOpen) &&
      query.value !== '' &&
      selectedLabelString.value.length === query.value.length &&
      collatorFilter.value.contains(selectedLabelString.value, query.value)
  )

  const shouldIgnoreExternalFiltering = computed(
    () =>
      toValue(options.hasItems) &&
      toValue(options.filteredItems) !== undefined &&
      shouldBypassFiltering.value
  )

  const filterQuery = computed(() => (shouldBypassFiltering.value ? '' : query.value))

  const activeFilter = computed(
    (): ((item: unknown, query: string, itemToString?: (item: unknown) => string) => boolean) => {
      const filter = options.filter()
      const itemToStringLabel = options.itemToStringLabel()
      if (filter === null) return () => true
      if (filter !== undefined) return filter
      return (item: unknown, currentQuery: string) =>
        item != null && collatorFilter.value.contains(item, currentQuery, itemToStringLabel)
    }
  )

  const computedFilteredItems = computed((): readonly unknown[] | readonly Group<unknown>[] => {
    const filteredItems = toValue(options.filteredItems)
    const items = toValue(options.items)
    const itemToStringLabel = options.itemToStringLabel()
    const limit = toValue(options.limit)
    const flatItems = toValue(options.flatItems)
    if (filteredItems && !shouldIgnoreExternalFiltering.value) {
      return filteredItems
    }

    if (!items) return []

    const currentQuery = filterQuery.value
    const filter = activeFilter.value

    if (isGroupedItems(items)) {
      const result: Group<unknown>[] = []
      let total = 0
      for (const group of items) {
        if (limit > -1 && total >= limit) break
        const remaining = limit > -1 ? limit - total : Infinity
        let slice: unknown[]
        if (currentQuery === '') {
          slice = group.items.slice(0, remaining)
        } else {
          slice = []
          for (const item of group.items) {
            if (slice.length >= remaining) break
            if (filter(item, currentQuery, itemToStringLabel)) slice.push(item)
          }
        }
        if (slice.length > 0) {
          result.push({ ...group, items: slice })
          total += slice.length
        }
      }
      return result
    }

    if (currentQuery === '') {
      return limit > -1 ? flatItems.slice(0, limit) : flatItems
    }

    const limited: unknown[] = []
    for (const item of flatItems) {
      if (limit > -1 && limited.length >= limit) break
      if (filter(item, currentQuery, itemToStringLabel)) limited.push(item)
    }
    return limited
  })

  const flatFilteredItems = computed((): readonly unknown[] => {
    const current = computedFilteredItems.value
    if (isGroupedItems(current)) {
      return current.flatMap((group) => group.items)
    }
    return current
  })

  return { computedFilteredItems, flatFilteredItems }
}
