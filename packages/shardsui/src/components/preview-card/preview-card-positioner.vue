<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, useTemplateRef, watchPostEffect } from 'vue'
import { AnchoredPortalContext } from '@/internal/anchored-portal'
import { anchoredPositionerAttrs } from '@/internal/anchored-state'
import {
  useAnchorPositioning,
  type AnchorPositioningProps
} from '@/internal/floating/anchor-positioning'
import { createInlineMiddleware } from '@/internal/floating/inline-rect'
import { usePositionerStyle } from '@/internal/floating/positioner-style'
import type { PartProps } from '@/internal/types'
import {
  PreviewCardContext,
  PreviewCardPositionerContext,
  type PreviewCardPositionerState
} from './context'

type Props = PartProps & AnchorPositioningProps

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  side,
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

defineSlots<{ default?: (state: PreviewCardPositionerState) => any }>()

const previewCard = PreviewCardContext.get()
AnchoredPortalContext.get()

const element = useTemplateRef<HTMLElement>('element')

watchPostEffect(() => {
  previewCard.positionerElement.value = element.value
  onWatcherCleanup(() => {
    previewCard.positionerElement.value = null
  })
})

const anchorElement = computed(() => anchor ?? previewCard.triggerElement.value)

const inlineMiddleware = createInlineMiddleware(() => previewCard.inlineRectCoords)

const positioning = useAnchorPositioning({
  anchor: () => (previewCard.mounted.value ? anchorElement.value : null),
  floating: () => (previewCard.mounted.value ? element.value : null),
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
  adaptiveOrigin: previewCard.hasViewport,
  inline: inlineMiddleware
})

PreviewCardPositionerContext.set(positioning)

// `inlineRectCoords` is a plain field, so the inline middleware's read of it is untracked and
// a reopen onto a new line would otherwise reuse the previous line's position.
watchPostEffect(() => {
  if (previewCard.open.value && previewCard.mounted.value) {
    positioning.update()
  }
})

usePositionerStyle({
  element,
  styles: positioning.positionerStyles
})

const previewCardState = computed<PreviewCardPositionerState>(() => ({
  open: previewCard.open.value,
  side: positioning.side.value,
  align: positioning.align.value,
  anchorHidden: positioning.anchorHidden.value,
  instant: previewCard.instantType.value
}))

const stateAttrs = computed(() => anchoredPositionerAttrs(previewCardState.value))

const ownAttrs = computed(() => ({
  hidden: !previewCard.mounted.value,
  role: 'presentation'
}))

const positionerStyle = computed(() => ({
  ...(previewCard.transitionStatus.value === 'starting' ? { transition: 'none' } : undefined),
  ...(previewCard.open.value ? undefined : { pointerEvents: 'none' })
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="positionerStyle"
  >
    <slot v-bind="previewCardState" />
  </component>
</template>
