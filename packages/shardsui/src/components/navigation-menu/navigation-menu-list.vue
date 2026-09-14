<script setup lang="ts">
import { computed, mergeProps, useTemplateRef } from 'vue'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { contains, getTarget } from '@/internal/dom'
import { useCompositeRoot } from '@/internal/floating/composite'
import { useDismiss } from '@/internal/floating/dismiss'
import { hoverFloatingInteraction } from '@/internal/floating/hover/floating'
import { REASONS } from '@/internal/reasons'
import type { PartProps } from '@/internal/types'
import {
  NavigationMenuCompositeContext,
  NavigationMenuContext,
  type NavigationMenuListState
} from './context'

type Props = PartProps & {
  onKeydown?: (event: KeyboardEvent) => void
}

defineOptions({ inheritAttrs: false })

const { as = 'ul', onKeydown } = defineProps<Props>()

defineSlots<{ default?: (state: NavigationMenuListState) => any }>()

const navigationMenu = NavigationMenuContext.get()

const element = useTemplateRef<HTMLElement>('element')

hoverFloatingInteraction(navigationMenu, {
  enabled: navigationMenu.hoverInteractionsEnabled,
  closeDelay: navigationMenu.closeDelay,
  tree: () => navigationMenu.floatingTree,
  nodeId: () => navigationMenu.floatingNodeId,
  parentId: () => navigationMenu.floatingParentNodeId
})

const composite = navigationMenu.nested.value
  ? undefined
  : useCompositeRoot({
      orientation: navigationMenu.orientation,
      loopFocus: false,
      ref: element
    })

if (composite) {
  NavigationMenuCompositeContext.set(composite)
}

useDismiss({
  open: navigationMenu.open,
  enabled: navigationMenu.interactionsEnabled,
  tree: () => navigationMenu.floatingTree,
  nodeId: () => navigationMenu.floatingNodeId,
  outsidePressEvent: 'intentional',
  outsidePress: () => (event) => !navigationMenu.containsTrigger(getTarget(event)),
  popupElement: navigationMenu.floatingElement,
  isInsideElement: (target) =>
    contains(navigationMenu.popupElement.value, target) || navigationMenu.containsTrigger(target),
  onClose: (reason, event) => {
    const closeReason = reason === REASONS.escapeKey ? REASONS.escapeKey : REASONS.outsidePress
    navigationMenu.setValue(null, closeReason, event)
  }
})

function navigateList(event: KeyboardEvent) {
  if (navigationMenu.nested.value) {
    return
  }
  composite?.onKeydown(event)
  const shouldStop =
    (navigationMenu.orientation.value === 'horizontal' &&
      (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) ||
    (navigationMenu.orientation.value === 'vertical' &&
      (event.key === 'ArrowUp' || event.key === 'ArrowDown'))
  if (shouldStop) {
    event.stopPropagation()
  }
}

const navigationMenuState = computed<NavigationMenuListState>(() => ({
  open: navigationMenu.open.value
}))

const stateAttrs = computed(() => dataAttrs({ open: navigationMenu.open.value }))

const ownAttrs = computed(() => ({ onKeydown: chain(onKeydown, navigateList) }))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)">
    <slot v-bind="navigationMenuState" />
  </component>
</template>
