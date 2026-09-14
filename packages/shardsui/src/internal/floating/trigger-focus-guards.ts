import { toValue, type MaybeRefOrGetter } from 'vue'
import { contains, isHTMLElement } from '../dom'
import {
  getNextTabbable,
  getTabbableAfterElement,
  getTabbableBeforeElement,
  isOutsideEvent
} from './tabbable'

type TriggerFocusGuardsOptions = {
  close: (event: FocusEvent) => void
  positionerElement: MaybeRefOrGetter<HTMLElement | null>
  popupElement: MaybeRefOrGetter<HTMLElement | null>
  triggerFocusTargetElement: MaybeRefOrGetter<HTMLElement | null>
  preFocusGuardElement: MaybeRefOrGetter<HTMLElement | null>
}

export function createTriggerFocusGuards(options: TriggerFocusGuardsOptions) {
  function closeAndFocusBefore(event: FocusEvent): void {
    options.close(event)
    getTabbableBeforeElement(toValue(options.preFocusGuardElement))?.focus()
  }

  function closeAndFocusAfter(event: FocusEvent): void {
    const positionerElement = toValue(options.positionerElement)

    if (positionerElement && isOutsideEvent(event, positionerElement)) {
      const beforeGuard = toValue(options.popupElement)?.previousElementSibling
      if (isHTMLElement(beforeGuard)) {
        beforeGuard.focus()
        return
      }
    }

    const focusTarget = toValue(options.triggerFocusTargetElement)

    options.close(event)

    let nextTabbable = getTabbableAfterElement(focusTarget)
    while (nextTabbable !== null && contains(positionerElement, nextTabbable)) {
      const prevTabbable = nextTabbable
      nextTabbable = getNextTabbable(nextTabbable)
      if (nextTabbable === prevTabbable) break
    }

    nextTabbable?.focus()
  }

  return { closeAndFocusBefore, closeAndFocusAfter }
}
