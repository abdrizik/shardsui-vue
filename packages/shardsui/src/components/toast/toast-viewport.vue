<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, useTemplateRef, watchPostEffect } from 'vue'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { contains, getTarget, listen } from '@/internal/dom'
import { matchesFocusVisible } from '@/internal/floating/element'
import FocusGuard from '@/internal/focus-guard.vue'
import { useTimeout } from '@/internal/timeout'
import type { PartProps } from '@/internal/types'
import { visuallyHidden } from '@/internal/visually-hidden'
import { ToastProviderContext, type ToastViewportState } from './context'

type Props = PartProps & {
  onMouseenter?: (event: MouseEvent) => void
  onMousemove?: (event: MouseEvent) => void
  onMouseleave?: (event: MouseEvent) => void
  onFocusin?: (event: FocusEvent) => void
  onFocusout?: (event: FocusEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onClick?: (event: MouseEvent) => void
  onPointerdown?: (event: PointerEvent) => void
  onPointerup?: (event: PointerEvent) => void
  onPointercancel?: (event: PointerEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  onMouseenter,
  onMousemove,
  onMouseleave,
  onFocusin,
  onFocusout,
  onKeydown,
  onClick,
  onPointerdown,
  onPointerup,
  onPointercancel
} = defineProps<Props>()

defineSlots<{ default?: (state: ToastViewportState) => any }>()

const provider = ToastProviderContext.get()

const element = useTemplateRef<HTMLElement>('element')

let handlingFocusGuard = false
let mouseLeavePending = false
let touchActive = false

const windowFocusTimeout = useTimeout()

watchPostEffect(() => {
  const el = element.value
  if (!el) return
  provider.viewport.value = el
  onWatcherCleanup(() => {
    if (provider.viewport.value === el) provider.viewport.value = null
  })
})

watchPostEffect(() => {
  const viewport = provider.viewport.value
  if (provider.isEmpty.value || !viewport) return

  const doc = viewport.ownerDocument
  const win = doc.defaultView ?? window

  function focusViewportOnF6(event: KeyboardEvent) {
    if (event.key === 'F6' && getTarget(event) !== provider.viewport.value) {
      event.preventDefault()
      provider.prevFocusElement.value = doc.activeElement as HTMLElement | null
      provider.viewport.value?.focus({ preventScroll: true })
      provider.pauseTimers()
      provider.focused.value = true
    }
  }

  function pauseOnWindowBlur(event: FocusEvent) {
    if (getTarget(event) !== win) return
    provider.isWindowFocused.value = false
    provider.pauseTimers()
  }

  function resumeOnWindowFocus(event: FocusEvent) {
    if (event.relatedTarget) return
    const target = getTarget(event)
    const activeEl = doc.activeElement
    if (
      target === win ||
      !contains(provider.viewport.value, target) ||
      !matchesFocusVisible(activeEl)
    ) {
      provider.resumeTimers()
    }
    // Deferred so the viewport's own `focus` handler, which runs after this capture-phase
    // listener, still sees the window as blurred and leaves the timers paused.
    windowFocusTimeout.start(0, () => {
      provider.isWindowFocused.value = true
    })
  }

  const cleanups = [
    listen(win, 'keydown', focusViewportOnF6),
    listen(win, 'blur', pauseOnWindowBlur, { capture: true }),
    listen(win, 'focus', resumeOnWindowFocus, { capture: true }),
    listen(doc, 'pointerdown', provider.collapseOnOutsideTouch, { capture: true })
  ]

  onWatcherCleanup(() => {
    for (const cleanup of cleanups) cleanup()
  })
})

const hasTransitioningToasts = computed(() =>
  provider.toasts.value.some((toast) => toast.transitionStatus === 'ending')
)

const highPriorityToasts = computed(() =>
  provider.toasts.value.filter((toast) => toast.priority === 'high')
)

const frontmostHeight = computed(() => provider.toasts.value[0]?.height)

const toastState = computed<ToastViewportState>(() => ({ expanded: provider.expanded.value }))

function resumeTimersIfWindowFocused() {
  if (provider.isWindowFocused.value) {
    provider.resumeTimers()
  }
}

function flushMouseLeave() {
  if (hasTransitioningToasts.value || touchActive || !mouseLeavePending) return

  resumeTimersIfWindowFocused()
  provider.hovering.value = false
  mouseLeavePending = false
}

watchPostEffect(flushMouseLeave)

function beginHover() {
  provider.pauseTimers()
  provider.hovering.value = true
  mouseLeavePending = false
}

function leaveViewport() {
  mouseLeavePending = true
  flushMouseLeave()
}

function markTouchActive(event: PointerEvent) {
  if (event.pointerType === 'touch') touchActive = true
}

function clearTouchActive(event: PointerEvent) {
  if (event.pointerType !== 'touch') return
  touchActive = false
  flushMouseLeave()
}

function enterViewport() {
  if (handlingFocusGuard) {
    handlingFocusGuard = false
    return
  }
  if (provider.focused.value) return
  const doc = provider.viewport.value?.ownerDocument ?? document
  if (matchesFocusVisible(doc.activeElement)) {
    provider.focused.value = true
    provider.pauseTimers()
  }
}

function exitViewport(event: FocusEvent) {
  if (!provider.focused.value || contains(provider.viewport.value, event.relatedTarget)) return
  provider.focused.value = false
  resumeTimersIfWindowFocused()
}

function restoreFocusOnShiftTab(event: KeyboardEvent) {
  if (event.key === 'Tab' && event.shiftKey && getTarget(event) === provider.viewport.value) {
    event.preventDefault()
    provider.restoreFocusToPrevElement()
  }
}

function focusFirstToast(event: FocusEvent) {
  handlingFocusGuard = true

  const firstFocusableToast =
    event.relatedTarget === provider.viewport.value
      ? provider.toasts.value.find((toast) => toast.transitionStatus !== 'ending' && !toast.limited)
      : undefined

  if (firstFocusableToast) {
    firstFocusableToast.element?.focus()
  } else {
    provider.restoreFocusToPrevElement()
  }
}

const showFocusGuards = computed(
  () => !provider.isEmpty.value && provider.prevFocusElement.value !== null
)

const stateAttrs = computed(() => dataAttrs({ expanded: provider.expanded.value }))

const ownAttrs = computed(() => ({
  tabindex: -1,
  role: 'region',
  'aria-live': 'polite',
  'aria-atomic': false,
  'aria-relevant': 'additions text',
  'aria-label': 'Notifications',
  onMouseenter: chain(onMouseenter, beginHover),
  onMousemove: chain(onMousemove, beginHover),
  onMouseleave: chain(onMouseleave, leaveViewport),
  onFocusin: chain(onFocusin, enterViewport),
  onFocusout: chain(onFocusout, exitViewport),
  onKeydown: chain(onKeydown, restoreFocusOnShiftTab),
  onClick: chain(onClick, enterViewport),
  onPointerdown: chain(onPointerdown, markTouchActive),
  onPointerup: chain(onPointerup, clearTouchActive),
  onPointercancel: chain(onPointercancel, clearTouchActive)
}))

const viewportStyle = computed(() => ({
  '--toast-frontmost-height': frontmostHeight.value ? `${frontmostHeight.value}px` : undefined
}))
</script>

<template>
  <FocusGuard v-if="showFocusGuards" :on-focus="focusFirstToast" />

  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="viewportStyle"
  >
    <FocusGuard v-if="showFocusGuards" :on-focus="focusFirstToast" />
    <slot v-bind="toastState" />
    <FocusGuard v-if="showFocusGuards" :on-focus="focusFirstToast" />
  </component>

  <div v-if="!provider.focused.value && highPriorityToasts.length > 0" :style="visuallyHidden">
    <div v-for="toast in highPriorityToasts" :key="toast.id" role="alert" aria-atomic="true">
      <div>{{ toast.title }}</div>
      <div>{{ toast.description }}</div>
    </div>
  </div>
</template>
