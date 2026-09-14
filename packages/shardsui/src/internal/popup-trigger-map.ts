import { DEV } from 'esm-env'
import { shallowReactive } from 'vue'
import { contains } from './dom'

export type PopupTriggerMap<TriggerBindings = Record<string, unknown>> = {
  add(id: string, element: HTMLElement, triggerBindings?: () => TriggerBindings): () => void
  delete(id: string): void
  getTriggerBindingsById(id: string): TriggerBindings | undefined
  hasElement(element: Element): boolean
  containsNode(target: EventTarget | null | undefined): boolean
  getById(id: string): HTMLElement | undefined
  entries(): IterableIterator<[string, HTMLElement]>
  elements(): IterableIterator<HTMLElement>
  readonly size: number
}

export function createPopupTriggerMap<
  TriggerBindings = Record<string, unknown>
>(): PopupTriggerMap<TriggerBindings> {
  const idMap = shallowReactive(new Map<string, HTMLElement>())
  const triggerBindingsMap = new Map<string, () => TriggerBindings>()

  return {
    add(id, element, triggerBindings) {
      if (DEV) {
        for (const [existingId, existingElement] of idMap) {
          if (existingElement === element && existingId !== id) {
            throw new Error(
              'ShardsUI: A trigger element cannot be registered under multiple IDs in PopupTriggerMap.'
            )
          }
        }
      }

      if (triggerBindings) {
        triggerBindingsMap.set(id, triggerBindings)
      } else {
        triggerBindingsMap.delete(id)
      }
      const existingElement = idMap.get(id)
      if (existingElement !== element) {
        idMap.set(id, element)
      }

      return () => {
        if (idMap.get(id) === element) {
          triggerBindingsMap.delete(id)
          idMap.delete(id)
        }
      }
    },

    delete(id) {
      triggerBindingsMap.delete(id)
      idMap.delete(id)
    },

    getTriggerBindingsById(id) {
      return triggerBindingsMap.get(id)?.()
    },

    hasElement(element) {
      for (const registered of idMap.values()) {
        if (registered === element) {
          return true
        }
      }
      return false
    },

    containsNode(target) {
      for (const element of idMap.values()) {
        if (contains(element, target)) {
          return true
        }
      }
      return false
    },

    getById(id) {
      return idMap.get(id)
    },

    entries() {
      return idMap.entries()
    },

    elements() {
      return idMap.values()
    },

    get size() {
      return idMap.size
    }
  }
}
