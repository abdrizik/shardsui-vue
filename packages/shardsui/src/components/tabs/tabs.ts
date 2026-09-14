import {
  computed,
  shallowReactive,
  shallowRef,
  toValue,
  watchEffect,
  watchPostEffect,
  type MaybeRefOrGetter
} from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import { sortByDocumentPosition } from '@/internal/document-position'
import type { Orientation } from '@/internal/types'

export type TabsValue = string | number | null
export type TabsOrientation = Orientation
export type TabsActivationDirection = 'left' | 'right' | 'up' | 'down' | 'none'

export type TabsState = {
  orientation: TabsOrientation
  activationDirection: TabsActivationDirection
}

export type TabMeta = {
  readonly id: string
  readonly value: TabsValue
  readonly element: HTMLElement | null
  readonly disabled: boolean
}

type TabsRootOptions = {
  value: MaybeRefOrGetter<TabsValue | undefined>
  setValue: (value: TabsValue) => void
  orientation: MaybeRefOrGetter<TabsOrientation>
}

export function useTabsRoot(options: TabsRootOptions) {
  const tabs = shallowReactive(new Map<HTMLElement, TabMeta>())
  const panels = shallowReactive(new Map<TabsValue, string>())

  const isControlled = toValue(options.value) !== undefined

  const internalValue = shallowRef<TabsValue>(0)
  let initialNotified = isControlled
  let didRegisterTabs = false

  const activationDirection = shallowRef<TabsActivationDirection>('none')

  const value = computed<TabsValue>(() => {
    const current = toValue(options.value)
    return current !== undefined ? current : internalValue.value
  })
  const orientation = computed(() => toValue(options.orientation))

  let previousValue: TabsValue = value.value

  const state = computed<TabsState>(() => ({
    orientation: orientation.value,
    activationDirection: activationDirection.value
  }))

  const orderedTabs = computed(() =>
    Array.from(tabs.values())
      .filter((meta): meta is TabMeta & { element: HTMLElement } => !!meta.element?.isConnected)
      .sort((a, b) => sortByDocumentPosition(a.element, b.element))
  )

  const stateAttrs = computed(() =>
    dataAttrs({
      orientation: orientation.value,
      'activation-direction': activationDirection.value
    })
  )

  function getTabMetaByValue(tabValue: TabsValue): TabMeta | undefined {
    for (const meta of tabs.values()) {
      if (meta.value === tabValue) return meta
    }
    return undefined
  }

  function getTabElementByValue(tabValue: TabsValue): HTMLElement | null {
    return getTabMetaByValue(tabValue)?.element ?? null
  }

  function updateValue(next: TabsValue) {
    internalValue.value = next
    options.setValue(next)
  }

  function commitAutomaticValueChange(fallback: TabsValue) {
    activationDirection.value = 'none'
    previousValue = fallback
    updateValue(fallback)
    initialNotified = true
  }

  function computeDirection(from: TabsValue, to: TabsValue): TabsActivationDirection {
    if (from == null || to == null) return 'none'

    const fromElement = getTabElementByValue(from)
    const toElement = getTabElementByValue(to)

    if (!fromElement && !toElement) return 'none'

    const [axis, backward, forward] =
      orientation.value === 'horizontal'
        ? (['left', 'left', 'right'] as const)
        : (['top', 'up', 'down'] as const)

    if (!fromElement || !toElement) {
      if (typeof from !== typeof to) return 'none'
      return to > from ? forward : backward
    }

    const fromPosition = fromElement.getBoundingClientRect()[axis]
    const toPosition = toElement.getBoundingClientRect()[axis]

    if (toPosition < fromPosition) return backward
    if (toPosition > fromPosition) return forward
    return 'none'
  }

  watchPostEffect(() => {
    if (isControlled) return

    if (tabs.size === 0) {
      if (!didRegisterTabs || value.value === null) return
      commitAutomaticValueChange(null)
      return
    }

    didRegisterTabs = true

    if (value.value === null) return

    const currentTab = getTabMetaByValue(value.value)

    if (!currentTab || currentTab.disabled) {
      const fallback = orderedTabs.value.find((meta) => !meta.disabled)?.value ?? null

      if (value.value === fallback) {
        initialNotified = true
        return
      }

      commitAutomaticValueChange(fallback)
    } else if (!initialNotified) {
      updateValue(value.value)
      initialNotified = true
    }
  })

  watchEffect(() => {
    const current = value.value
    const previous = previousValue
    if (current === previous) return

    const toElement = getTabElementByValue(current)

    activationDirection.value = computeDirection(previous, current)

    const directionComputationIncomplete = previous != null && current != null && toElement == null
    if (!directionComputationIncomplete) previousValue = current
  })

  function setValue(next: TabsValue) {
    if (next === value.value) return
    updateValue(next)
  }

  function registerTab(meta: TabMeta) {
    const element = meta.element!
    tabs.set(element, meta)
    return () => {
      if (tabs.get(element) === meta) tabs.delete(element)
    }
  }

  function registerPanel(tabValue: TabsValue, id: string) {
    panels.set(tabValue, id)
    return () => {
      if (panels.get(tabValue) === id) panels.delete(tabValue)
    }
  }

  function getTabIdByValue(tabValue: TabsValue): string | undefined {
    return getTabMetaByValue(tabValue)?.id
  }

  function getPanelIdByValue(tabValue: TabsValue): string | undefined {
    return panels.get(tabValue)
  }

  return {
    value,
    orientation,
    activationDirection,
    state,
    stateAttrs,
    setValue,
    registerTab,
    registerPanel,
    getTabIdByValue,
    getPanelIdByValue,
    getTabElementByValue
  }
}

export type TabsRoot = ReturnType<typeof useTabsRoot>
