<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, useId, watchSyncEffect } from 'vue'
import { ToolbarContext } from '@/components/toolbar/context'
import { anchoredPopupAttrs } from '@/internal/anchored-state'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { DirectionContext } from '@/internal/direction-context'
import { listen } from '@/internal/dom'
import type { FocusTarget } from '@/internal/floating/focus-manager'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import { MenuContext, MenuPositionerContext, type MenuPopupState } from './context'
import { useMenuPopup } from './popup'

type Props = PartProps & {
  id?: string
  finalFocus?: FocusTarget
  onKeydown?: (event: KeyboardEvent) => void
  onMousemove?: (event: MouseEvent) => void
  onPointermove?: (event: PointerEvent) => void
  onClick?: (event: MouseEvent) => void
  onFocusout?: (event: FocusEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  id: idProp,
  finalFocus = undefined,
  onKeydown,
  onMousemove,
  onPointermove,
  onClick,
  onFocusout
} = defineProps<Props>()

defineSlots<{ default?: (state: MenuPopupState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const menu = MenuContext.get()
const positioner = MenuPositionerContext.getOr()
const insideToolbar = ToolbarContext.getOr() != null
const direction = DirectionContext.get()

const element = usePartElement()

const popup = useMenuPopup(menu, positioner, direction, insideToolbar, {
  ref: element,
  id,
  finalFocus: () => finalFocus
})

const menuState = computed<MenuPopupState>(() => ({
  transitionStatus: menu.transitionStatus.value,
  side: popup.side.value,
  align: popup.align.value,
  open: menu.open.value,
  nested: popup.nested.value,
  instant: menu.instantType.value
}))

const stateAttrs = computed(() => ({
  ...anchoredPopupAttrs(menuState.value),
  ...dataAttrs({ nested: popup.nested.value })
}))

watchSyncEffect(() => {
  const node = element.value
  if (!node) return
  onWatcherCleanup(
    listen(node, 'keydown', (event: KeyboardEvent) => chain(onKeydown, popup.onKeydown)(event))
  )
  onWatcherCleanup(
    listen(node, 'click', (event: MouseEvent) => chain(onClick, popup.onClick)(event))
  )
  onWatcherCleanup(
    listen(node, 'mousemove', (event: MouseEvent) => chain(onMousemove, popup.onMousemove)(event))
  )
})

const ownAttrs = computed(() => ({
  id: id.value,
  role: 'menu',
  'aria-orientation': menu.orientation.value,
  'aria-labelledby': menu.triggerElement.value?.id,
  tabindex: -1,
  'data-shards-ui-focusable': '',
  'data-rootownerid': menu.rootId.value,
  onPointermove: chain(onPointermove, popup.onPointermove),
  onFocusout: chain(onFocusout, popup.onFocusout)
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="popup.style.value"
  >
    <slot v-bind="menuState" />
  </component>
</template>
