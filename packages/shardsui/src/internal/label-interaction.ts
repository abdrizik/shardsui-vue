import { toValue, type MaybeRefOrGetter } from 'vue'
import { getTarget, isElement } from './dom'

type LabelInteractionOptions = {
  native?: MaybeRefOrGetter<boolean | undefined>
  focusControl: () => void
}

export function focusElementWithVisible(element: HTMLElement) {
  // `focusVisible` is a WICG FocusOptions member that TS 5's lib does not declare yet.
  element.focus({ focusVisible: true } as FocusOptions)
}

export function labelInteraction(options: LabelInteractionOptions) {
  return {
    activateControl: (event: MouseEvent) => {
      const target = getTarget(event)
      if (isElement(target) && target.closest('button,input,select,textarea')) return

      if (!event.defaultPrevented && event.detail > 1) event.preventDefault()

      if (toValue(options.native)) return
      options.focusControl()
    }
  }
}
