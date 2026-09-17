<script setup lang="ts">
import {
  computed,
  mergeProps,
  onWatcherCleanup,
  useId,
  watchPostEffect,
  watchSyncEffect
} from 'vue'
import { DialogContext, DialogPortalContext } from '@/components/dialog/context'
import { chain } from '@/internal/chain'
import { COMPOSITE_KEYS } from '@/internal/composite'
import { dataAttrs } from '@/internal/data-attrs'
import { listen } from '@/internal/dom'
import type { FocusTarget } from '@/internal/floating/focus-manager'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import { DrawerContext, DrawerViewportContext, type DrawerPopupState } from './context'
import { useDrawerPopup } from './popup'

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

defineSlots<{ default?: (state: DrawerPopupState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const drawer = DrawerContext.get()
const dialog = DialogContext.get()
const portal = DialogPortalContext.getOr()
const viewport = DrawerViewportContext.getOr()

const element = usePartElement()

watchPostEffect(() => {
  dialog.popupElement.value = element.value
  onWatcherCleanup(() => {
    dialog.popupElement.value = null
  })
})

const popup = useDrawerPopup(dialog, drawer, viewport, {
  element,
  id,
  initialFocus: () => initialFocus,
  finalFocus: () => finalFocus,
  keepMounted: () => !!portal?.keepMounted.value
})

const drawerState = computed<DrawerPopupState>(() => ({
  open: dialog.open.value,
  transitionStatus: dialog.transitionStatus.value,
  expanded: popup.expanded.value,
  nested: dialog.nested.value,
  nestedDrawerOpen: popup.nestedDrawerOpen.value,
  nestedDrawerSwiping: drawer.nestedSwiping.value,
  swipeDirection: drawer.swipeDirection.value,
  swiping: popup.swiping.value
}))

const stateAttrs = computed(() =>
  dataAttrs({
    'swipe-direction': drawer.swipeDirection.value,
    nested: dialog.nested.value,
    expanded: popup.expanded.value,
    'nested-drawer-open': popup.nestedDrawerOpen.value,
    'nested-drawer-swiping': drawer.nestedSwiping.value,
    swiping: popup.swiping.value || drawer.swipeAreaActive.value,
    'swipe-dismiss': drawer.swipeDismissed.value,
    'ending-style': dialog.transitionStatus.value === 'ending' || popup.releasing.value
  })
)

const stopCompositeKeys = (event: KeyboardEvent) => {
  if (COMPOSITE_KEYS.has(event.key)) event.stopPropagation()
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
  hidden: !dialog.mounted.value,
  role: dialog.role.value,
  'aria-labelledby': dialog.titleId.value,
  'aria-describedby': dialog.descriptionId.value,
  tabindex: -1,
  'data-shards-ui-focusable': ''
}))

const style = computed(() => ({
  '--drawer-swipe-progress': popup.nestedSwipeProgress.value,
  '--drawer-swipe-movement-x': popup.dragMovementX.value,
  '--drawer-swipe-movement-y': popup.dragMovementY.value,
  '--drawer-snap-point-offset': `${popup.snapPointOffset.value}px`,
  '--drawer-swipe-strength': popup.swipeStrengthVar.value,
  '--nested-drawers': dialog.nestedOpenDrawerCount.value,
  '--drawer-height': popup.popupHeightVar.value,
  '--drawer-frontmost-height': popup.frontmostHeightVar.value,
  transform: popup.dragTransform.value,
  transition: popup.dragTransition.value
}))
</script>

<template>
  <component
    :is="as"
    v-if="popup.shouldRender.value"
    ref="element"
    v-bind="mergeProps(dialog.transitionAttrs.value, stateAttrs, ownAttrs, $attrs)"
    :style="style"
  >
    <slot v-bind="drawerState" />
  </component>
</template>
