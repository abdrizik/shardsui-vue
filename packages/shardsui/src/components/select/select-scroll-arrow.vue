<script setup lang="ts">
import { computed, mergeProps, onScopeDispose } from 'vue'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { openChangeComplete } from '@/internal/open-change-complete'
import {
  getMaxScrollOffset,
  normalizeScrollOffset,
  SCROLL_EDGE_TOLERANCE_PX
} from '@/internal/scroll-edges'
import { usePartElement } from '@/internal/part-element'
import { createTimeout } from '@/internal/timeout'
import { useTransitionStatus } from '@/internal/transition-status'
import type { PartProps } from '@/internal/types'
import {
  SelectContext,
  SelectPositionerContext,
  type SelectItem,
  type SelectScrollArrowState
} from './context'

const SCROLL_STEP_MS = 40

function scrollTopForPreviousItem(
  items: readonly SelectItem[],
  scrollTop: number,
  arrowHeight: number,
  maxScrollTop: number
): number {
  const visibleTop = scrollTop + arrowHeight - SCROLL_EDGE_TOLERANCE_PX
  let firstVisibleIndex = 0
  for (const [i, item] of items.entries()) {
    if (item.element.offsetTop >= visibleTop) {
      firstVisibleIndex = i
      break
    }
  }
  const target = items[firstVisibleIndex - 1]
  if (!target) return 0
  return normalizeScrollOffset(target.element.offsetTop - arrowHeight, maxScrollTop)
}

function scrollTopForNextItem(
  items: readonly SelectItem[],
  scrollTop: number,
  clientHeight: number,
  arrowHeight: number,
  maxScrollTop: number
): number {
  const visibleBottom = scrollTop + clientHeight - arrowHeight + SCROLL_EDGE_TOLERANCE_PX
  let lastVisibleIndex = items.length - 1
  for (const [i, item] of items.entries()) {
    if (item.element.offsetTop + item.element.offsetHeight > visibleBottom) {
      lastVisibleIndex = Math.max(0, i - 1)
      break
    }
  }
  const target = items[lastVisibleIndex + 1]
  if (!target) return maxScrollTop
  return normalizeScrollOffset(
    target.element.offsetTop + target.element.offsetHeight - clientHeight + arrowHeight,
    maxScrollTop
  )
}

type Props = PartProps & {
  direction: 'up' | 'down'
  keepMounted?: boolean
  onMousemove?: (event: MouseEvent) => void
  onMouseleave?: (event: MouseEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  direction,
  keepMounted = false,
  onMousemove,
  onMouseleave
} = defineProps<Props>()

const slots = defineSlots<{ default?: (state: SelectScrollArrowState) => any }>()

const select = SelectContext.get()
const registry = select.itemRegistry
const positioner = SelectPositionerContext.get()

const element = usePartElement()

const scrollTimeout = createTimeout()
onScopeDispose(scrollTimeout.clear)

onScopeDispose(select.registerScrollArrow())

const isUp = computed(() => direction === 'up')

const visible = computed(
  () =>
    (isUp.value ? select.scrollUpArrowVisible.value : select.scrollDownArrowVisible.value) &&
    select.openMethod.value !== 'touch'
)

const transition = useTransitionStatus({
  open: visible
})

openChangeComplete({
  open: visible,
  element,
  onComplete: () => {
    if (!visible.value) transition.mounted.value = false
  }
})

const shouldRender = computed(() => transition.mounted.value || keepMounted)

const selectState = computed<SelectScrollArrowState>(() => ({
  direction,
  visible: visible.value,
  side: positioner.side.value,
  transitionStatus: transition.status.value
}))

const stateAttrs = computed(() =>
  dataAttrs({
    direction,
    visible: visible.value,
    'starting-style': transition.status.value === 'starting',
    'ending-style': transition.status.value === 'ending',
    side: positioner.side.value
  })
)

function scrollNextItem() {
  const scroller = select.scroller.value
  if (!scroller) return

  registry.highlightedIndex.value = -1

  const maxScrollTop = getMaxScrollOffset(scroller.scrollHeight, scroller.clientHeight)
  const scrollTop = normalizeScrollOffset(scroller.scrollTop, maxScrollTop)

  scroller.scrollTop = scrollTop

  if (scrollTop === (isUp.value ? 0 : maxScrollTop)) {
    scrollTimeout.clear()
    return
  }

  const items = registry.items.value
  if (items.length > 0) {
    const arrowHeight = element.value?.offsetHeight || 0
    scroller.scrollTop = isUp.value
      ? scrollTopForPreviousItem(items, scrollTop, arrowHeight, maxScrollTop)
      : scrollTopForNextItem(items, scrollTop, scroller.clientHeight, arrowHeight, maxScrollTop)
  }

  scrollTimeout.start(SCROLL_STEP_MS, scrollNextItem)
}

function startScrollingOnHover(event: MouseEvent) {
  if (event.movementX === 0 && event.movementY === 0) return
  if (scrollTimeout.isStarted()) return
  registry.highlightedIndex.value = -1
  scrollTimeout.start(SCROLL_STEP_MS, scrollNextItem)
}

function stopScrolling() {
  scrollTimeout.clear()
}

const ownAttrs = computed(() => ({
  'aria-hidden': 'true',
  onMousemove: chain(onMousemove, startScrollingOnHover),
  onMouseleave: chain(onMouseleave, stopScrolling)
}))
</script>

<template>
  <component
    :is="as"
    v-if="shouldRender"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="{ position: 'absolute' }"
  >
    <slot v-if="slots.default" v-bind="selectState" />
    <template v-else>{{ isUp ? '▲' : '▼' }}</template>
  </component>
</template>
