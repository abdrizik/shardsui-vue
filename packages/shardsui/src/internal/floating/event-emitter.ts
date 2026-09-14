export type EventEmitter<Events> = {
  emit<K extends keyof Events>(event: K, data: Events[K]): void
  on<K extends keyof Events>(event: K, listener: (data: Events[K]) => void): () => void
  off<K extends keyof Events>(event: K, listener: (data: Events[K]) => void): void
}

export function createEventEmitter<Events>(): EventEmitter<Events> {
  const listeners: { [K in keyof Events]?: Set<(data: Events[K]) => void> } = {}

  function off<K extends keyof Events>(event: K, listener: (data: Events[K]) => void): void {
    listeners[event]?.delete(listener)
  }

  return {
    emit(event, data) {
      listeners[event]?.forEach((listener) => listener(data))
    },

    on(event, listener) {
      let eventListeners = listeners[event]
      if (!eventListeners) {
        eventListeners = new Set()
        listeners[event] = eventListeners
      }
      eventListeners.add(listener)
      return () => off(event, listener)
    },

    off
  }
}
