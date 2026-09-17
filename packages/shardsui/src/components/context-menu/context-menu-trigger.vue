<script setup lang="ts">
import { computed, mergeProps, onScopeDispose, onWatcherCleanup, watchPostEffect } from 'vue'
import { MenuContext } from '@/components/menu/context'
import { findRootOwnerId } from '@/components/menu/find-root-owner-id'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { contains, getTarget, listen } from '@/internal/dom'
import { usePartElement } from '@/internal/part-element'
import { REASONS } from '@/internal/reasons'
import { useTimeout } from '@/internal/timeout'
import type { PartProps } from '@/internal/types'
import { ContextMenuContext, type ContextMenuTriggerState } from './context'

const LONG_PRESS_DELAY = 500
const MOVE_TOLERANCE = 10
const TOUCH_ANCHOR_SIZE = 10

type Props = PartProps & {
  onContextmenu?: (event: MouseEvent) => void
  onTouchstart?: (event: TouchEvent) => void
  onTouchmove?: (event: TouchEvent) => void
  onTouchend?: (event: TouchEvent) => void
  onTouchcancel?: (event: TouchEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  onContextmenu,
  onTouchstart,
  onTouchmove,
  onTouchend,
  onTouchcancel
} = defineProps<Props>()

defineSlots<{ default?: (state: ContextMenuTriggerState) => any }>()

const contextMenu = ContextMenuContext.get()
const menu = MenuContext.get()

const element = usePartElement()

const pressTimeout = useTimeout()
const allowMouseUpTimeout = useTimeout()
let pressStart: { x: number; y: number } | null = null
let allowMouseUp = false
let offMouseUp: (() => void) | null = null

onScopeDispose(() => offMouseUp?.())

watchPostEffect(() => {
  const el = element.value
  if (!el) return
  onWatcherCleanup(
    listen(el.ownerDocument, 'contextmenu', (event: MouseEvent) => {
      if (menu.disabled.value) return
      const target = getTarget(event)
      if (
        contains(el, target) ||
        contains(menu.internalBackdropElement.value, target) ||
        contains(menu.backdropElement.value, target)
      ) {
        event.preventDefault()
      }
    })
  )
})

function openAt(x: number, y: number, isTouch: boolean, event: Event) {
  contextMenu.initialCursorPoint.value = { x, y }
  contextMenu.anchor.value = {
    getBoundingClientRect() {
      const size = isTouch ? TOUCH_ANCHOR_SIZE : 0
      return DOMRect.fromRect({ width: size, height: size, x, y })
    }
  }
  allowMouseUp = false
  menu.setOpen(true, REASONS.triggerPress, event)

  allowMouseUpTimeout.start(LONG_PRESS_DELAY, () => {
    allowMouseUp = true
  })
}

function cancelOnMouseUp(event: MouseEvent) {
  contextMenu.allowMouseUpTrigger.value = false

  if (!allowMouseUp) return

  allowMouseUpTimeout.clear()
  allowMouseUp = false

  const target = getTarget(event)
  if (contains(menu.positionerElement.value, target)) return
  if (findRootOwnerId(target) === menu.rootId.value) return

  menu.setOpen(false, REASONS.cancelOpen, event)
}

function openOnContextMenu(event: MouseEvent) {
  if (menu.disabled.value) return
  event.preventDefault()
  event.stopPropagation()

  contextMenu.allowMouseUpTrigger.value = true

  openAt(event.clientX, event.clientY, false, event)

  offMouseUp?.()
  offMouseUp = listen(element.value?.ownerDocument ?? document, 'mouseup', cancelOnMouseUp, {
    once: true
  })
}

function cancelLongPress() {
  pressTimeout.clear()
  pressStart = null
}

function startLongPress(event: TouchEvent) {
  if (menu.disabled.value) {
    cancelLongPress()
    return
  }

  contextMenu.allowMouseUpTrigger.value = false

  if (event.touches.length !== 1) {
    cancelLongPress()
    return
  }

  event.stopPropagation()
  const touch = event.touches[0]!
  const start = { x: touch.clientX, y: touch.clientY }
  pressStart = start
  pressTimeout.start(LONG_PRESS_DELAY, () => {
    openAt(start.x, start.y, true, event)
  })
}

function cancelLongPressOnMove(event: TouchEvent) {
  if (event.touches.length !== 1) {
    cancelLongPress()
    return
  }

  if (!pressTimeout.isStarted() || !pressStart) return

  const touch = event.touches[0]!
  const dx = Math.abs(touch.clientX - pressStart.x)
  const dy = Math.abs(touch.clientY - pressStart.y)
  if (dx > MOVE_TOLERANCE || dy > MOVE_TOLERANCE) {
    cancelLongPress()
  }
}

const triggerState = computed<ContextMenuTriggerState>(() => ({ open: menu.open.value }))

const stateAttrs = computed(() =>
  dataAttrs({ 'popup-open': menu.open.value, pressed: menu.open.value })
)

const ownAttrs = computed(() => ({
  onContextmenu: chain(onContextmenu, openOnContextMenu),
  onTouchstart: chain(onTouchstart, startLongPress),
  onTouchmove: chain(onTouchmove, cancelLongPressOnMove),
  onTouchend: chain(onTouchend, cancelLongPress),
  onTouchcancel: chain(onTouchcancel, cancelLongPress)
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="{ WebkitTouchCallout: 'none' }"
  >
    <slot v-bind="triggerState" />
  </component>
</template>
