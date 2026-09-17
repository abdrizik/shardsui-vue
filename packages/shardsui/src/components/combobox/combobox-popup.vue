<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, watch, watchEffect } from 'vue'
import { anchoredPopupAttrs } from '@/internal/anchored-state'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { contains, getTarget } from '@/internal/dom'
import { useDismiss } from '@/internal/floating/dismiss'
import { useFocusManager, type FocusTarget } from '@/internal/floating/focus-manager'
import { isTypeableCombobox } from '@/internal/floating/tabbable'
import { getDisabledMountTransitionStyles } from '@/internal/get-disabled-mount-transition-styles'
import { openChangeComplete } from '@/internal/open-change-complete'
import { usePartElement } from '@/internal/part-element'
import { REASONS } from '@/internal/reasons'
import type { PartProps } from '@/internal/types'
import ComboboxInternalDismissButton from './combobox-internal-dismiss-button.vue'
import { ComboboxContext, ComboboxPositionerContext, type ComboboxPopupState } from './context'

type Props = PartProps & {
  id?: string
  initialFocus?: FocusTarget
  finalFocus?: FocusTarget
  onFocusin?: (event: FocusEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  id: idProp,
  initialFocus = undefined,
  finalFocus = undefined,
  onFocusin
} = defineProps<Props>()

defineSlots<{ default?: (state: ComboboxPopupState) => any }>()

const combobox = ComboboxContext.get()
const positioner = ComboboxPositionerContext.getOr()

const element = usePartElement()

watch(
  () => element.value,
  (node) => {
    combobox.popupElement.value = node ?? null
  },
  { immediate: true, flush: 'sync' }
)

const id = computed(
  () => idProp ?? (combobox.inputInsidePopup.value ? `${combobox.rootId.value}-popup` : undefined)
)

watchEffect(() => {
  const current = id.value
  combobox.popupId.value = current
  onWatcherCleanup(() => {
    if (combobox.popupId.value === current) combobox.popupId.value = undefined
  })
})

openChangeComplete({
  open: combobox.open,
  element,
  onComplete: () => {
    if (combobox.open.value) combobox.onOpenChangeComplete.value?.(true)
  }
})

useDismiss({
  open: combobox.open,
  enabled: () => !combobox.readOnly.value && !combobox.disabled.value && !combobox.inline.value,
  popupElement: combobox.positionerElement,
  outsidePressEvent: { mouse: 'sloppy', touch: 'intentional' },
  onClose: (reason, event) => {
    const closeReason = reason === REASONS.escapeKey ? REASONS.escapeKey : REASONS.outsidePress
    combobox.setOpen(false, closeReason, event)
  },
  isInsideElement: (target) => {
    if (contains(element.value, target)) return true
    if (contains(combobox.triggerElement.value, target)) return true
    if (contains(combobox.clearElement.value, target)) return true
    if (contains(combobox.chipsContainerElement.value, target)) return true
    if (contains(combobox.inputElement.value, target)) return true
    return contains(combobox.inputGroupElement.value, target)
  }
})

const computedDefaultInitialFocus = computed<FocusTarget>(() =>
  combobox.inputInsidePopup.value
    ? (interactionType: string) =>
        interactionType === 'touch' ? element.value : combobox.inputElement.value
    : false
)

const resolvedInitialFocus = computed(() =>
  initialFocus === undefined ? computedDefaultInitialFocus.value : initialFocus
)

const resolvedFinalFocus = computed<FocusTarget>(
  () => finalFocus ?? (combobox.inputInsidePopup.value ? undefined : false)
)

const untrappedTypeableCombobox = computed(
  () => resolvedInitialFocus.value === false && isTypeableCombobox(combobox.inputElement.value)
)

useFocusManager({
  open: combobox.open,
  modal: combobox.focusManagerModal,
  enabled: combobox.mounted,
  popupElement: element,
  triggerElement: () =>
    combobox.inputInsidePopup.value ? combobox.triggerElement.value : combobox.inputElement.value,
  openMethod: combobox.openMethod,
  initialFocus: () => resolvedInitialFocus.value,
  finalFocus: () => resolvedFinalFocus.value,
  insideElements: () => [combobox.startDismissElement.value, combobox.endDismissElement.value],
  closeReason: combobox.openChangeReason,
  closeEvent: combobox.lastCloseEvent,
  closeOnFocusOut: () => untrappedTypeableCombobox.value || !combobox.focusManagerModal.value,
  onFocusOut: () => (event) => {
    combobox.setOpen(false, REASONS.focusOut, event)
  }
})

const popupRole = computed(() => (combobox.inputInsidePopup.value ? 'dialog' : 'presentation'))

function redirectFocusToInput(event: FocusEvent) {
  const target = getTarget(event)
  const isFromList = contains(combobox.listElement.value, target) || target === element.value
  if (combobox.openMethod.value !== 'touch' && isFromList) {
    combobox.inputElement.value?.focus()
  }
}

const side = computed(() => positioner?.side.value ?? 'bottom')
const align = computed(() => positioner?.align.value ?? 'center')
const anchorHidden = computed(() => positioner?.anchorHidden.value ?? false)

const comboboxState = computed<ComboboxPopupState>(() => ({
  open: combobox.open.value,
  side: side.value,
  align: align.value,
  anchorHidden: anchorHidden.value,
  transitionStatus: combobox.transitionStatus.value,
  empty: combobox.isEmpty.value
}))

const stateAttrs = computed(() => ({
  ...anchoredPopupAttrs(comboboxState.value),
  ...dataAttrs({ 'anchor-hidden': anchorHidden.value, empty: combobox.isEmpty.value })
}))

const ownAttrs = computed(() => ({
  id: id.value,
  role: popupRole.value,
  tabindex: -1,
  'data-shards-ui-focusable': '',
  onFocusin: chain(onFocusin, redirectFocusToInput)
}))

const popupStyle = computed(() => getDisabledMountTransitionStyles(combobox.transitionStatus.value))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="popupStyle"
  >
    <slot v-bind="comboboxState" />
  </component>
  <ComboboxInternalDismissButton
    v-if="combobox.focusManagerModal.value"
    :element="combobox.endDismissElement"
  />
</template>
