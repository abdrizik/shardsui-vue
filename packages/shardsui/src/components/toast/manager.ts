import { generateId } from '@/internal/generate-id'
import { ToastProviderContext } from './context'
import type {
  ToastManagerAddOptions,
  ToastManagerPromiseOptions,
  ToastManagerUpdateOptions,
  ToastObject
} from './types'

type ToastPromiseEventOptions = ToastManagerPromiseOptions<unknown> & {
  promise: Promise<unknown>
  setPromise: (promise: Promise<unknown>) => void
}

type ToastManagerEvent =
  | { action: 'add'; options: ToastObject }
  | { action: 'close'; options: { id?: string } }
  | { action: 'update'; options: ToastManagerUpdateOptions & { id: string } }
  | { action: 'promise'; options: ToastPromiseEventOptions }

export function getToastManager<Data extends object = object>() {
  const provider = ToastProviderContext.get()
  return {
    get toasts() {
      return provider.toasts.value as ToastObject<Data>[]
    },
    add: <T extends Data = Data>(options: ToastManagerAddOptions<T>): string =>
      provider.add(options),
    close: provider.close,
    update: <T extends Data = Data>(id: string, updates: ToastManagerUpdateOptions<T>): void =>
      provider.update(id, updates),
    promise: <Value, T extends Data = Data>(
      promiseValue: Promise<Value>,
      options: ToastManagerPromiseOptions<Value, T>
    ): Promise<Value> => provider.promise(promiseValue, options)
  }
}

export type ToastManager<Data extends object = object> = {
  subscribe(listener: (data: ToastManagerEvent) => void): () => void
  add<T extends Data = Data>(options: ToastManagerAddOptions<T>): string
  close(id?: string): void
  update<T extends Data = Data>(id: string, updates: ToastManagerUpdateOptions<T>): void
  promise<Value, T extends Data = Data>(
    promiseValue: Promise<Value>,
    options: ToastManagerPromiseOptions<Value, T>
  ): Promise<Value>
}

/** A detached toast queue a `Toast.Provider` subscribes to. */
export function createToastManager<Data extends object = object>(): ToastManager<Data> {
  const listeners = new Set<(data: ToastManagerEvent) => void>()

  function emit(data: ToastManagerEvent) {
    listeners.forEach((listener) => listener(data))
  }

  return {
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },

    add<T extends Data = Data>(options: ToastManagerAddOptions<T>): string {
      const id = options.id || generateId('toast')
      const toastToAdd: ToastObject<T> = { ...options, id, transitionStatus: 'starting' }
      emit({ action: 'add', options: toastToAdd })
      return id
    },

    close(id?: string) {
      emit({ action: 'close', options: { id } })
    },

    update<T extends Data = Data>(id: string, updates: ToastManagerUpdateOptions<T>) {
      emit({ action: 'update', options: { ...updates, id } })
    },

    promise<Value, T extends Data = Data>(
      promiseValue: Promise<Value>,
      options: ToastManagerPromiseOptions<Value, T>
    ): Promise<Value> {
      let handledPromise = promiseValue
      emit({
        action: 'promise',
        options: {
          ...options,
          promise: promiseValue,
          setPromise(promise: Promise<Value>) {
            handledPromise = promise
          }
        } as ToastPromiseEventOptions
      })
      return handledPromise
    }
  }
}
