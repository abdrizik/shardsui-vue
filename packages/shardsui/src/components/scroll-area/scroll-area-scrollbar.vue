<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, watchPostEffect, type CSSProperties } from 'vue'
import { chain } from '@/internal/chain'
import { clamp } from '@/internal/clamp'
import { dataAttrs } from '@/internal/data-attrs'
import { DirectionContext } from '@/internal/direction-context'
import { contains, getTarget } from '@/internal/dom'
import { usePartElement } from '@/internal/part-element'
import type { Orientation, PartProps } from '@/internal/types'
import {
  ScrollAreaContext,
  ScrollAreaScrollbarContext,
  type ScrollAreaScrollbarState
} from './context'
import { getOffset } from './get-offset'

type Props = PartProps & {
  orientation?: Orientation
  keepMounted?: boolean
  onPointerdown?: (event: PointerEvent) => void
  onPointerup?: (event: PointerEvent) => void
  onPointercancel?: (event: PointerEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  orientation = 'vertical',
  keepMounted = false,
  onPointerdown,
  onPointerup,
  onPointercancel
} = defineProps<Props>()

defineSlots<{ default?: (state: ScrollAreaScrollbarState) => any }>()

const scrollArea = ScrollAreaContext.get()
const direction = DirectionContext.get()

const element = usePartElement()

const vertical = computed(() => orientation === 'vertical')

ScrollAreaScrollbarContext.set({ orientation: computed(() => orientation) })

watchPostEffect(() => {
  const node = element.value
  if (!node) return

  const track = vertical.value ? scrollArea.scrollbarYElement : scrollArea.scrollbarXElement
  track.value = node

  onWatcherCleanup(() => {
    track.value = null
  })
})

watchPostEffect(() => {
  const node = element.value
  const viewport = scrollArea.viewportElement.value
  if (!node || !viewport) return

  const onwheel = (event: WheelEvent) => {
    if (event.ctrlKey) return

    const scrollProperty = vertical.value ? 'scrollTop' : 'scrollLeft'
    const delta = vertical.value ? event.deltaY : event.deltaX
    if (delta === 0) return

    const maxScroll = vertical.value
      ? viewport.scrollHeight - viewport.clientHeight
      : viewport.scrollWidth - viewport.clientWidth
    // RTL horizontal scrolling uses a negative `scrollLeft` range, from 0 to `-maxScroll`.
    const rtlHorizontal = !vertical.value && direction.direction.value === 'rtl'
    const minScroll = rtlHorizontal ? -maxScroll : 0
    const maxScrollValue = rtlHorizontal ? 0 : maxScroll
    const scrollValue = viewport[scrollProperty]

    if ((scrollValue <= minScroll && delta < 0) || (scrollValue >= maxScrollValue && delta > 0)) {
      return
    }

    event.preventDefault()

    viewport[scrollProperty] = clamp(scrollValue + delta, minScroll, maxScrollValue)

    scrollArea.markScrolled({ x: viewport.scrollLeft, y: viewport.scrollTop })
  }

  node.addEventListener('wheel', onwheel, { passive: false })
  onWatcherCleanup(() => node.removeEventListener('wheel', onwheel))
})

function scrollToTrackPosition(event: PointerEvent) {
  if (event.button !== 0) return

  const target = getTarget(event)
  const thumb = vertical.value ? scrollArea.thumbYElement.value : scrollArea.thumbXElement.value

  if (contains(thumb, target)) return

  const viewport = scrollArea.viewportElement.value
  if (!viewport) return

  const scrollbar = vertical.value
    ? scrollArea.scrollbarYElement.value
    : scrollArea.scrollbarXElement.value

  if (!thumb || !scrollbar) return

  const axis = vertical.value ? 'y' : 'x'
  const thumbOffset = getOffset(thumb, 'margin', axis)
  const scrollbarOffset = getOffset(scrollbar, 'padding', axis)
  const thumbSize = vertical.value ? thumb.offsetHeight : thumb.offsetWidth
  const trackRect = scrollbar.getBoundingClientRect()
  const trackSize = vertical.value ? scrollbar.offsetHeight : scrollbar.offsetWidth
  const maxThumbOffset = trackSize - thumbSize - scrollbarOffset - thumbOffset

  if (maxThumbOffset <= 0) return

  scrollArea.disableViewportSnap()
  const clickPosition = vertical.value
    ? event.clientY - trackRect.top - thumbSize / 2 - scrollbarOffset + thumbOffset / 2
    : event.clientX - trackRect.left - thumbSize / 2 - scrollbarOffset + thumbOffset / 2
  const scrollableSize = vertical.value ? viewport.scrollHeight : viewport.scrollWidth
  const viewportSize = vertical.value ? viewport.clientHeight : viewport.clientWidth
  const scrollRatio = clickPosition / maxThumbOffset
  const maxScrollDistance = scrollableSize - viewportSize

  if (vertical.value) {
    viewport.scrollTop = scrollRatio * maxScrollDistance
  } else if (direction.direction.value === 'rtl') {
    viewport.scrollLeft = -(1 - scrollRatio) * maxScrollDistance
  } else {
    viewport.scrollLeft = scrollRatio * maxScrollDistance
  }

  scrollArea.markScrolled({ x: viewport.scrollLeft, y: viewport.scrollTop })

  scrollArea.startThumbDrag(event, orientation)
}

const scrolling = computed(() =>
  vertical.value ? scrollArea.scrollingY.value : scrollArea.scrollingX.value
)

const scrollAreaState = computed<ScrollAreaScrollbarState>(() => ({
  ...scrollArea.state.value,
  hovering: scrollArea.hovering.value,
  scrolling: scrolling.value,
  orientation
}))

const hidden = computed(() =>
  vertical.value ? scrollArea.hiddenScrollbars.value.y : scrollArea.hiddenScrollbars.value.x
)
const shouldRender = computed(() => keepMounted || !hidden.value)

const stateAttrs = computed(() =>
  dataAttrs({ orientation, hovering: scrollArea.hovering.value, scrolling: scrolling.value })
)

const style = computed<CSSProperties>(() => ({
  position: 'absolute',
  touchAction: 'none',
  WebkitUserSelect: 'none',
  userSelect: 'none',
  ...(vertical.value
    ? {
        top: 0,
        bottom: 'var(--scroll-area-corner-height)',
        insetInlineEnd: 0,
        '--scroll-area-thumb-height': `${scrollArea.thumbSize.value.height}px`
      }
    : {
        insetInlineStart: 0,
        insetInlineEnd: 'var(--scroll-area-corner-width)',
        bottom: 0,
        '--scroll-area-thumb-width': `${scrollArea.thumbSize.value.width}px`
      })
}))

const ownAttrs = computed(() => ({
  onPointerdown: chain(onPointerdown, scrollToTrackPosition),
  onPointerup: chain(onPointerup, scrollArea.endThumbDrag),
  onPointercancel: chain(onPointercancel, scrollArea.endThumbDrag)
}))
</script>

<template>
  <component
    :is="as"
    v-if="shouldRender"
    ref="element"
    v-bind="mergeProps(scrollArea.stateAttrs.value, stateAttrs, ownAttrs, $attrs)"
    :style="style"
  >
    <slot v-bind="scrollAreaState" />
  </component>
</template>
