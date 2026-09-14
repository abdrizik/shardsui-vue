<script setup lang="ts">
import {
  computed,
  mergeProps,
  onWatcherCleanup,
  shallowRef,
  useTemplateRef,
  watchPostEffect,
  watchSyncEffect
} from 'vue'
import { AnchoredPortalContext } from '@/internal/anchored-portal'
import { anchoredPositionerAttrs } from '@/internal/anchored-state'
import { DROPDOWN_COLLISION_AVOIDANCE, POPUP_COLLISION_AVOIDANCE } from '@/internal/constants'
import { dataAttrs } from '@/internal/data-attrs'
import { isElement, listen } from '@/internal/dom'
import {
  useAnchorPositioning,
  type AnchorPositioningProps
} from '@/internal/floating/anchor-positioning'
import { usePositionerStyle } from '@/internal/floating/positioner-style'
import { publishCloseGuardContext } from '@/internal/floating/publish-close-guard-context'
import { disableFocusInside, enableFocusInside, isOutsideEvent } from '@/internal/floating/tabbable'
import { useTimeout } from '@/internal/timeout'
import type { PartProps } from '@/internal/types'
import {
  NavigationMenuContext,
  NavigationMenuPositionerContext,
  type NavigationMenuPositionerState
} from './context'

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
  collisionAvoidance: collisionAvoidanceProp,
  sticky = undefined,
  arrowPadding,
  disableAnchorTracking = undefined,
  anchor,
  positionMethod
} = defineProps<Props>()

defineSlots<{ default?: (state: NavigationMenuPositionerState) => any }>()

const navigationMenu = NavigationMenuContext.get()
AnchoredPortalContext.get()

const element = useTemplateRef<HTMLElement>('element')

const initialInstantTimeout = useTimeout()
const resizeTimeout = useTimeout()
let needsInitialInstantReset = false
const instant = shallowRef(false)

if (navigationMenu.open.value) {
  instant.value = true
  needsInitialInstantReset = true
}

watchSyncEffect(() => {
  element.value?.toggleAttribute('data-instant', instant.value)
})

watchPostEffect(() => {
  navigationMenu.positionerElement.value = element.value
  onWatcherCleanup(() => {
    navigationMenu.positionerElement.value = null
  })
})

watchPostEffect(() => {
  const el = element.value
  if (!el) return

  function syncFocusInside(event: FocusEvent) {
    if (el && isOutsideEvent(event, el)) {
      const focusing = event.type === 'focusin'
      const manageFocus = focusing ? enableFocusInside : disableFocusInside
      manageFocus(el)
    }
  }

  const offIn = listen(el, 'focusin', syncFocusInside, { capture: true })
  const offOut = listen(el, 'focusout', syncFocusInside, { capture: true })
  onWatcherCleanup(() => {
    offIn()
    offOut()
  })
})

const collisionAvoidance = computed(
  () =>
    collisionAvoidanceProp ??
    (navigationMenu.nested.value ? POPUP_COLLISION_AVOIDANCE : DROPDOWN_COLLISION_AVOIDANCE)
)

const anchorElement = computed(
  () =>
    anchor ?? navigationMenu.activeTriggerElement.value ?? navigationMenu.prevTriggerElement.value
)

const positioning = useAnchorPositioning({
  anchor: () => (navigationMenu.mounted.value ? anchorElement.value : null),
  floating: () => (navigationMenu.mounted.value ? element.value : null),
  side: () => side,
  align: () => align,
  sideOffset: () => sideOffset,
  alignOffset: () => alignOffset,
  positionMethod: () => positionMethod,
  collisionBoundary: () => collisionBoundary,
  collisionPadding: () => collisionPadding,
  collisionAvoidance,
  sticky: () => sticky,
  arrowPadding: () => arrowPadding,
  disableAnchorTracking: () => disableAnchorTracking,
  shift: () => ({ rootBoundary: 'layoutViewport' }),
  adaptiveOrigin: true
})

watchPostEffect(() => {
  const el = element.value
  if (!navigationMenu.open.value || !el) return

  if (needsInitialInstantReset) {
    initialInstantTimeout.start(0, () => {
      needsInitialInstantReset = false
      if (!resizeTimeout.isStarted()) {
        instant.value = false
      }
    })
  }

  function onresize() {
    instant.value = true
    resizeTimeout.start(100, () => {
      instant.value = false
    })
  }

  const win = el.ownerDocument.defaultView ?? window
  onWatcherCleanup(listen(win, 'resize', onresize))
})

publishCloseGuardContext({
  data: navigationMenu.data,
  enabled: () => navigationMenu.open.value && !!element.value,
  side: positioning.renderedSide,
  domReference: () => (isElement(anchorElement.value) ? anchorElement.value : null),
  floating: element,
  nodeId: navigationMenu.floatingNodeId
})

usePositionerStyle({
  element,
  styles: positioning.positionerStyles
})

NavigationMenuPositionerContext.set(positioning)

const navigationMenuState = computed<NavigationMenuPositionerState>(() => ({
  open: navigationMenu.open.value,
  side: positioning.side.value,
  align: positioning.align.value,
  anchorHidden: positioning.anchorHidden.value,
  instant: instant.value
}))

const stateAttrs = computed(() => ({
  ...anchoredPositionerAttrs({ ...navigationMenuState.value, instant: undefined }),
  ...dataAttrs({ instant: instant.value })
}))

const ownAttrs = computed(() => ({
  hidden: !navigationMenu.mounted.value,
  role: 'presentation'
}))

const positionerStyle = computed(() => ({
  ...(navigationMenu.transitionStatus.value === 'starting' ? { transition: 'none' } : undefined),
  ...(!navigationMenu.open.value ? { pointerEvents: 'none' } : undefined)
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="positionerStyle"
  >
    <slot v-bind="navigationMenuState" />
  </component>
</template>
