<script setup lang="ts">
import { DirectionContext } from '@/internal/direction-context'
import PopupViewportElement from '@/internal/popup-viewport-element.vue'
import type { PartProps } from '@/internal/types'
import { TooltipContext, TooltipPositionerContext, type TooltipViewportState } from './context'
import type { TooltipInstantType } from './tooltip'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: (state: TooltipViewportState) => any }>()

const tooltip = TooltipContext.get()
const positioner = TooltipPositionerContext.get()
const direction = DirectionContext.get()
</script>

<template>
  <PopupViewportElement
    v-model:has-viewport="tooltip.hasViewport.value"
    :as="as"
    :active-trigger="tooltip.triggerElement.value"
    :active-trigger-id="tooltip.activeTriggerId.value"
    :payload="tooltip.payload.value"
    :open="tooltip.open.value"
    :popup-element="tooltip.popupElement.value"
    :positioner-element="tooltip.positionerElement.value"
    :side="positioner.side.value"
    :direction="direction.direction.value"
    :mounted="tooltip.mounted.value"
    :instant-type="tooltip.instantType.value as TooltipInstantType | undefined"
    v-bind="$attrs"
  >
    <template #default="state">
      <slot v-bind="state" />
    </template>
  </PopupViewportElement>
</template>
