import { computed, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'
import { TYPEAHEAD_RESET_MS } from '../constants'
import { contains } from '../dom'
import { useTimeout } from '../timeout'
import { isElementVisible } from './list-navigation'

type TypeaheadOptions = {
  items: MaybeRefOrGetter<Array<string | undefined | null>>
  activeIndex: MaybeRefOrGetter<number>
  onMatch: (index: number) => void
  enabled?: MaybeRefOrGetter<boolean | undefined>
  selectedIndex?: MaybeRefOrGetter<number | null | undefined>
  elements?: MaybeRefOrGetter<Array<HTMLElement | null> | undefined>
  isIndexDisabled?: (index: number) => boolean
  onTyping?: () => ((isTyping: boolean) => void) | undefined
  resetMs?: MaybeRefOrGetter<number | undefined>
  referenceElement?: MaybeRefOrGetter<Element | null | undefined>
  floatingElement?: MaybeRefOrGetter<Element | null | undefined>
  open?: MaybeRefOrGetter<boolean | undefined>
}

function isItemAvailable(opts: TypeaheadOptions, idx: number): boolean {
  const element = toValue(opts.elements)?.[idx]
  if (element && !isElementVisible(element)) return false
  if (element?.matches(':disabled')) return false
  return !opts.isIndexDisabled?.(idx)
}

function getMatchingIndex(
  opts: TypeaheadOptions,
  items: Array<string | undefined | null>,
  query: string,
  startIndex = 0
): number {
  if (items.length === 0) return -1
  const normalizedStart = ((startIndex % items.length) + items.length) % items.length
  const lower = query.toLowerCase()
  for (let offset = 0; offset < items.length; offset += 1) {
    const idx = (normalizedStart + offset) % items.length
    const text = items[idx]
    if (text?.toLowerCase().startsWith(lower) && isItemAvailable(opts, idx)) return idx
  }
  return -1
}

export function createTypeahead(options: TypeaheadOptions) {
  const timeout = useTimeout()

  let buffer = ''
  let prevIndex: number | null = null
  let matchIndex: number | null = null

  // Per-field computeds, not one inline read of every option: the reset below must depend on
  // `open` and `selectedIndex` alone, or any other option changing would clear a live buffer.
  const open = computed(() => toValue(options.open) ?? true)
  const selectedIndex = computed(() => toValue(options.selectedIndex) ?? null)

  watchEffect(() => {
    if (!open.value && selectedIndex.value !== null) return

    timeout.clear()
    matchIndex = null
    buffer = ''
  })

  return {
    matchKey: (event: KeyboardEvent) => {
      if (toValue(options.enabled) === false) return

      const items = toValue(options.items)
      const onTyping = options.onTyping?.()

      if (buffer.length > 0 && event.key === ' ') {
        event.preventDefault()
        event.stopPropagation()
        onTyping?.(true)
      }

      if (buffer.length > 0 && buffer[0] !== ' ') {
        if (getMatchingIndex(options, items, buffer, 0) === -1 && event.key !== ' ') {
          onTyping?.(false)
        }
      }

      if (event.key.length !== 1 || event.altKey || event.ctrlKey || event.metaKey) {
        return
      }

      if ((toValue(options.open) ?? true) && event.key !== ' ') {
        event.preventDefault()
        event.stopPropagation()
        onTyping?.(true)
      }

      const isNewSession = buffer === ''
      if (isNewSession) {
        prevIndex = toValue(options.selectedIndex) ?? toValue(options.activeIndex)
      }

      const allowRapidSuccessionOfFirstLetter = items.every(
        (text, index) =>
          !text ||
          text[0]?.toLowerCase() !== text[1]?.toLowerCase() ||
          !isItemAvailable(options, index)
      )

      if (allowRapidSuccessionOfFirstLetter && buffer === event.key) {
        buffer = ''
        prevIndex = matchIndex
      }

      buffer += event.key
      timeout.start(toValue(options.resetMs) ?? TYPEAHEAD_RESET_MS, () => {
        buffer = ''
        prevIndex = matchIndex
        options.onTyping?.()?.(false)
      })

      const startIndex = (prevIndex ?? 0) + 1
      const idx = getMatchingIndex(options, items, buffer, startIndex)

      if (idx !== -1) {
        options.onMatch(idx)
        matchIndex = idx
      } else if (event.key !== ' ') {
        buffer = ''
        onTyping?.(false)
      }
    },

    resetOnFocusLeave: (event: FocusEvent) => {
      if (toValue(options.enabled) === false) return

      const next = event.relatedTarget
      const referenceElement = toValue(options.referenceElement)
      const floatingElement = toValue(options.floatingElement)

      const withinComposite = contains(referenceElement, next) || contains(floatingElement, next)

      if (withinComposite) {
        return
      }

      timeout.clear()
      buffer = ''
      prevIndex = matchIndex
      options.onTyping?.()?.(false)
    }
  }
}
