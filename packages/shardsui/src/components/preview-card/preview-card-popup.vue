<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, useTemplateRef, watchPostEffect } from 'vue'
import { anchoredPopupAttrs } from '@/internal/anchored-state'
import { useDismiss } from '@/internal/floating/dismiss'
import { hoverFloatingInteraction } from '@/internal/floating/hover/floating'
import { publishCloseGuardContext } from '@/internal/floating/publish-close-guard-context'
import { getDisabledMountTransitionStyles } from '@/internal/get-disabled-mount-transition-styles'
import { openChangeComplete } from '@/internal/open-change-complete'
import type { PartProps } from '@/internal/types'
import {
  PreviewCardContext,
  PreviewCardPositionerContext,
  type PreviewCardPopupState
} from './context'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: (state: PreviewCardPopupState) => any }>()

const previewCard = PreviewCardContext.get()
const positioner = PreviewCardPositionerContext.get()

const element = useTemplateRef<HTMLElement>('element')

watchPostEffect(() => {
  previewCard.popupElement.value = element.value
  onWatcherCleanup(() => {
    previewCard.popupElement.value = null
  })
})

openChangeComplete({
  open: previewCard.open,
  element,
  onComplete: () => {
    if (previewCard.open.value) previewCard.onOpenChangeComplete.value?.(true)
  }
})

hoverFloatingInteraction(previewCard, {
  closeDelay: previewCard.closeDelay,
  nodeId: () => previewCard.floatingNodeId
})

publishCloseGuardContext({
  data: previewCard.data,
  side: positioner.renderedSide,
  domReference: previewCard.domReferenceElement,
  floating: previewCard.floatingElement
})

useDismiss({
  open: previewCard.open,
  onClose: (reason, event) => {
    previewCard.setOpen(false, reason, event)
  },
  popupElement: element,
  referenceElement: previewCard.domReferenceElement,
  isInsideElement: previewCard.containsTrigger,
  tree: () => previewCard.floatingTree,
  nodeId: () => previewCard.floatingNodeId
})

const previewCardState = computed<PreviewCardPopupState>(() => ({
  open: previewCard.open.value,
  side: positioner.side.value,
  align: positioner.align.value,
  instant: previewCard.instantType.value,
  transitionStatus: previewCard.transitionStatus.value
}))

const stateAttrs = computed(() => anchoredPopupAttrs(previewCardState.value))

const ownAttrs = { tabindex: -1, 'data-shards-ui-focusable': '' }

const popupStyle = computed(() =>
  getDisabledMountTransitionStyles(previewCard.transitionStatus.value)
)
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="popupStyle"
  >
    <slot v-bind="previewCardState" />
  </component>
</template>
