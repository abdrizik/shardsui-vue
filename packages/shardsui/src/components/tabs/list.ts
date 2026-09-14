import {
  computed,
  onWatcherCleanup,
  shallowRef,
  toValue,
  watchPostEffect,
  type MaybeRefOrGetter
} from 'vue'
import { useCompositeRoot } from '@/internal/floating/composite'
import type { TabsOrientation } from './tabs'

type TabsListOptions = {
  orientation: MaybeRefOrGetter<TabsOrientation>
  activateOnFocus: MaybeRefOrGetter<boolean>
  loopFocus: MaybeRefOrGetter<boolean>
  ref: MaybeRefOrGetter<HTMLElement | null>
}

export function useTabsList(options: TabsListOptions) {
  const composite = useCompositeRoot({
    orientation: options.orientation,
    loopFocus: options.loopFocus,
    ref: options.ref,
    enableHomeAndEnd: true
  })

  const observedTabs = new Set<HTMLElement>()
  let observer: ResizeObserver | null = null

  const resizeVersion = shallowRef(0)

  const activateOnFocus = computed(() => toValue(options.activateOnFocus))
  const element = computed(() => toValue(options.ref))

  watchPostEffect(() => {
    const node = element.value
    if (!node) return

    const resizeObserver = new ResizeObserver(() => {
      resizeVersion.value += 1
    })
    observer = resizeObserver
    resizeObserver.observe(node)
    for (const tab of observedTabs) resizeObserver.observe(tab)

    onWatcherCleanup(() => {
      resizeObserver.disconnect()
      observer = null
    })
  })

  function observeTab(tab: HTMLElement) {
    observedTabs.add(tab)
    observer?.observe(tab)
    return () => {
      observedTabs.delete(tab)
      observer?.unobserve(tab)
    }
  }

  return { composite, activateOnFocus, element, resizeVersion, observeTab }
}

export type TabsList = ReturnType<typeof useTabsList>
