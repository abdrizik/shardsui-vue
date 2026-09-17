<script setup lang="ts" generic="Payload = unknown">
import { computed, mergeProps, useId } from 'vue'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { createFocusReference } from '@/internal/floating/focus-reference'
import { hoverReferenceInteraction } from '@/internal/floating/hover/reference'
import { getInlineRectCoords } from '@/internal/floating/inline-rect'
import { safePolygon } from '@/internal/floating/safe-polygon'
import { usePartElement } from '@/internal/part-element'
import { useTriggerRegistration } from '@/internal/trigger-registration'
import type { PartProps } from '@/internal/types'
import { PreviewCardContext, type PreviewCardTriggerState } from './context'
import type { PreviewCardHandle } from './handle'
import { CLOSE_DELAY, OPEN_DELAY, type PreviewCardRoot } from './preview-card'

type Props = PartProps & {
  id?: string
  handle?: PreviewCardHandle<Payload>
  delay?: number
  closeDelay?: number
  payload?: Payload
  onMouseenter?: (event: MouseEvent) => void
  onMousemove?: (event: MouseEvent) => void
  onMouseleave?: (event: MouseEvent) => void
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'a',
  id: idProp,
  handle,
  delay = OPEN_DELAY,
  closeDelay = CLOSE_DELAY,
  payload,
  onMouseenter,
  onMousemove,
  onMouseleave,
  onFocus,
  onBlur
} = defineProps<Props>()

defineSlots<{ default?: (state: PreviewCardTriggerState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const previewCard: PreviewCardRoot = handle
  ? (handle.state as PreviewCardRoot)
  : PreviewCardContext.get()

const element = usePartElement()

const focus = createFocusReference({
  open: previewCard.open,
  openChangeReason: previewCard.openChangeReason,
  triggerElement: element,
  activeTriggerElement: previewCard.triggerElement,
  popupElement: previewCard.popupElement,
  triggerElements: previewCard.triggerElements,
  delay: () => delay,
  setOpen: previewCard.setOpen
})

const registration = useTriggerRegistration({
  id,
  ref: element,
  root: previewCard,
  bindings: () => ({ payload, closeDelay }),
  apply: previewCard.applyTriggerBindings
})

const safePolygonGuard = safePolygon()

hoverReferenceInteraction(previewCard, {
  mouseOnly: true,
  move: false,
  closeGuard: () => safePolygonGuard,
  delay: () => ({ open: delay, close: closeDelay }),
  triggerElement: element,
  isActiveTrigger: registration.isTriggerActive
})

const previewCardState = computed<PreviewCardTriggerState>(() => ({
  open: registration.isActiveOpen.value
}))

const stateAttrs = computed(() => dataAttrs({ 'popup-open': registration.isActiveOpen.value }))

function clearInlineRect() {
  previewCard.inlineRectCoords = undefined
}

function updateInlineRect(event: MouseEvent) {
  const el = element.value
  if (!registration.isActiveOpen.value && el) {
    previewCard.inlineRectCoords = getInlineRectCoords(el, event.clientX, event.clientY)
  }
}

const ownAttrs = computed(() => ({
  id: id.value,
  onMouseenter: chain(onMouseenter, updateInlineRect),
  onMousemove: chain(onMousemove, updateInlineRect),
  onMouseleave: chain(onMouseleave, focus.reset),
  onFocus: chain(onFocus, clearInlineRect, focus.onFocus),
  onBlur: chain(onBlur, focus.onBlur)
}))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)">
    <slot v-bind="previewCardState" />
  </component>
</template>
