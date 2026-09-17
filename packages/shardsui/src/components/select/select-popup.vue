<script setup lang="ts">
import {
  computed,
  mergeProps,
  onScopeDispose,
  onWatcherCleanup,
  watchEffect,
  watchPostEffect,
  watchSyncEffect
} from 'vue'
import { ToolbarContext } from '@/components/toolbar/context'
import { createAnimationFrame } from '@/internal/animation-frame'
import { anchoredPopupAttrs } from '@/internal/anchored-state'
import { chain } from '@/internal/chain'
import { COMPOSITE_KEYS } from '@/internal/composite'
import { listen } from '@/internal/dom'
import { useFocusManager, type FocusTarget } from '@/internal/floating/focus-manager'
import { createTypeahead } from '@/internal/floating/typeahead'
import { getDisabledMountTransitionStyles } from '@/internal/get-disabled-mount-transition-styles'
import { openChangeComplete } from '@/internal/open-change-complete'
import { usePartElement } from '@/internal/part-element'
import { REASONS } from '@/internal/reasons'
import { isStationaryWebKitPointer } from '@/internal/stationary-pointer'
import type { PartProps } from '@/internal/types'
import { SelectContext, SelectPositionerContext, type SelectPopupState } from './context'

type Props = PartProps & {
  id?: string
  finalFocus?: FocusTarget
  onKeydown?: (event: KeyboardEvent) => void
  onFocusout?: (event: FocusEvent) => void
  onPointermove?: (event: PointerEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  id: idProp,
  finalFocus = undefined,
  onKeydown,
  onFocusout,
  onPointermove
} = defineProps<Props>()

defineSlots<{ default?: (state: SelectPopupState) => any }>()

const select = SelectContext.get()
const registry = select.itemRegistry
const insideToolbar = ToolbarContext.getOr() != null

const positioner = SelectPositionerContext.get()

const element = usePartElement()

const hasList = computed(() => select.listElement.value !== null)
const id = computed(() => idProp ?? (hasList.value ? undefined : `${select.rootId.value}-list`))

watchPostEffect(() => {
  select.popupElement.value = element.value
  onWatcherCleanup(() => {
    select.popupElement.value = null
  })
})

watchEffect(() => {
  const current = id.value
  select.popupId.value = current
  onWatcherCleanup(() => {
    if (select.popupId.value === current) select.popupId.value = undefined
  })
})

watchPostEffect(() => {
  const node = element.value
  if (!node) return
  onWatcherCleanup(
    listen(node, 'scroll', () => {
      if (select.listElement.value) return
      select.updateScrollArrowVisibility()
    })
  )
})

openChangeComplete({
  open: select.open,
  element,
  onComplete: () => {
    if (select.open.value) select.onOpenChangeComplete.value?.(true)
  }
})

useFocusManager({
  open: select.open,
  modal: false,
  enabled: select.mounted,
  popupElement: element,
  triggerElement: select.triggerElement,
  openMethod: select.openMethod,
  initialFocus: () => false,
  finalFocus: () => finalFocus,
  restoreFocus: 'popup',
  closeOnFocusOut: true,
  onFocusOut: () => (event) => {
    select.setOpen(false, REASONS.focusOut, event)
  },
  closeEvent: select.lastCloseEvent,
  closeReason: select.openChangeReason,
  getNextFocusableElement: () => select.triggerFocusTargetElement.value
})

const listNavigationFrame = createAnimationFrame()
onScopeDispose(listNavigationFrame.cancel)

watchPostEffect(() => {
  const index = registry.highlightedIndex.value
  const container = element.value
  if (!select.open.value || !container) return
  const scroll = !select.isPointerModality

  function applyFocus() {
    if (!select.open.value) return
    if (index >= 0) {
      registry.focusItemElement(index, scroll)
    } else {
      container!.focus({ preventScroll: true })
    }
  }

  applyFocus()
  listNavigationFrame.request(applyFocus)
})

function indexForNavigationKey(key: string): number | null {
  const active = registry.highlightedIndex.value
  switch (key) {
    case 'ArrowDown':
      return registry.stepIndex(active, 1)
    case 'ArrowUp':
      return registry.stepIndex(active < 0 ? registry.count.value : active, -1)
    case 'Home':
      return registry.firstIndex()
    case 'End':
      return registry.lastIndex()
    default:
      return null
  }
}

const scrollArrowFrame = createAnimationFrame()
onScopeDispose(scrollArrowFrame.cancel)

watchPostEffect(() => {
  if (select.open.value && element.value) {
    scrollArrowFrame.request(() => select.updateScrollArrowVisibility())
  } else {
    scrollArrowFrame.cancel()
  }
})

const typeahead = createTypeahead({
  enabled: () => !select.disabled.value && !select.readOnly.value,
  items: () => registry.labels(),
  activeIndex: registry.highlightedIndex,
  referenceElement: select.triggerElement,
  floatingElement: select.positionerElement,
  isIndexDisabled: (index) => registry.isItemDisabled(index),
  onMatch: (index) => {
    registry.highlightedIndex.value = index
  },
  onTyping: () => (isTyping) => {
    select.typing = isTyping
  }
})

const selectState = computed<SelectPopupState>(() => ({
  open: select.open.value,
  transitionStatus: select.transitionStatus.value,
  side: positioner.side.value,
  align: positioner.align.value
}))

function markPointerModality(event: PointerEvent) {
  if (isStationaryWebKitPointer(event)) return
  select.isPointerModality = true
}

const stateAttrs = computed(() => anchoredPopupAttrs(selectState.value))

function navigateItems(event: KeyboardEvent) {
  if (insideToolbar && COMPOSITE_KEYS.has(event.key)) {
    event.stopPropagation()
  }
  if (select.disabled.value || select.readOnly.value) {
    return
  }
  select.isPointerModality = false

  const next = indexForNavigationKey(event.key)
  if (next === null) {
    typeahead.matchKey(event)
    return
  }
  event.preventDefault()
  if (next !== -1) registry.highlightedIndex.value = next
}

watchSyncEffect(() => {
  const node = element.value
  if (!node) return
  onWatcherCleanup(
    listen(node, 'keydown', (event: KeyboardEvent) => chain(onKeydown, navigateItems)(event))
  )
  onWatcherCleanup(
    listen(node, 'pointermove', (event: PointerEvent) =>
      chain(onPointermove, markPointerModality)(event)
    )
  )
})

const ownAttrs = computed(() => ({
  id: id.value,
  role: hasList.value ? 'presentation' : 'listbox',
  tabindex: -1,
  'data-shards-ui-focusable': '',
  'aria-multiselectable': (!hasList.value && select.multiple.value) || undefined,
  'aria-orientation': hasList.value ? undefined : 'vertical',
  onFocusout: chain(onFocusout, typeahead.resetOnFocusLeave)
}))

const popupStyle = computed(() => getDisabledMountTransitionStyles(select.transitionStatus.value))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="popupStyle"
  >
    <slot v-bind="selectState" />
  </component>
</template>
