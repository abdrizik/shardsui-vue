import { getCurrentInstance, inject, provide, type InjectionKey } from 'vue'

export type Context<T> = {
  get(): T
  getOr(): T | undefined
  set(context: T | undefined): void
}

export function createContext<T>(name: string, fallback?: T): Context<T> {
  const key: InjectionKey<T | undefined> = Symbol(name)
  const ownValues = new WeakMap<object, T | undefined>()

  const context: Context<T> = {
    get() {
      const value = context.getOr()
      if (value !== undefined) return value
      if (fallback !== undefined) return fallback
      throw new Error(`ShardsUI: this part must be rendered inside <${name}>.`)
    },

    getOr() {
      const instance = getCurrentInstance()
      if (instance && ownValues.has(instance)) return ownValues.get(instance)
      return inject(key, undefined)
    },

    set(value) {
      const instance = getCurrentInstance()
      if (instance) ownValues.set(instance, value)
      provide(key, value)
    }
  }

  return context
}
