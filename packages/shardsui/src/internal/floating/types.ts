import type { Ref } from 'vue'
import type { PopupTriggerMap } from '../popup-trigger-map'
import type { TransitionStatus } from '../transition-status'
import type { HoverInteraction } from './hover/interaction'
import type { CloseGuardContextBase } from './hover/predicates'

export type FloatingContextData = {
  openEvent?: Event | undefined
  hoverInteraction?: HoverInteraction | undefined
  closeGuardContext?: CloseGuardContextBase | undefined
}

export type HoverContext = {
  data: FloatingContextData
  triggerElements: PopupTriggerMap
  open: Readonly<Ref<boolean>>
  transitionStatus: Readonly<Ref<TransitionStatus>>
  domReferenceElement: Readonly<Ref<Element | null>>
  floatingElement: Readonly<Ref<HTMLElement | null>>
  setOpen(open: boolean, reason?: string, event?: Event, trigger?: HTMLElement | null): unknown
}
