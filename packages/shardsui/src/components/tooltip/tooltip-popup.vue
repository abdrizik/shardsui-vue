<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, useTemplateRef, watchPostEffect } from 'vue'
import { anchoredPopupAttrs } from '@/internal/anchored-state'
import { hoverFloatingInteraction } from '@/internal/floating/hover/floating'
import { publishCloseGuardContext } from '@/internal/floating/publish-close-guard-context'
import { getDisabledMountTransitionStyles } from '@/internal/get-disabled-mount-transition-styles'
import { openChangeComplete } from '@/internal/open-change-complete'
import type { PartProps } from '@/internal/types'
import { TooltipContext, TooltipPositionerContext, type TooltipPopupState } from './context'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: (state: TooltipPopupState) => any }>()

const tooltip = TooltipContext.get()
const positioner = TooltipPositionerContext.get()

const element = useTemplateRef<HTMLElement>('element')

watchPostEffect(() => {
  tooltip.popupElement.value = element.value
  onWatcherCleanup(() => {
    tooltip.popupElement.value = null
  })
})

openChangeComplete({
  open: tooltip.open,
  element,
  onComplete: () => {
    if (tooltip.open.value) tooltip.onOpenChangeComplete.value?.(true)
  }
})

hoverFloatingInteraction(tooltip, {
  enabled: () => !tooltip.disabled.value,
  closeDelay: tooltip.closeDelay
})

publishCloseGuardContext({
  data: tooltip.data,
  side: positioner.renderedSide,
  domReference: tooltip.domReferenceElement,
  floating: tooltip.floatingElement
})

const tooltipState = computed<TooltipPopupState>(() => ({
  open: tooltip.open.value,
  side: positioner.side.value,
  align: positioner.align.value,
  instant: tooltip.instantType.value,
  transitionStatus: tooltip.transitionStatus.value
}))

const stateAttrs = computed(() => anchoredPopupAttrs(tooltipState.value))

const ownAttrs = { tabindex: -1, 'data-shards-ui-focusable': '' }

const popupStyle = computed(() => getDisabledMountTransitionStyles(tooltip.transitionStatus.value))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="popupStyle"
  >
    <slot v-bind="tooltipState" />
  </component>
</template>
