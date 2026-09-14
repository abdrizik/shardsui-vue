import { shallowRef, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { isIOS } from './detect-browser'

type InteractionType = 'mouse' | 'touch' | 'pen' | 'keyboard' | ''

type OpenInteractionHandlersOptions = {
  open: MaybeRefOrGetter<boolean>
}

export function useOpenInteractionHandlers(options: OpenInteractionHandlersOptions) {
  const openMethod = shallowRef<InteractionType | null>(null)

  let lastPointerType: InteractionType = ''

  watch(
    () => toValue(options.open),
    (current, previous) => {
      if (previous && !current) openMethod.value = null
    },
    { flush: 'pre' }
  )

  function setOpenMethod(interactionType: InteractionType): void {
    if (!toValue(options.open)) {
      openMethod.value =
        interactionType ||
        // On iOS Safari, the hitslop around touch targets means tapping outside an element's
        // bounds does not fire `pointerdown` but does fire `mousedown`. The `interactionType`
        // will be "" in that case.
        (isIOS ? 'touch' : '')
    }
  }

  function onPointerdown(event: PointerEvent): void {
    if (event.defaultPrevented) {
      return
    }

    lastPointerType = (event.pointerType as InteractionType) || ''
    setOpenMethod(event.pointerType as InteractionType)
  }

  function onClick(event: MouseEvent): void {
    if (event.detail === 0) {
      setOpenMethod('keyboard')
      return
    }

    if ('pointerType' in event) {
      setOpenMethod(((event as PointerEvent).pointerType as InteractionType) || '')
    } else {
      setOpenMethod(lastPointerType)
    }
    lastPointerType = ''
  }

  return { openMethod, onPointerdown, onClick }
}

export type OpenInteractionHandlers = ReturnType<typeof useOpenInteractionHandlers>
