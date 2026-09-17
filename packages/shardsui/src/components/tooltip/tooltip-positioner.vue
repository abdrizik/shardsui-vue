<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, watchPostEffect } from 'vue'
import { AnchoredPortalContext } from '@/internal/anchored-portal'
import { anchoredPositionerAttrs } from '@/internal/anchored-state'
import { contains, getTarget, listen } from '@/internal/dom'
import {
  useAnchorPositioning,
  type AnchorPositioningProps,
  type VirtualAnchorElement
} from '@/internal/floating/anchor-positioning'
import { usePositionerStyle } from '@/internal/floating/positioner-style'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import { TooltipContext, TooltipPositionerContext, type TooltipPositionerState } from './context'

type Props = PartProps & AnchorPositioningProps

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  side = 'top',
  align,
  sideOffset,
  alignOffset,
  collisionBoundary,
  collisionPadding,
  collisionAvoidance,
  sticky = undefined,
  arrowPadding,
  disableAnchorTracking = undefined,
  anchor,
  positionMethod
} = defineProps<Props>()

defineSlots<{ default?: (state: TooltipPositionerState) => any }>()

const tooltip = TooltipContext.get()
AnchoredPortalContext.get()

const element = usePartElement()

watchPostEffect(() => {
  tooltip.positionerElement.value = element.value
  onWatcherCleanup(() => {
    tooltip.positionerElement.value = null
  })
})

watchPostEffect(() => {
  if (
    tooltip.trackCursorAxis.value === 'none' ||
    !tooltip.mounted.value ||
    !tooltip.openedByMouseEvent.value
  ) {
    return
  }

  const win = element.value?.ownerDocument.defaultView ?? window

  onWatcherCleanup(
    listen(win, 'mousemove', (event: MouseEvent) => {
      const target = getTarget(event)
      if (contains(tooltip.popupElement.value, target)) return
      tooltip.setCursorPosition(event.clientX, event.clientY)
    })
  )
})

const anchorElement = computed(() => anchor ?? tooltip.triggerElement.value)

const virtualAnchor = computed<VirtualAnchorElement | null>(() => {
  const axis = tooltip.trackCursorAxis.value
  const anchorEl = anchorElement.value
  if (axis === 'none' || !anchorEl || !tooltip.openedByMouseEvent.value) return null
  const x = tooltip.cursorX.value
  const y = tooltip.cursorY.value
  if (x == null || y == null) return null
  return {
    getBoundingClientRect(): DOMRect {
      const anchorRect = anchorEl.getBoundingClientRect()
      return new DOMRect(
        axis === 'y' ? anchorRect.x : x,
        axis === 'x' ? anchorRect.y : y,
        axis === 'y' ? anchorRect.width : 0,
        axis === 'x' ? anchorRect.height : 0
      )
    }
  }
})

const resolvedAnchor = computed(() => virtualAnchor.value ?? anchorElement.value)

const positioning = useAnchorPositioning({
  anchor: () => (tooltip.mounted.value ? resolvedAnchor.value : null),
  floating: () => (tooltip.mounted.value ? element.value : null),
  side: () => side,
  align: () => align,
  sideOffset: () => sideOffset,
  alignOffset: () => alignOffset,
  positionMethod: () => positionMethod,
  collisionBoundary: () => collisionBoundary,
  collisionPadding: () => collisionPadding,
  collisionAvoidance: () => collisionAvoidance,
  sticky: () => sticky,
  arrowPadding: () => arrowPadding,
  disableAnchorTracking: () => disableAnchorTracking,
  adaptiveOrigin: tooltip.hasViewport
})

TooltipPositionerContext.set(positioning)

usePositionerStyle({
  element,
  styles: positioning.positionerStyles
})

const instant = computed(() =>
  tooltip.trackCursorAxis.value !== 'none' ? 'tracking-cursor' : tooltip.instantType.value
)

const tooltipState = computed<TooltipPositionerState>(() => ({
  open: tooltip.open.value,
  side: positioning.side.value,
  align: positioning.align.value,
  anchorHidden: positioning.anchorHidden.value,
  instant: instant.value
}))

const stateAttrs = computed(() => anchoredPositionerAttrs(tooltipState.value))

const ownAttrs = computed(() => ({
  hidden: !tooltip.mounted.value,
  role: 'presentation'
}))

const positionerStyle = computed(() => ({
  ...(tooltip.transitionStatus.value === 'starting' ? { transition: 'none' } : undefined),
  ...(!tooltip.open.value ||
  tooltip.trackCursorAxis.value === 'both' ||
  tooltip.disableHoverablePopup.value
    ? { pointerEvents: 'none' }
    : undefined)
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="positionerStyle"
  >
    <slot v-bind="tooltipState" />
  </component>
</template>
