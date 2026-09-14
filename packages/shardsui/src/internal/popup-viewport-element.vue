<script setup lang="ts" generic="Instant extends string">
import {
  computed,
  mergeProps,
  onWatcherCleanup,
  useTemplateRef,
  watchPostEffect,
  type CSSProperties
} from 'vue'
import type { AnchoredViewportState } from '@/internal/anchored-state'
import { dataAttrs } from '@/internal/data-attrs'
import type { Side } from '@/internal/floating/anchor-positioning'
import { usePopupAutoResize } from '@/internal/popup-auto-resize'
import { usePopupViewport } from '@/internal/popup-viewport'
import type { PartProps } from '@/internal/types'

type Props = PartProps & {
  activeTrigger: Element | null
  activeTriggerId?: string | null
  payload?: unknown
  popupElement: HTMLElement | null
  positionerElement: HTMLElement | null
  side: Side
  direction: 'ltr' | 'rtl'
  mounted: boolean
  open: boolean
  instantType: Instant | undefined
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  activeTrigger,
  activeTriggerId = null,
  payload,
  popupElement,
  positionerElement,
  side,
  direction,
  mounted,
  open,
  instantType
} = defineProps<Props>()

const hasViewport = defineModel<boolean>('hasViewport', { default: false })

defineSlots<{ default?: (state: AnchoredViewportState<Instant>) => any }>()

const currentContainerElement = useTemplateRef<HTMLDivElement>('currentContainer')
const previousContainerElement = useTemplateRef<HTMLDivElement>('previousContainer')

const resizeContent = computed(() => [payload, currentContainerElement.value])

const viewport = usePopupViewport({
  activeTrigger: () => activeTrigger,
  activeTriggerId: () => activeTriggerId,
  currentContainer: currentContainerElement,
  open: () => open,
  mounted: () => mounted
})

watchPostEffect(() => {
  hasViewport.value = true
  onWatcherCleanup(() => {
    hasViewport.value = false
  })
})

watchPostEffect(() => {
  const node = viewport.previousNode.value
  const container = previousContainerElement.value
  if (!container || !node) return
  container.replaceChildren(...Array.from(node.childNodes))
})

usePopupAutoResize({
  popupElement: () => popupElement,
  positionerElement: () => positionerElement,
  content: () => resizeContent.value,
  side: () => side,
  direction: () => direction,
  mounted: () => mounted,
  onMeasureLayout: () => {
    const current = currentContainerElement.value
    const previous = previousContainerElement.value
    if (current) {
      current.style.setProperty('animation', 'none')
      current.style.setProperty('transition', 'none')
    }
    if (previous) {
      previous.style.setProperty('display', 'none')
    }
  },
  onMeasureLayoutComplete: (prevDim) => {
    const current = currentContainerElement.value
    const previous = previousContainerElement.value
    if (current) {
      current.style.removeProperty('animation')
      current.style.removeProperty('transition')
    }
    if (previous) {
      previous.style.removeProperty('display')
    }
    if (prevDim) {
      viewport.previousContentDimensions.value = prevDim
    }
  }
})

const previousStyle = computed<CSSProperties>(() => {
  const dimensions = viewport.previousContentDimensions.value
  return {
    position: 'absolute',
    '--popup-width': dimensions ? `${dimensions.width}px` : undefined,
    '--popup-height': dimensions ? `${dimensions.height}px` : undefined
  }
})

const viewportState = computed<AnchoredViewportState<Instant>>(() => ({
  activationDirection: viewport.activationDirection.value,
  transitioning: viewport.transitioning.value,
  instant: instantType
}))

const stateAttrs = computed(() =>
  dataAttrs({
    'activation-direction': viewport.activationDirection.value,
    transitioning: viewport.transitioning.value,
    instant: instantType
  })
)

const previousAttrs = computed(() =>
  dataAttrs({ 'ending-style': !viewport.showStartingStyle.value })
)

const currentAttrs = computed(() =>
  dataAttrs({
    'starting-style': viewport.transitioning.value && viewport.showStartingStyle.value
  })
)

const currentStyle = computed(() =>
  viewport.showStartingStyle.value ? { transition: 'none' } : undefined
)
</script>

<template>
  <component :is="as" v-bind="mergeProps(stateAttrs, $attrs)">
    <div
      v-if="viewport.transitioning.value"
      ref="previousContainer"
      data-previous
      inert
      v-bind="previousAttrs"
      :style="previousStyle"
    ></div>
    <div
      :key="viewport.contentKey.value"
      ref="currentContainer"
      data-current
      v-bind="currentAttrs"
      :style="currentStyle"
    >
      <slot v-bind="viewportState" />
    </div>
  </component>
</template>
