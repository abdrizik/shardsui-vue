<script setup lang="ts">
import { computed, mergeProps, type CSSProperties } from 'vue'
import { chain } from '@/internal/chain'
import { DirectionContext } from '@/internal/direction-context'
import type { PartProps } from '@/internal/types'
import { ScrollAreaContext } from './context'
import {
  useScrollAreaRoot,
  type OverflowEdgeThreshold,
  type ScrollAreaRootState
} from './scroll-area'

type Props = PartProps & {
  overflowEdgeThreshold?: number | Partial<OverflowEdgeThreshold>
  onPointerenter?: (event: PointerEvent) => void
  onPointermove?: (event: PointerEvent) => void
  onPointerleave?: (event: PointerEvent) => void
  onPointerdown?: (event: PointerEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  overflowEdgeThreshold,
  onPointerenter,
  onPointermove,
  onPointerleave,
  onPointerdown
} = defineProps<Props>()

defineSlots<{ default?: (state: ScrollAreaRootState) => any }>()

const direction = DirectionContext.get()

const scrollArea = useScrollAreaRoot({
  overflowEdgeThreshold: () => overflowEdgeThreshold,
  direction: direction.direction
})

ScrollAreaContext.set(scrollArea)

const style = computed<CSSProperties>(() => ({
  position: 'relative',
  '--scroll-area-corner-width': `${scrollArea.cornerSize.value.width}px`,
  '--scroll-area-corner-height': `${scrollArea.cornerSize.value.height}px`
}))

const ownAttrs = computed(() => ({
  role: 'presentation',
  onPointerenter: chain(onPointerenter, scrollArea.markHovering),
  onPointermove: chain(onPointermove, scrollArea.markHovering),
  onPointerleave: chain(onPointerleave, scrollArea.clearHovering),
  onPointerdown: chain(onPointerdown, scrollArea.markTouchModality)
}))
</script>

<template>
  <component
    :is="as"
    v-bind="mergeProps(scrollArea.stateAttrs.value, ownAttrs, $attrs)"
    :style="style"
  >
    <slot v-bind="scrollArea.state.value" />
  </component>
</template>
