<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, watch, watchPostEffect } from 'vue'
import { chain } from '@/internal/chain'
import { usePartElement } from '@/internal/part-element'
import { useTimeout } from '@/internal/timeout'
import type { PartProps } from '@/internal/types'
import { ScrollAreaContext } from './context'
import type { ScrollAreaRootState } from './scroll-area'

// ms of scroll quiet before scrolling counts as programmatic again — long enough to span the
// gap between a user input event and the momentum scrolling it produces.
const SCROLL_END_DELAY = 100

type Props = PartProps & {
  onScroll?: (event: Event) => void
  onWheel?: (event: WheelEvent) => void
  onPointermove?: (event: PointerEvent) => void
  onPointerenter?: (event: PointerEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  onScroll,
  onWheel,
  onPointermove,
  onPointerenter,
  onKeydown
} = defineProps<Props>()

defineSlots<{ default?: (state: ScrollAreaRootState) => any }>()

const scrollArea = ScrollAreaContext.get()

const element = usePartElement()

let isProgrammaticScroll = true
const scrollEndTimeout = useTimeout()
const waitForAnimationsTimeout = useTimeout()

watch(
  () => [
    scrollArea.viewportElement.value,
    scrollArea.scrollbarXElement.value,
    scrollArea.scrollbarYElement.value,
    scrollArea.thumbXElement.value,
    scrollArea.thumbYElement.value,
    scrollArea.cornerElement.value,
    scrollArea.direction.value,
    scrollArea.overflowEdgeThreshold.value
  ],
  () => scrollArea.measure(),
  { flush: 'post', immediate: true }
)

watchPostEffect(() => {
  const node = element.value
  if (!node) return

  scrollArea.viewportElement.value = node
  // `pointerenter` doesn't fire on mount, so a cursor already resting over the viewport
  // would otherwise go unnoticed until it moves.
  if (node.matches(':hover')) scrollArea.hovering.value = true

  onWatcherCleanup(() => {
    scrollArea.viewportElement.value = null
  })
})

watchPostEffect(() => {
  const node = element.value
  if (!node) return

  const observer = new ResizeObserver(scrollArea.measure)
  observer.observe(node)

  // 0 ms so animations starting alongside this mount are registered before they're read.
  waitForAnimationsTimeout.start(0, () => {
    const animations = node.getAnimations({ subtree: true })
    if (animations.length === 0) return

    Promise.allSettled(animations.map((animation) => animation.finished))
      .then(scrollArea.measure)
      .catch(() => {})
  })

  onWatcherCleanup(() => {
    observer.disconnect()
    waitForAnimationsTimeout.clear()
  })
})

function measureOnScroll() {
  const viewport = scrollArea.viewportElement.value
  if (!viewport) return

  scrollArea.measure()
  if (scrollArea.touchModality.value || !isProgrammaticScroll) {
    scrollArea.markScrolled({ x: viewport.scrollLeft, y: viewport.scrollTop })
  }

  scrollEndTimeout.start(SCROLL_END_DELAY, () => {
    isProgrammaticScroll = true
  })
}

function markUserScroll() {
  isProgrammaticScroll = false
}

const viewportStyle = computed(() => ({
  overflow: 'scroll',
  scrollbarWidth: 'none',
  ...(scrollArea.snapDisabled.value ? { scrollSnapType: 'none' } : undefined)
}))

const ownAttrs = computed(() => ({
  role: 'presentation',
  tabindex: scrollArea.hiddenScrollbars.value.x && scrollArea.hiddenScrollbars.value.y ? -1 : 0,
  onScroll: chain(onScroll, measureOnScroll),
  onWheel: chain(onWheel, markUserScroll),
  onPointermove: chain(onPointermove, markUserScroll),
  onPointerenter: chain(onPointerenter, markUserScroll),
  onKeydown: chain(onKeydown, markUserScroll)
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(scrollArea.stateAttrs.value, ownAttrs, $attrs)"
    :style="viewportStyle"
  >
    <slot v-bind="scrollArea.state.value" />
  </component>
</template>
