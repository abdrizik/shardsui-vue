<script setup lang="ts">
import { DirectionContext } from '@/internal/direction-context'
import PopupViewportElement from '@/internal/popup-viewport-element.vue'
import type { PartProps } from '@/internal/types'
import { PopoverContext, PopoverPositionerContext, type PopoverViewportState } from './context'
import type { PopoverInstantType } from './popover'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: (state: PopoverViewportState) => any }>()

const popover = PopoverContext.get()
const positioner = PopoverPositionerContext.get()
const direction = DirectionContext.get()
</script>

<template>
  <PopupViewportElement
    v-model:has-viewport="popover.hasViewport.value"
    :as="as"
    :active-trigger="popover.triggerElement.value"
    :active-trigger-id="popover.activeTriggerId.value"
    :payload="popover.payload.value"
    :open="popover.open.value"
    :popup-element="popover.popupElement.value"
    :positioner-element="popover.positionerElement.value"
    :side="positioner.side.value"
    :direction="direction.direction.value"
    :mounted="popover.mounted.value"
    :instant-type="popover.instantType.value as PopoverInstantType | undefined"
    v-bind="$attrs"
  >
    <template #default="state">
      <slot v-bind="state" />
    </template>
  </PopupViewportElement>
</template>
