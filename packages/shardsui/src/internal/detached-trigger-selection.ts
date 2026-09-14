import { toValue, watch, type MaybeRefOrGetter } from 'vue'
import { isHTMLElement } from './dom'
import type { PopupTriggerMap } from './popup-trigger-map'

type DetachedTriggerSelectionOptions = {
  triggerElements: PopupTriggerMap
  triggerId: MaybeRefOrGetter<string | null>
  open: MaybeRefOrGetter<boolean>
  triggerElement: MaybeRefOrGetter<HTMLElement | null>
  setTriggerElement: (element: HTMLElement) => void
}

export function useDetachedTriggerSelection(options: DetachedTriggerSelectionOptions): void {
  const triggerElements = options.triggerElements

  watch(
    () => {
      const triggerId = toValue(options.triggerId)
      return [triggerId, triggerId ? triggerElements.getById(triggerId) : undefined] as const
    },
    ([triggerId, element]) => {
      if (!triggerId || !element) return
      options.setTriggerElement(element)
    },
    { immediate: true, flush: 'pre' }
  )

  watch(
    () => [toValue(options.open), toValue(options.triggerElement), triggerElements.size] as const,
    ([open, triggerElement, size]) => {
      if (open && triggerElement == null && size === 1) {
        const [[, element]] = triggerElements.entries()
        options.setTriggerElement(element)
      }
    },
    { immediate: true, flush: 'pre' }
  )
}

export type ActiveTriggerSelection = {
  setActiveTriggerId: (id: string | null) => void
  setTriggerElement: (element: HTMLElement | null) => void
  applyTriggerBindings: (id: string | null) => void
}

export function selectActiveTrigger(
  selection: ActiveTriggerSelection,
  open: boolean,
  trigger: HTMLElement | null | undefined
): void {
  const triggerId = trigger?.id || null
  if (!triggerId && !open) return

  selection.setActiveTriggerId(triggerId)
  if (!open) return

  if (isHTMLElement(trigger)) selection.setTriggerElement(trigger)
  selection.applyTriggerBindings(triggerId)
}

type DetachedTriggerSelectionByIdOptions = ActiveTriggerSelection & {
  triggerElements: PopupTriggerMap
  triggerId: MaybeRefOrGetter<string | null>
  open: MaybeRefOrGetter<boolean>
  activeTriggerId: MaybeRefOrGetter<string | null>
  triggerElement: MaybeRefOrGetter<HTMLElement | null>
  closeOnActiveTriggerUnmount?: (() => boolean) | undefined
}

export function useDetachedTriggerSelectionById(
  options: DetachedTriggerSelectionByIdOptions
): void {
  const triggerElements = options.triggerElements

  watch(
    () => [toValue(options.triggerId), toValue(options.open)] as const,
    ([id, isOpen]) => {
      if (!id) return
      options.setActiveTriggerId(id)
      if (isOpen) options.applyTriggerBindings(id)
    },
    { immediate: true, flush: 'pre' }
  )

  watch(
    () => [toValue(options.open), toValue(options.activeTriggerId), triggerElements.size] as const,
    ([isOpen, activeId, size]) => {
      if (isOpen && activeId == null && size === 1) {
        const [[id, element]] = triggerElements.entries()
        options.setActiveTriggerId(id)
        options.setTriggerElement(element)
        options.applyTriggerBindings(id)
      }
    },
    { immediate: true, flush: 'pre' }
  )

  watch(
    () => {
      const activeId = toValue(options.activeTriggerId)
      return [
        activeId,
        activeId ? triggerElements.getById(activeId) : undefined,
        toValue(options.triggerElement)
      ] as const
    },
    ([activeId, element, current]) => {
      if (!activeId || !element) return
      if (current !== element) options.setTriggerElement(element)
    },
    { immediate: true, flush: 'post' }
  )

  watch(
    () => {
      const activeId = toValue(options.activeTriggerId)
      return [
        toValue(options.open),
        activeId,
        activeId ? triggerElements.getById(activeId) : undefined
      ] as const
    },
    ([isOpen, lostTriggerId, element]) => {
      if (!isOpen || !lostTriggerId || element) return

      // Deferred so a replacement trigger with the same id can register first.
      queueMicrotask(() => {
        if (
          !toValue(options.open) ||
          toValue(options.activeTriggerId) !== lostTriggerId ||
          triggerElements.getById(lostTriggerId)
        ) {
          return
        }
        if (!options.closeOnActiveTriggerUnmount?.()) return
        options.setActiveTriggerId(null)
        options.setTriggerElement(null)
      })
    },
    { immediate: true, flush: 'post' }
  )
}
