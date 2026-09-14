<script setup lang="ts">
import {
  computed,
  mergeProps,
  onWatcherCleanup,
  shallowRef,
  useId,
  useTemplateRef,
  watchEffect,
  watchPostEffect,
  watchSyncEffect
} from 'vue'
import { ToolbarContext } from '@/components/toolbar/context'
import { anchoredPopupAttrs } from '@/internal/anchored-state'
import { chain } from '@/internal/chain'
import { listen } from '@/internal/dom'
import { COMPOSITE_KEYS } from '@/internal/composite'
import { useDismiss } from '@/internal/floating/dismiss'
import { useFocusManager, type FocusTarget } from '@/internal/floating/focus-manager'
import { hoverFloatingInteraction } from '@/internal/floating/hover/floating'
import { publishCloseGuardContext } from '@/internal/floating/publish-close-guard-context'
import { getDisabledMountTransitionStyles } from '@/internal/get-disabled-mount-transition-styles'
import { openChangeComplete } from '@/internal/open-change-complete'
import { REASONS } from '@/internal/reasons'
import type { PartProps } from '@/internal/types'
import {
  PopoverClosePartContext,
  PopoverContext,
  PopoverPositionerContext,
  type PopoverPopupState
} from './context'

type Props = PartProps & {
  id?: string
  initialFocus?: FocusTarget
  finalFocus?: FocusTarget
  onKeydown?: (event: KeyboardEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  id: idProp,
  initialFocus = undefined,
  finalFocus = undefined,
  onKeydown
} = defineProps<Props>()

defineSlots<{ default?: (state: PopoverPopupState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const popover = PopoverContext.get()
const positioner = PopoverPositionerContext.get()
const insideToolbar = ToolbarContext.getOr() != null

const element = useTemplateRef<HTMLElement>('element')

const lastCloseEvent = shallowRef<Event | null>(null)

const initialFocusTarget = computed<FocusTarget>(
  () =>
    initialFocus ??
    ((interactionType) => (interactionType === 'touch' ? (element.value ?? true) : true))
)

PopoverClosePartContext.set({
  register: () => {
    popover.closePartCount.value++
    return () => {
      popover.closePartCount.value--
    }
  }
})

watchEffect(() => {
  popover.popupId.value = id.value
  onWatcherCleanup(() => {
    popover.popupId.value = undefined
  })
})

watchPostEffect(() => {
  popover.popupElement.value = element.value
  onWatcherCleanup(() => {
    popover.popupElement.value = null
  })
})

openChangeComplete({
  open: popover.open,
  element,
  onComplete: () => {
    if (popover.open.value) popover.onOpenChangeComplete.value?.(true)
  }
})

useFocusManager({
  open: popover.open,
  modal: popover.focusManagerModal,
  enabled: () => popover.mounted.value && popover.openChangeReason.value !== REASONS.triggerHover,
  popupElement: element,
  triggerElement: popover.triggerElement,
  initialFocus: () => initialFocusTarget.value,
  finalFocus: () => finalFocus,
  openMethod: popover.openMethod,
  restoreFocus: 'popup',
  closeOnFocusOut: true,
  onFocusOut: () => (event) => {
    lastCloseEvent.value = event ?? null
    popover.setOpen(false, REASONS.focusOut, event)
  },
  getNextFocusableElement: () => popover.triggerFocusTargetElement.value,
  closeEvent: lastCloseEvent,
  closeReason: popover.openChangeReason
})

useDismiss({
  open: popover.open,
  tree: () => popover.floatingTree,
  nodeId: () => popover.floatingNodeId,
  popupElement: popover.floatingElement,
  referenceElement: popover.domReferenceElement,
  outsidePressEvent: () => ({
    mouse: popover.modal.value === 'trap-focus' ? 'sloppy' : 'intentional',
    touch: 'sloppy'
  }),
  onClose: (reason, event) => {
    const closeReason = reason === REASONS.escapeKey ? REASONS.escapeKey : REASONS.outsidePress
    lastCloseEvent.value = event ?? null
    popover.setOpen(false, closeReason, event)
  },
  isInsideElement: popover.containsTrigger
})

hoverFloatingInteraction(popover, {
  enabled: () => popover.openOnHover.value && !popover.triggerDisabled.value,
  closeDelay: popover.closeDelay,
  nodeId: () => popover.floatingNodeId
})

publishCloseGuardContext({
  data: popover.data,
  side: positioner.renderedSide,
  domReference: popover.domReferenceElement,
  floating: popover.floatingElement
})

const popoverState = computed<PopoverPopupState>(() => ({
  open: popover.open.value,
  side: positioner.side.value,
  align: positioner.align.value,
  instant: popover.instantType.value,
  transitionStatus: popover.transitionStatus.value
}))

const stateAttrs = computed(() => anchoredPopupAttrs(popoverState.value))

function stopCompositeKeys(event: KeyboardEvent) {
  if (insideToolbar && COMPOSITE_KEYS.has(event.key)) {
    event.stopPropagation()
  }
}

watchSyncEffect(() => {
  const node = element.value
  if (!node) return
  onWatcherCleanup(
    listen(node, 'keydown', (event: KeyboardEvent) => chain(onKeydown, stopCompositeKeys)(event))
  )
})

const ownAttrs = computed(() => ({
  id: id.value,
  role: 'dialog',
  tabindex: -1,
  'data-shards-ui-focusable': '',
  'aria-labelledby': popover.titleId.value,
  'aria-describedby': popover.descriptionId.value
}))

const popupStyle = computed(() => getDisabledMountTransitionStyles(popover.transitionStatus.value))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="popupStyle"
  >
    <slot v-bind="popoverState" />
  </component>
</template>
