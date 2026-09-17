<script setup lang="ts" generic="Payload = unknown">
import { computed, mergeProps, onWatcherCleanup, useId, useTemplateRef, watchPostEffect } from 'vue'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { isClickLikeEvent } from '@/internal/floating/event'
import { hoverReferenceInteraction } from '@/internal/floating/hover/reference'
import { safePolygon } from '@/internal/floating/safe-polygon'
import { createTriggerFocusGuards } from '@/internal/floating/trigger-focus-guards'
import FocusGuard from '@/internal/focus-guard.vue'
import { usePartElement } from '@/internal/part-element'
import { usePartTag } from '@/internal/part-tag'
import { REASONS } from '@/internal/reasons'
import { useTriggerRegistration } from '@/internal/trigger-registration'
import type { PartProps } from '@/internal/types'
import { PopoverContext, type PopoverTriggerState } from './context'
import type { PopoverHandle } from './handle'
import type { PopoverRoot } from './popover'

type Props = PartProps & {
  id?: string
  handle?: PopoverHandle<Payload>
  disabled?: boolean
  openOnHover?: boolean
  delay?: number
  closeDelay?: number
  payload?: Payload
  onClick?: (event: MouseEvent) => void
  onMousedown?: (event: MouseEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onKeyup?: (event: KeyboardEvent) => void
  onPointerdown?: (event: PointerEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'button',
  id: idProp,
  handle,
  disabled = false,
  openOnHover = false,
  delay = 300,
  closeDelay = 0,
  payload,
  onClick,
  onMousedown,
  onKeydown,
  onKeyup,
  onPointerdown
} = defineProps<Props>()

defineSlots<{ default?: (state: PopoverTriggerState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const popover: PopoverRoot = handle ? (handle.state as PopoverRoot) : PopoverContext.get()

const element = usePartElement()

const tag = usePartTag({ as: () => as, defaultTag: 'button', element })
const preGuard = useTemplateRef<InstanceType<typeof FocusGuard>>('preGuard')
const afterGuard = useTemplateRef<InstanceType<typeof FocusGuard>>('afterGuard')

const registration = useTriggerRegistration({
  id,
  ref: element,
  root: popover,
  bindings: () => ({ payload, disabled, openOnHover, closeDelay }),
  apply: popover.applyTriggerBindings
})

const showTriggerGuards = computed(
  () => registration.isMountedByThisTrigger.value && !popover.focusManagerModal.value
)

const ownsOrSoloOpen = computed(
  () =>
    registration.isActiveOpen.value ||
    (popover.open.value &&
      popover.activeTriggerId.value == null &&
      popover.triggerElements.size === 1)
)

watchPostEffect(() => {
  const guard = afterGuard.value?.element ?? null
  if (!guard) return
  popover.triggerFocusTargetElement.value = guard
  onWatcherCleanup(() => {
    if (popover.triggerFocusTargetElement.value === guard) {
      popover.triggerFocusTargetElement.value = null
    }
  })
})

const safePolygonGuard = safePolygon()

hoverReferenceInteraction(popover, {
  enabled: () =>
    openOnHover &&
    !disabled &&
    (popover.openMethod.value !== 'touch' ||
      popover.openChangeReason.value !== REASONS.triggerPress),
  mouseOnly: true,
  move: false,
  closeGuard: () => safePolygonGuard,
  restMs: () => delay,
  delay: () => ({ close: closeDelay }),
  triggerElement: element,
  isActiveTrigger: registration.isTriggerActive
})

const button = useButton({
  disabled: () => disabled,
  as: tag,
  onClick: () => chain(onClick, toggleOpen),
  onMousedown: () => onMousedown,
  onKeydown: () => onKeydown,
  onKeyup: () => onKeyup,
  onPointerdown: () => chain(onPointerdown, forwardOpenPointerDown)
})

const guards = createTriggerFocusGuards({
  close: (event) => popover.setOpen(false, REASONS.focusOut, event),
  positionerElement: popover.positionerElement,
  popupElement: popover.popupElement,
  triggerFocusTargetElement: popover.triggerFocusTargetElement,
  preFocusGuardElement: () => preGuard.value?.element ?? null
})

const popoverState = computed<PopoverTriggerState>(() => ({
  disabled,
  open: registration.isActiveOpen.value
}))

const stateAttrs = computed(() =>
  dataAttrs({
    'popup-open': registration.isActiveOpen.value,
    pressed:
      registration.isActiveOpen.value && popover.openChangeReason.value === REASONS.triggerPress,
    disabled
  })
)

const ownAttrs = computed(() => ({
  id: id.value,
  'aria-haspopup': 'dialog',
  'aria-expanded': registration.isActiveOpen.value,
  'aria-controls': ownsOrSoloOpen.value ? popover.popupId.value : undefined,
  'data-shards-ui-click-trigger': ''
}))

function toggleOpen(event: MouseEvent) {
  const el = element.value
  popover.openInteractionHandlers.value?.onClick(event)
  if (popover.open.value && popover.triggerElement.value !== el) {
    popover.setOpen(true, REASONS.triggerPress, event, el)
    return
  }

  const openEventType = popover.data.openEvent?.type
  if (
    popover.open.value &&
    popover.stickIfOpen &&
    openEventType &&
    !isClickLikeEvent(openEventType)
  ) {
    popover.setOpen(true, REASONS.triggerPress, event, el)
    return
  }

  popover.setOpen(!popover.open.value, REASONS.triggerPress, event, el)
}

function forwardOpenPointerDown(event: PointerEvent) {
  popover.openInteractionHandlers.value?.onPointerdown(event)
}
</script>

<template>
  <FocusGuard v-if="showTriggerGuards" ref="preGuard" @focus="guards.closeAndFocusBefore" />
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(button.attrs.value, stateAttrs, ownAttrs, $attrs)"
  >
    <slot v-bind="popoverState" />
  </component>
  <FocusGuard v-if="showTriggerGuards" ref="afterGuard" @focus="guards.closeAndFocusAfter" />
</template>
