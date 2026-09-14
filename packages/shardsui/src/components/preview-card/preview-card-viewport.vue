<script setup lang="ts">
import { DirectionContext } from '@/internal/direction-context'
import PopupViewportElement from '@/internal/popup-viewport-element.vue'
import type { PartProps } from '@/internal/types'
import {
  PreviewCardContext,
  PreviewCardPositionerContext,
  type PreviewCardViewportState
} from './context'
import type { PreviewCardInstantType } from './preview-card'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: (state: PreviewCardViewportState) => any }>()

const previewCard = PreviewCardContext.get()
const positioner = PreviewCardPositionerContext.get()
const direction = DirectionContext.get()
</script>

<template>
  <PopupViewportElement
    v-model:has-viewport="previewCard.hasViewport.value"
    :as="as"
    :active-trigger="previewCard.triggerElement.value"
    :active-trigger-id="previewCard.activeTriggerId.value"
    :payload="previewCard.payload.value"
    :open="previewCard.open.value"
    :popup-element="previewCard.popupElement.value"
    :positioner-element="previewCard.positionerElement.value"
    :side="positioner.side.value"
    :direction="direction.direction.value"
    :mounted="previewCard.mounted.value"
    :instant-type="previewCard.instantType.value as PreviewCardInstantType | undefined"
    v-bind="$attrs"
  >
    <template #default="state">
      <slot v-bind="state" />
    </template>
  </PopupViewportElement>
</template>
