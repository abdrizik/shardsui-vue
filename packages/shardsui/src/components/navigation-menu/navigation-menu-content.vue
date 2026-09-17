<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, shallowRef, watchPostEffect } from 'vue'
import { cancelAnimationFrameTick, requestAnimationFrameTick } from '@/internal/animation-frame'
import { createAnimationsFinished } from '@/internal/animations-finished'
import { chain } from '@/internal/chain'
import { FOCUS_GUARD_ATTRIBUTE } from '@/internal/constants'
import { dataAttrs } from '@/internal/data-attrs'
import { contains, getTarget, isElement } from '@/internal/dom'
import { useCompositeRoot } from '@/internal/floating/composite'
import { portalTo } from '@/internal/floating/portal'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import {
  NavigationMenuCompositeContext,
  NavigationMenuContext,
  NavigationMenuItemContext,
  type NavigationMenuContentState
} from './context'
import type { ContentStatus } from './navigation-menu'

type Props = PartProps & {
  keepMounted?: boolean
  onKeydown?: (event: KeyboardEvent) => void
  onFocusin?: (event: FocusEvent) => void
  onFocusout?: (event: FocusEvent) => void
}

defineOptions({ inheritAttrs: false })

const { as = 'div', keepMounted = false, onKeydown, onFocusin, onFocusout } = defineProps<Props>()

defineSlots<{ default?: (state: NavigationMenuContentState) => any }>()

const navigationMenu = NavigationMenuContext.get()
const item = NavigationMenuItemContext.get()

const element = usePartElement()

const composite = useCompositeRoot({
  orientation: 'both',
  loopFocus: true,
  ref: element
})

NavigationMenuCompositeContext.set(composite)

const animationsFinished = createAnimationsFinished({ element })

const hasMountedInPortal = shallowRef(false)
const status = shallowRef<ContentStatus | null>(null)
const focusInside = shallowRef(false)

const portalContainer = computed(
  () => navigationMenu.viewportTargetElement.value ?? navigationMenu.viewportElement.value
)
const isActive = computed(() => item.value.value === navigationMenu.value.value)
const ending = computed(() => status.value === 'ending')

watchPostEffect(() => {
  if (keepMounted && portalContainer.value != null) hasMountedInPortal.value = true
})

const renderInline = computed(
  () => keepMounted && portalContainer.value == null && !hasMountedInPortal.value
)

watchPostEffect(() => {
  if (isActive.value) {
    if (status.value === null) status.value = 'starting'
    else if (status.value === 'ending') status.value = 'idle'
  } else if (status.value !== null && status.value !== 'ending') {
    status.value = 'ending'
  }
})

watchPostEffect(() => {
  if (status.value !== 'starting') return
  const frameId = requestAnimationFrameTick(() => {
    if (status.value === 'starting') status.value = 'idle'
  })
  onWatcherCleanup(() => cancelAnimationFrameTick(frameId))
})

watchPostEffect(() => {
  if (!ending.value) return
  const controller = new AbortController()
  animationsFinished.run(() => {
    status.value = null
  }, controller.signal)
  onWatcherCleanup(() => controller.abort())
})

watchPostEffect(() => {
  if (isActive.value && status.value !== null && element.value) {
    navigationMenu.currentContentElement.value = element.value
  }
})

const renderPortaled = computed(() => portalContainer.value != null && status.value !== null)
const renderHidden = computed(
  () => portalContainer.value != null && status.value === null && keepMounted
)

watchPostEffect(() => {
  const el = element.value
  const container = portalContainer.value
  if (!el || renderInline.value || !container) return
  onWatcherCleanup(portalTo(container)(el))
})

function trackFocusInside(event: FocusEvent) {
  const target = getTarget(event)
  if (isElement(target) && target.hasAttribute(FOCUS_GUARD_ATTRIBUTE)) return
  focusInside.value = true
}

function releaseFocusInside(event: FocusEvent) {
  if (!contains(element.value, event.relatedTarget)) focusInside.value = false
}

const navigationMenuState = computed<NavigationMenuContentState>(() => ({
  open: !ending.value && status.value !== null,
  transitionStatus: status.value ?? undefined,
  activationDirection: navigationMenu.activationDirection.value
}))

const stateAttrs = computed(() =>
  dataAttrs({
    open: !ending.value && status.value !== null,
    closed: ending.value || status.value === null,
    'starting-style': status.value === 'starting',
    'ending-style': ending.value,
    'activation-direction': navigationMenu.activationDirection.value
  })
)

const ownAttrs = computed(() => {
  if (renderInline.value) {
    return {
      hidden: true,
      onKeydown: chain(onKeydown, composite.onKeydown),
      onFocusin,
      onFocusout
    }
  }
  if (renderHidden.value) {
    return { hidden: true, onKeydown, onFocusin, onFocusout }
  }
  return {
    inert: (ending.value && !focusInside.value) || undefined,
    onKeydown: chain(onKeydown, composite.onKeydown),
    onFocusin: chain(onFocusin, trackFocusInside),
    onFocusout: chain(onFocusout, releaseFocusInside)
  }
})

const contentStyle = computed(() =>
  renderPortaled.value && ending.value ? { position: 'absolute', top: '0', left: '0' } : undefined
)
</script>

<template>
  <component
    :is="as"
    v-if="renderInline || renderPortaled || renderHidden"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="contentStyle"
  >
    <slot v-bind="navigationMenuState" />
  </component>
</template>
