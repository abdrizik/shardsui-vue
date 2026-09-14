import {
  computed,
  onScopeDispose,
  ref,
  shallowRef,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref
} from 'vue'
import { contains, getTarget } from '@/internal/dom'
import { matchesFocusVisible } from '@/internal/floating/element'
import { generateId } from '@/internal/generate-id'
import { createTimeout, type Timeout } from '@/internal/timeout'
import { ToastProviderContext } from './context'
import type {
  StoredToast,
  ToastManagerAddOptions,
  ToastManagerPromiseOptions,
  ToastManagerUpdateOptions,
  ToastObject
} from './types'

function applyLimited(toasts: StoredToast[], limit: number) {
  let activeIndex = 0
  toasts.forEach((toast) => {
    if (toast.transitionStatus === 'ending') {
      return
    }
    toast.limited = activeIndex >= limit
    activeIndex += 1
  })
}

type TimerInfo = {
  timer: Timeout
  start: number
  delay: number
  remaining: number
  callback: () => void
}

function toUpdateOptions<Data extends object>(
  options: string | ToastManagerUpdateOptions<Data>
): ToastManagerUpdateOptions<Data> {
  return typeof options === 'string' ? { description: options } : options
}

function resolvePromiseOptions<T, Data extends object>(
  options:
    | string
    | ToastManagerUpdateOptions<Data>
    | ((result: T) => string | ToastManagerUpdateOptions<Data>),
  result: T
): ToastManagerUpdateOptions<Data> {
  return toUpdateOptions(options instanceof Function ? options(result) : options)
}

type ToastProviderOptions = {
  timeout: MaybeRefOrGetter<number>
  limit: MaybeRefOrGetter<number>
}

type ToastUpdateFlags = {
  resetTimer?: boolean
  markUpdated?: boolean
}

export function useToastProvider(options: ToastProviderOptions) {
  const timers = new Map<string, TimerInfo>()
  let areTimersPaused = false

  const toasts = ref([]) as Ref<StoredToast[]>
  const hovering = shallowRef(false)
  const focused = shallowRef(false)

  const isWindowFocused = shallowRef(true)
  const viewport = shallowRef<HTMLElement | null>(null)
  const prevFocusElement = shallowRef<HTMLElement | null>(null)

  const timeout = computed(() => toValue(options.timeout))
  const limit = computed(() => toValue(options.limit))

  const expanded = computed(() => hovering.value || focused.value)
  const expandedOrOutOfFocus = computed(
    () => hovering.value || focused.value || !isWindowFocused.value
  )
  const isEmpty = computed(() => toasts.value.length === 0)

  watch(limit, (value) => applyLimited(toasts.value, value), { immediate: true })

  onScopeDispose(() => clearAllTimers())

  function findToast(id: string): StoredToast | undefined {
    return toasts.value.find((toast) => toast.id === id)
  }

  function clearAllTimers(): void {
    timers.forEach(({ timer }) => timer.clear())
    timers.clear()
    areTimersPaused = false
  }

  function forgetTimer(id: string): void {
    timers.delete(id)
    if (timers.size === 0) {
      areTimersPaused = false
    }
  }

  function clearTimer(id: string): void {
    timers.get(id)?.timer.clear()
    forgetTimer(id)
  }

  function scheduleTimer(id: string, delay: number, callback: () => void): void {
    const start = Date.now()
    const shouldStartActive = !expandedOrOutOfFocus.value

    const timer = createTimeout()
    if (shouldStartActive) {
      timer.start(delay, () => {
        forgetTimer(id)
        callback()
      })
    }

    timers.set(id, {
      timer,
      start,
      delay,
      remaining: delay,
      callback
    })
  }

  const restoreFocusToPrevElement = (): void => {
    prevFocusElement.value?.focus({ preventScroll: true })
  }

  const indexOf = (id: string): number => {
    return toasts.value.findIndex((toast) => toast.id === id)
  }

  function restoreFocusAfterClose(toastId: string | undefined): void {
    const activeEl = (viewport.value?.ownerDocument ?? document).activeElement
    if (!contains(viewport.value, activeEl) || !matchesFocusVisible(activeEl)) {
      return
    }

    if (toastId === undefined) {
      restoreFocusToPrevElement()
      return
    }

    const currentIndex = indexOf(toastId)

    const scan = (from: number, step: number) => {
      for (let index = from; index >= 0 && index < toasts.value.length; index += step) {
        if (toasts.value[index].transitionStatus !== 'ending') {
          return toasts.value[index]
        }
      }
      return null
    }

    const nextToast = scan(currentIndex + 1, 1) ?? scan(currentIndex - 1, -1)

    if (nextToast) {
      nextToast.element?.focus()
    } else {
      restoreFocusToPrevElement()
    }
  }

  const visibleIndexOf = (id: string): number => {
    let visibleIndex = 0
    for (const toast of toasts.value) {
      if (toast.id === id) {
        return toast.transitionStatus === 'ending' ? -1 : visibleIndex
      }
      if (toast.transitionStatus !== 'ending') visibleIndex++
    }
    return -1
  }

  const stackIndexOf = (toast: ToastObject): number => {
    return toast.transitionStatus === 'ending' ? indexOf(toast.id) : visibleIndexOf(toast.id)
  }

  const offsetYOf = (id: string): number => {
    let offsetY = 0
    for (const toast of toasts.value) {
      if (toast.id === id) return offsetY
      offsetY += toast.height || 0
    }
    return 0
  }

  function deleteToastAt(index: number): void {
    toasts.value.splice(index, 1)
    if (toasts.value.length === 0) {
      hovering.value = false
      focused.value = false
    }
  }

  const remove = (toastId: string): void => {
    const index = indexOf(toastId)
    if (index === -1) return

    toasts.value[index].onRemove?.()
    deleteToastAt(index)
  }

  const pauseTimers = (): void => {
    if (areTimersPaused) return
    areTimersPaused = true
    timers.forEach((entry) => {
      if (!entry.timer.isStarted()) return
      entry.timer.clear()
      entry.remaining = Math.max(entry.remaining - (Date.now() - entry.start), 0)
    })
  }

  const resumeTimers = (): void => {
    if (!areTimersPaused) return
    areTimersPaused = false
    timers.forEach((entry, id) => {
      entry.remaining = entry.remaining > 0 ? entry.remaining : entry.delay
      entry.timer.start(entry.remaining, () => {
        forgetTimer(id)
        entry.callback()
      })
      entry.start = Date.now()
    })
  }

  const applyUpdate = <Data extends object>(
    id: string,
    updates: Partial<Omit<ToastObject<Data>, 'id'>>,
    { resetTimer = false, markUpdated = false }: ToastUpdateFlags = {}
  ): void => {
    const toast = findToast(id)
    if (!toast) return

    if (toast.transitionStatus === 'ending') return

    const wasLoading = toast.type === 'loading'

    Object.assign(toast, updates, markUpdated ? { updateKey: toast.updateKey + 1 } : null)

    const nextTimeout = toast.timeout ?? timeout.value
    const timeoutUpdated = Object.hasOwn(updates, 'timeout')

    const shouldHaveTimer = toast.type !== 'loading' && nextTimeout > 0
    const hasTimer = timers.has(id)

    if (!shouldHaveTimer && hasTimer) {
      clearTimer(id)
      return
    }

    if (shouldHaveTimer && (!hasTimer || timeoutUpdated || wasLoading || resetTimer)) {
      clearTimer(id)
      scheduleTimer(id, nextTimeout, () => close(id))

      if (expandedOrOutOfFocus.value) {
        pauseTimers()
      }
    }
  }

  const close = (toastId?: string): void => {
    const closeAll = toastId === undefined
    let toastsToClose: StoredToast[]

    if (closeAll) {
      toastsToClose = toasts.value
      clearAllTimers()
    } else {
      const toast = findToast(toastId)
      if (!toast) return
      toastsToClose = [toast]
      clearTimer(toastId)
    }

    const activeToastsToClose = toastsToClose.filter((toast) => toast.transitionStatus !== 'ending')

    toastsToClose.forEach((toast) => {
      toast.transitionStatus = 'ending'
      toast.height = 0
    })
    applyLimited(toasts.value, limit.value)

    const hasActiveToasts = toasts.value.some((toast) => toast.transitionStatus !== 'ending')
    if (!hasActiveToasts) {
      hovering.value = false
      focused.value = false
    }

    activeToastsToClose.forEach((toast) => {
      toast.onClose?.()
    })

    restoreFocusAfterClose(toastId)
  }

  const add = <Data extends object>(options: ToastManagerAddOptions<Data>): string => {
    const id = options.id || generateId('toast')

    if (options.id) {
      const existingIndex = indexOf(options.id)
      if (existingIndex !== -1) {
        const existing = toasts.value[existingIndex]
        if (existing.transitionStatus === 'ending') {
          deleteToastAt(existingIndex)
        } else {
          const { id: _, transitionStatus: __, ...updates } = options
          applyUpdate(options.id, updates, { resetTimer: true, markUpdated: true })
          return options.id
        }
      }
    }

    const toastToAdd: StoredToast<Data> = {
      ...options,
      id,
      updateKey: 0,
      transitionStatus: 'starting'
    }

    toasts.value.unshift(toastToAdd as StoredToast)
    applyLimited(toasts.value, limit.value)

    const duration = toastToAdd.timeout ?? timeout.value
    if (toastToAdd.type !== 'loading' && duration > 0) {
      scheduleTimer(id, duration, () => close(id))
    }

    if (expandedOrOutOfFocus.value) {
      pauseTimers()
    }

    return id
  }

  const update = <Data extends object>(
    id: string,
    updates: ToastManagerUpdateOptions<Data>
  ): void => {
    applyUpdate(id, updates, { markUpdated: true })
  }

  const promise = <Value, Data extends object>(
    promiseValue: Promise<Value>,
    options: ToastManagerPromiseOptions<Value, Data> & {
      setPromise?: (promise: Promise<Value>) => void
    }
  ): Promise<Value> => {
    const loadingOptions = toUpdateOptions(options.loading)
    const id = add({
      ...loadingOptions,
      type: 'loading'
    })

    const handledPromise = promiseValue
      .then((result: Value) => {
        const successOptions = resolvePromiseOptions(options.success, result)
        update(id, {
          ...successOptions,
          type: 'success',
          timeout: successOptions.timeout
        })
        return result
      })
      .catch((error) => {
        const errorOptions = resolvePromiseOptions(options.error, error)
        update(id, {
          ...errorOptions,
          type: 'error',
          timeout: errorOptions.timeout
        })
        return Promise.reject(error)
      })

    options.setPromise?.(handledPromise)

    return handledPromise
  }

  const collapseOnOutsideTouch = (event: PointerEvent): void => {
    if (event.pointerType !== 'touch') return
    const target = getTarget(event)
    if (contains(viewport.value, target)) return

    resumeTimers()
    hovering.value = false
    focused.value = false
  }

  return {
    toasts,
    hovering,
    focused,
    isWindowFocused,
    viewport,
    prevFocusElement,
    timeout,
    limit,
    expanded,
    expandedOrOutOfFocus,
    isEmpty,
    restoreFocusToPrevElement,
    indexOf,
    visibleIndexOf,
    stackIndexOf,
    offsetYOf,
    remove,
    applyUpdate,
    pauseTimers,
    resumeTimers,
    close,
    add,
    update,
    promise,
    collapseOnOutsideTouch
  }
}

export type ToastProvider = ReturnType<typeof useToastProvider>

type ToastRootOptions = {
  toast: MaybeRefOrGetter<ToastObject>
  ref: MaybeRefOrGetter<HTMLElement | null>
}

export function useToastRoot(options: ToastRootOptions) {
  const provider = ToastProviderContext.get()

  const titleId = shallowRef<string | undefined>(undefined)
  const descriptionId = shallowRef<string | undefined>(undefined)
  const labelIds: { titleId?: string; descriptionId?: string } = {}

  const toast = computed(() => toValue(options.toast))

  function registerLabelId(part: 'title' | 'description', id: string): () => void {
    const field = part === 'title' ? 'titleId' : 'descriptionId'
    const target = part === 'title' ? titleId : descriptionId

    labelIds[field] = id
    target.value = id

    return () => {
      if (labelIds[field] !== id) return
      labelIds[field] = undefined
      target.value = undefined
    }
  }

  const recalculateHeight = (): void => {
    const element = toValue(options.ref)
    if (!element) return

    const previousHeight = element.style.height
    element.style.height = 'auto'
    const height = element.offsetHeight
    element.style.height = previousHeight

    provider.applyUpdate(toast.value.id, {
      element,
      height,
      transitionStatus: undefined
    })
  }

  watch(() => [toValue(options.ref), toast.value] as const, recalculateHeight, {
    immediate: true,
    flush: 'post'
  })

  return { titleId, descriptionId, toast, registerLabelId, recalculateHeight }
}

export type ToastRoot = ReturnType<typeof useToastRoot>
