import {
  computed,
  onWatcherCleanup,
  toValue,
  watch,
  watchPostEffect,
  type MaybeRefOrGetter
} from 'vue'
import { isMac, isWebKit } from '@/internal/detect-browser'
import { contains, getTarget, listen } from '@/internal/dom'
import { matchesFocusVisible } from '@/internal/floating/element'
import { isTypeableElement } from '@/internal/floating/tabbable'
import { REASONS, type ChangeEventReason } from '@/internal/reasons'
import { useTimeout } from '@/internal/timeout'
import type { PopupTriggerMap } from '../popup-trigger-map'
import { isInsideEnabledTrigger } from './hover/predicates'

const isMacSafari = isMac && isWebKit

type FocusReferenceOptions = {
  enabled?: MaybeRefOrGetter<boolean | undefined>
  open: MaybeRefOrGetter<boolean>
  openChangeReason: MaybeRefOrGetter<ChangeEventReason | null | undefined>
  triggerElement: MaybeRefOrGetter<HTMLElement | null>
  activeTriggerElement: MaybeRefOrGetter<Element | null>
  popupElement: MaybeRefOrGetter<HTMLElement | null>
  triggerElements: PopupTriggerMap
  delay?: MaybeRefOrGetter<number | undefined>
  setOpen(open: boolean, reason?: string, event?: Event, trigger?: HTMLElement | null): unknown
}

export function createFocusReference(options: FocusReferenceOptions) {
  let blocked = false
  let blockedTrigger: Element | null = null
  let keyboardModality = true
  const timeout = useTimeout()

  const enabled = computed(() => toValue(options.enabled) ?? true)
  const triggerElement = computed(() => toValue(options.triggerElement))

  function reset(): void {
    blocked = false
    blockedTrigger = null
  }

  function shouldOpen(event: FocusEvent): boolean {
    if (!enabled.value) return false

    if (blocked) {
      if (blockedTrigger === triggerElement.value) return false
      reset()
    }

    const target = getTarget(event)
    if (!target) return true

    if (isMacSafari && !event.relatedTarget) {
      return keyboardModality || isTypeableElement(target)
    }
    return matchesFocusVisible(target)
  }

  watchPostEffect(() => {
    if (!enabled.value) return

    const win = triggerElement.value?.ownerDocument.defaultView ?? window

    const onWindowBlur = () => {
      const current = triggerElement.value
      if (!toValue(options.open) && current && current.ownerDocument.activeElement === current) {
        blocked = true
      }
    }

    const cleanups = [listen(win, 'blur', onWindowBlur)]

    // Safari fails to match `:focus-visible` when focus was initially outside the document,
    // so the modality has to be tracked by hand there.
    if (isMacSafari) {
      cleanups.push(
        listen(win, 'keydown', () => (keyboardModality = true), { capture: true }),
        listen(win, 'pointerdown', () => (keyboardModality = false), { capture: true })
      )
    }

    onWatcherCleanup(() => cleanups.forEach((cleanup) => cleanup()))
  })

  let wasOpen = toValue(options.open)
  watch(
    () =>
      [
        toValue(options.open),
        toValue(options.openChangeReason),
        toValue(options.activeTriggerElement)
      ] as const,
    ([open, reason, active]) => {
      if (
        wasOpen &&
        !open &&
        (reason === REASONS.triggerPress || reason === REASONS.escapeKey) &&
        active
      ) {
        blockedTrigger = active
        blocked = true
      }
      wasOpen = open
    },
    { flush: 'post' }
  )

  return {
    reset,

    onFocus: (event: FocusEvent): void => {
      if (!shouldOpen(event)) return

      const element = triggerElement.value
      if (!element) return

      const delay = toValue(options.delay)
      const movedFromOtherEnabledTrigger = isInsideEnabledTrigger(
        event.relatedTarget,
        options.triggerElements
      )

      if ((toValue(options.open) && movedFromOtherEnabledTrigger) || !delay) {
        timeout.clear()
        options.setOpen(true, REASONS.triggerFocus, event, element)
        return
      }

      timeout.start(delay, () => {
        if (blocked) return
        options.setOpen(true, REASONS.triggerFocus, event, element)
      })
    },

    onBlur: (event: FocusEvent): void => {
      const relatedTarget = event.relatedTarget

      reset()

      timeout.start(0, () => {
        if (!toValue(options.open)) return

        const element = triggerElement.value
        const active = (element?.ownerDocument ?? document).activeElement

        if (!relatedTarget && active === element) return
        if (contains(toValue(options.popupElement), active)) return
        if (contains(element, active)) return
        if (isInsideEnabledTrigger(relatedTarget ?? active, options.triggerElements)) return

        options.setOpen(false, REASONS.triggerFocus)
      })
    }
  }
}
