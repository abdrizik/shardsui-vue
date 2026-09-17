<script setup lang="ts" generic="Payload = unknown">
import { computed, mergeProps, useId, watchPostEffect } from 'vue'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { createFocusReference } from '@/internal/floating/focus-reference'
import { getDelay } from '@/internal/floating/hover/predicates'
import { hoverReferenceInteraction } from '@/internal/floating/hover/reference'
import { safePolygon } from '@/internal/floating/safe-polygon'
import { usePartElement } from '@/internal/part-element'
import { useTriggerRegistration } from '@/internal/trigger-registration'
import type { PartProps } from '@/internal/types'
import { TooltipContext, TooltipProviderContext, type TooltipTriggerState } from './context'
import { useDelayGroupMember } from './delay-group'
import type { TooltipHandle } from './handle'
import type { TooltipRoot } from './tooltip'

const OPEN_DELAY = 600

type Props = PartProps & {
  id?: string
  handle?: TooltipHandle<Payload>
  disabled?: boolean
  delay?: number
  closeDelay?: number
  closeOnClick?: boolean
  payload?: Payload
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
  onPointerdown?: (event: PointerEvent) => void
  onPointerenter?: (event: PointerEvent) => void
  onMousemove?: (event: MouseEvent) => void
  onMouseleave?: (event: MouseEvent) => void
  onClick?: (event: MouseEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'button',
  id: idProp,
  handle,
  disabled: disabledProp = undefined,
  delay,
  closeDelay,
  closeOnClick = true,
  payload,
  onFocus,
  onBlur,
  onPointerdown,
  onPointerenter,
  onMousemove,
  onMouseleave,
  onClick
} = defineProps<Props>()

defineSlots<{ default?: (state: TooltipTriggerState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const tooltip: TooltipRoot = handle ? (handle.state as TooltipRoot) : TooltipContext.get()
const provider = TooltipProviderContext.getOr()

const element = usePartElement()

const disabled = computed(() => disabledProp ?? tooltip.disabled.value)

const focus = createFocusReference({
  enabled: () => !disabled.value,
  open: tooltip.open,
  openChangeReason: tooltip.openChangeReason,
  triggerElement: element,
  activeTriggerElement: tooltip.triggerElement,
  popupElement: tooltip.popupElement,
  triggerElements: tooltip.triggerElements,
  setOpen: tooltip.setOpen
})

const registration = useTriggerRegistration({
  id,
  ref: element,
  root: tooltip,
  bindings: () => ({ payload, closeDelay: closeDelay ?? 0, closeOnClick }),
  apply: tooltip.applyTriggerBindings
})

const delayGroup = provider
  ? useDelayGroupMember(provider.delayGroup, tooltip, {
      open: registration.isActiveOpen,
      floatingId: tooltip.floatingId
    })
  : null

if (delayGroup) {
  watchPostEffect(() => {
    tooltip.isInstantPhase.value = delayGroup.isInstantPhase.value
  })
}

const safePolygonGuard = safePolygon()

const restMs = computed(() =>
  getDelay(provider?.delayGroup.delay.value, 'open') === 0
    ? 0
    : (delay ?? provider?.delay.value ?? OPEN_DELAY)
)
const hoverDelay = computed(() => ({
  close: closeDelay ?? (provider ? getDelay(provider.delayGroup.delay.value, 'close') : 0)
}))

hoverReferenceInteraction(tooltip, {
  enabled: () => !disabled.value,
  mouseOnly: true,
  move: false,
  closeGuard: () =>
    !tooltip.disableHoverablePopup.value && tooltip.trackCursorAxis.value !== 'both'
      ? safePolygonGuard
      : null,
  restMs,
  delay: hoverDelay,
  triggerElement: element,
  isActiveTrigger: registration.isTriggerActive
})

const tooltipState = computed<TooltipTriggerState>(() => ({
  open: registration.isActiveOpen.value
}))

function cancelDelayedOpen() {
  if (closeOnClick && !tooltip.open.value) tooltip.cancelPendingOpen()
}

function cancelOpenOnPress() {
  tooltip.closeOnClick.value = closeOnClick
  cancelDelayedOpen()
}

function trackCursor(event: MouseEvent) {
  if (tooltip.trackCursorAxis.value !== 'none' && !tooltip.open.value) {
    tooltip.setCursorPosition(event.clientX, event.clientY)
  }
}

const stateAttrs = computed(() =>
  dataAttrs({ 'popup-open': registration.isActiveOpen.value, 'trigger-disabled': disabled.value })
)

const ownAttrs = computed(() => ({
  id: id.value,
  onPointerdown: chain(onPointerdown, cancelOpenOnPress),
  onPointerenter: chain(onPointerenter, trackCursor),
  onMousemove: chain(onMousemove, trackCursor),
  onMouseleave: chain(onMouseleave, focus.reset),
  onClick: chain(onClick, cancelDelayedOpen),
  onFocus: chain(onFocus, focus.onFocus),
  onBlur: chain(onBlur, focus.onBlur)
}))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)">
    <slot v-bind="tooltipState" />
  </component>
</template>
