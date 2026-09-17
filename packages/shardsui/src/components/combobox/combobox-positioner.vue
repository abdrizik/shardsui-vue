<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, watch, watchEffect } from 'vue'
import { AnchoredPortalContext } from '@/internal/anchored-portal'
import { anchoredPositionerAttrs } from '@/internal/anchored-state'
import { DROPDOWN_COLLISION_AVOIDANCE } from '@/internal/constants'
import { dataAttrs } from '@/internal/data-attrs'
import {
  useAnchorPositioning,
  type AnchorPositioningProps
} from '@/internal/floating/anchor-positioning'
import { usePositionerStyle } from '@/internal/floating/positioner-style'
import InternalBackdrop from '@/internal/internal-backdrop.vue'
import { usePartElement } from '@/internal/part-element'
import { useScrollLock } from '@/internal/scroll-lock'
import type { PartProps } from '@/internal/types'
import { ComboboxContext, ComboboxPositionerContext, type ComboboxPositionerState } from './context'

type Props = PartProps & AnchorPositioningProps

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  side,
  align,
  sideOffset,
  alignOffset,
  collisionBoundary,
  collisionPadding,
  collisionAvoidance = { side: 'flip', align: 'flip', ...DROPDOWN_COLLISION_AVOIDANCE },
  sticky = undefined,
  arrowPadding,
  disableAnchorTracking = undefined,
  anchor,
  positionMethod
} = defineProps<Props>()

defineSlots<{ default?: (state: ComboboxPositionerState) => any }>()

const combobox = ComboboxContext.get()
AnchoredPortalContext.get()

const element = usePartElement()

watch(
  () => element.value,
  (node) => {
    combobox.positionerElement.value = node ?? null
  },
  { immediate: true, flush: 'sync' }
)

const anchorElement = computed(
  () =>
    anchor ??
    (combobox.inputInsidePopup.value
      ? combobox.triggerElement.value
      : (combobox.inputGroupElement.value ?? combobox.inputElement.value))
)

const positioning = useAnchorPositioning({
  anchor: () => (combobox.mounted.value ? anchorElement.value : null),
  floating: () => (combobox.mounted.value ? element.value : null),
  side: () => side,
  align: () => align,
  sideOffset: () => sideOffset,
  alignOffset: () => alignOffset,
  positionMethod: () => positionMethod,
  collisionBoundary: () => collisionBoundary,
  collisionPadding: () => collisionPadding,
  collisionAvoidance: () => collisionAvoidance,
  sticky: () => sticky,
  arrowPadding: () => arrowPadding,
  disableAnchorTracking: () => disableAnchorTracking,
  lazyFlip: true
})

useScrollLock({
  enabled: () => combobox.open.value && combobox.modal.value,
  referenceElement: () =>
    combobox.inputGroupElement.value ?? combobox.inputElement.value ?? combobox.triggerElement.value
})

watchEffect(() => {
  combobox.popupSide.value = combobox.mounted.value ? positioning.side.value : null
  onWatcherCleanup(() => {
    combobox.popupSide.value = null
  })
})

ComboboxPositionerContext.set(positioning)

usePositionerStyle({
  element,
  styles: positioning.positionerStyles
})

const showBackdrop = computed(() => combobox.mounted.value && combobox.modal.value)
const backdropCutout = computed(
  () =>
    combobox.inputGroupElement.value ?? combobox.inputElement.value ?? combobox.triggerElement.value
)

const comboboxState = computed<ComboboxPositionerState>(() => ({
  open: combobox.open.value,
  side: positioning.side.value,
  align: positioning.align.value,
  anchorHidden: positioning.anchorHidden.value,
  empty: combobox.isEmpty.value
}))

const stateAttrs = computed(() => ({
  ...anchoredPositionerAttrs(comboboxState.value),
  ...dataAttrs({ empty: combobox.isEmpty.value })
}))

const ownAttrs = computed(() => ({
  hidden: !combobox.mounted.value,
  role: 'presentation'
}))

const positionerStyle = computed(() => ({
  ...(combobox.transitionStatus.value === 'starting' ? { transition: 'none' } : undefined),
  ...(combobox.open.value ? undefined : { pointerEvents: 'none' })
}))
</script>

<template>
  <InternalBackdrop
    v-if="showBackdrop"
    :inert="combobox.open.value ? undefined : true"
    :cutout="backdropCutout"
  />
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="positionerStyle"
  >
    <slot v-bind="comboboxState" />
  </component>
</template>
