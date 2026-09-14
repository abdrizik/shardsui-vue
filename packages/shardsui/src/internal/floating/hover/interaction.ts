import { onScopeDispose } from 'vue'
import { listen } from '../../dom'
import { REASONS } from '../../reasons'
import { createTimeout, type Timeout } from '../../timeout'
import type { FloatingTree } from '../floating-tree'
import type { FloatingContextData, HoverContext } from '../types'
import { getDelay, type CloseGuardOptions, type Delay } from './predicates'

export type HoverInteraction = {
  pointerType: string | undefined
  interactedInside: boolean
  blockMouseMove: boolean
  restTimeoutPending: boolean
  isHoverCloseActive: boolean
  closeGuardOptions: (() => CloseGuardOptions) | undefined

  performedPointerEventsMutation: boolean
  pointerEventsScopeElement: HTMLElement | SVGSVGElement | null
  pointerEventsReferenceElement: HTMLElement | SVGSVGElement | null
  pointerEventsFloatingElement: HTMLElement | null

  mouseMoveHandler: ((event: MouseEvent) => void) | undefined

  subscribers: number
  openChangeTimeout: Timeout
  restTimeout: Timeout

  trackMouseMove(doc: Document, handler: (event: MouseEvent) => void): void
  stopTrackingMouseMove(): void
  closeAfterDelay(
    root: HoverContext,
    tree: FloatingTree | null,
    delay: Delay,
    event: MouseEvent
  ): void
  onOpenChange(change: { open: boolean; reason?: string }): void
  dispose(): void
}

export function createHoverInteraction(): HoverInteraction {
  let offMouseMove: (() => void) | undefined

  const interaction: HoverInteraction = {
    pointerType: undefined,
    interactedInside: false,
    blockMouseMove: true,
    restTimeoutPending: false,
    isHoverCloseActive: false,
    closeGuardOptions: undefined,

    performedPointerEventsMutation: false,
    pointerEventsScopeElement: null,
    pointerEventsReferenceElement: null,
    pointerEventsFloatingElement: null,

    mouseMoveHandler: undefined,

    subscribers: 0,
    openChangeTimeout: createTimeout(),
    restTimeout: createTimeout(),

    trackMouseMove(doc, handler) {
      interaction.stopTrackingMouseMove()
      interaction.mouseMoveHandler = handler
      offMouseMove = listen(doc, 'mousemove', handler)
    },

    stopTrackingMouseMove() {
      if (!interaction.mouseMoveHandler) return
      offMouseMove?.()
      offMouseMove = undefined
      interaction.mouseMoveHandler = undefined
    },

    closeAfterDelay(root, tree, delay, event) {
      const closeDelay = getDelay(delay, 'close', interaction.pointerType)
      const close = () => {
        root.setOpen(false, REASONS.triggerHover, event)
        tree?.events.emit('floating.closed', event)
      }
      if (closeDelay) {
        interaction.openChangeTimeout.start(closeDelay, close)
      } else {
        interaction.openChangeTimeout.clear()
        close()
      }
    },

    onOpenChange(change) {
      if (change.open) {
        interaction.isHoverCloseActive = false
        return
      }
      interaction.isHoverCloseActive = change.reason === REASONS.triggerHover
      interaction.stopTrackingMouseMove()
      interaction.openChangeTimeout.clear()
      interaction.restTimeout.clear()
      interaction.blockMouseMove = true
      interaction.restTimeoutPending = false
    },

    dispose() {
      interaction.openChangeTimeout.clear()
      interaction.restTimeout.clear()
    }
  }

  return interaction
}

/**
 * Returns the `HoverInteraction` shared by every consumer of a holder, disposed once the last
 * of them unmounts.
 */
export function getHoverInteraction(holder: {
  hoverInteraction?: HoverInteraction | undefined
}): HoverInteraction {
  const instance = (holder.hoverInteraction ??= createHoverInteraction())
  instance.subscribers += 1

  onScopeDispose(() => {
    instance.subscribers -= 1
    if (instance.subscribers > 0) return

    instance.dispose()
    if (holder.hoverInteraction === instance) {
      holder.hoverInteraction = undefined
    }
  })

  return instance
}

const ownerByScopeElement = new WeakMap<HTMLElement | SVGSVGElement, HoverInteraction>()

export function clearSafePolygonPointerEventsMutation(instance: HoverInteraction): void {
  if (!instance.performedPointerEventsMutation) {
    return
  }

  const scopeElement = instance.pointerEventsScopeElement

  if (scopeElement && ownerByScopeElement.get(scopeElement) === instance) {
    scopeElement.style.removeProperty('pointer-events')
    instance.pointerEventsReferenceElement?.style.removeProperty('pointer-events')
    instance.pointerEventsFloatingElement?.style.removeProperty('pointer-events')
    ownerByScopeElement.delete(scopeElement)
  }

  instance.performedPointerEventsMutation = false
  instance.pointerEventsScopeElement = null
  instance.pointerEventsReferenceElement = null
  instance.pointerEventsFloatingElement = null
}

export function applySafePolygonPointerEventsMutation(
  instance: HoverInteraction,
  options: {
    scopeElement: HTMLElement | SVGSVGElement
    referenceElement: HTMLElement | SVGSVGElement
    floatingElement: HTMLElement
  }
): void {
  const { scopeElement, referenceElement, floatingElement } = options

  const existingOwner = ownerByScopeElement.get(scopeElement)
  if (existingOwner && existingOwner !== instance) {
    clearSafePolygonPointerEventsMutation(existingOwner)
  }

  clearSafePolygonPointerEventsMutation(instance)
  instance.performedPointerEventsMutation = true
  instance.pointerEventsScopeElement = scopeElement
  instance.pointerEventsReferenceElement = referenceElement
  instance.pointerEventsFloatingElement = floatingElement
  ownerByScopeElement.set(scopeElement, instance)

  scopeElement.style.pointerEvents = 'none'
  referenceElement.style.pointerEvents = 'auto'
  floatingElement.style.pointerEvents = 'auto'
}

export function dispatchOpenChange(
  data: FloatingContextData,
  open: boolean,
  reason?: string
): void {
  data.hoverInteraction?.onOpenChange({
    open,
    reason: reason ?? REASONS.none
  })
}
