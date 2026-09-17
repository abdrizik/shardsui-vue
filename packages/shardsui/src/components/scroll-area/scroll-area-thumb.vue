<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, watchPostEffect } from 'vue'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import { ScrollAreaContext, ScrollAreaScrollbarContext, type ScrollAreaThumbState } from './context'

type Props = PartProps & {
  onPointerdown?: (event: PointerEvent) => void
  onPointermove?: (event: PointerEvent) => void
  onPointerup?: (event: PointerEvent) => void
  onPointercancel?: (event: PointerEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  onPointerdown,
  onPointermove,
  onPointerup,
  onPointercancel
} = defineProps<Props>()

defineSlots<{ default?: (state: ScrollAreaThumbState) => any }>()

const scrollArea = ScrollAreaContext.get()
const scrollbar = ScrollAreaScrollbarContext.get()

const element = usePartElement()

const vertical = computed(() => scrollbar.orientation.value === 'vertical')
const scrolling = computed(() =>
  vertical.value ? scrollArea.scrollingY.value : scrollArea.scrollingX.value
)

const scrollAreaState = computed<ScrollAreaThumbState>(() => ({
  scrolling: scrolling.value,
  orientation: scrollbar.orientation.value
}))

const stateAttrs = computed(() =>
  dataAttrs({ scrolling: scrolling.value, orientation: scrollbar.orientation.value })
)

watchPostEffect(() => {
  const node = element.value
  if (!node) return

  const thumb = vertical.value ? scrollArea.thumbYElement : scrollArea.thumbXElement
  thumb.value = node

  onWatcherCleanup(() => {
    thumb.value = null
  })
})

function startDrag(event: PointerEvent) {
  scrollArea.startThumbDrag(event, scrollbar.orientation.value)
}

const ownAttrs = computed(() => ({
  onPointerdown: chain(onPointerdown, startDrag),
  onPointermove: chain(onPointermove, scrollArea.dragThumb),
  onPointerup: chain(onPointerup, scrollArea.endThumbDrag),
  onPointercancel: chain(onPointercancel, scrollArea.endThumbDrag)
}))

const sizeStyle = computed(() => ({
  ...(scrollArea.hasMeasured.value ? undefined : { visibility: 'hidden' }),
  ...(vertical.value
    ? { height: 'var(--scroll-area-thumb-height)' }
    : { width: 'var(--scroll-area-thumb-width)' })
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="sizeStyle"
  >
    <slot v-bind="scrollAreaState" />
  </component>
</template>
