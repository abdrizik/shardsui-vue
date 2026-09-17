<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, useId, watch, watchEffect } from 'vue'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { contains } from '@/internal/dom'
import { useCompositeItem } from '@/internal/floating/composite'
import { usePartElement } from '@/internal/part-element'
import { usePartTag } from '@/internal/part-tag'
import type { PartProps } from '@/internal/types'
import { TabsContext, TabsListContext, type TabsTabState } from './context'
import type { TabMeta, TabsValue } from './tabs'

type Props = PartProps & {
  value: TabsValue
  id?: string
  disabled?: boolean
  onFocus?: (event: FocusEvent) => void
  onPointerdown?: (event: PointerEvent) => void
  onClick?: (event: MouseEvent) => void
  onMousedown?: (event: MouseEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onKeyup?: (event: KeyboardEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'button',
  value,
  id: idProp,
  disabled = false,
  onFocus,
  onPointerdown,
  onClick,
  onMousedown,
  onKeydown,
  onKeyup
} = defineProps<Props>()

defineSlots<{ default?: (state: TabsTabState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const tabs = TabsContext.get()
const list = TabsListContext.get()

const element = usePartElement()

const tag = usePartTag({ as: () => as, defaultTag: 'button', element })

let isPressing = false
let isMainButton = false

const active = computed(() => value === tabs.value.value)

const item = useCompositeItem({
  composite: list.composite,
  ref: element,
  disabled: false,
  active
})

const tabindex = computed(() => (active.value && item.index.value === -1 ? 0 : item.tabindex.value))
const tabPanelId = computed(() => tabs.getPanelIdByValue(value))

const meta: TabMeta = {
  get id() {
    return id.value
  },
  get element() {
    return element.value
  },
  get value() {
    return value
  },
  get disabled() {
    return disabled
  }
}

watch(
  () => element.value,
  (el) => {
    if (!el) return
    onWatcherCleanup(tabs.registerTab(meta))
    onWatcherCleanup(list.observeTab(el))
  },
  { immediate: true, flush: 'sync' }
)

watchEffect(() => {
  if (!active.value || disabled) return
  if (item.index.value === -1 || list.composite.highlightedIndex.value === item.index.value) return
  const listElement = list.element.value
  if (contains(listElement, (listElement?.ownerDocument ?? document).activeElement)) return

  list.composite.setHighlightedIndex(item.index.value)
})

function trackPress(event: PointerEvent) {
  const el = element.value
  if (active.value || disabled || !el) return
  isPressing = true
  isMainButton = event.button === 0

  const doc = el.ownerDocument
  const controller = new AbortController()
  const end = () => {
    isPressing = false
    isMainButton = false
    controller.abort()
  }
  doc.addEventListener('pointerup', end, { signal: controller.signal })
  doc.addEventListener('pointercancel', end, { signal: controller.signal })
}

function focusTab() {
  item.onFocus()

  if (active.value || disabled) return

  if (list.activateOnFocus.value && (!isPressing || isMainButton)) {
    tabs.setValue(value)
  }
}

const button = useButton({
  disabled: () => disabled,
  focusableWhenDisabled: true,
  composite: true,
  as: tag,
  onClick: () =>
    chain(onClick, (event) => {
      if (active.value || disabled || event.button !== 0) return
      tabs.setValue(value)
    }),
  onMousedown: () => onMousedown,
  onKeydown: () => onKeydown,
  onKeyup: () => onKeyup,
  onPointerdown: () => chain(onPointerdown, trackPress)
})

const tabsState = computed<TabsTabState>(() => ({
  ...tabs.state.value,
  active: active.value,
  disabled
}))

const stateAttrs = computed(() => dataAttrs({ active: active.value, disabled }))

const ownAttrs = computed(() => ({
  id: id.value,
  role: 'tab',
  'aria-controls': tabPanelId.value,
  'aria-selected': active.value,
  tabindex: tabindex.value,
  onFocus: chain(onFocus, focusTab)
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(button.attrs.value, tabs.stateAttrs.value, stateAttrs, ownAttrs, $attrs)"
  >
    <slot v-bind="tabsState" />
  </component>
</template>
