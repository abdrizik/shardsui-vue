import type { ComputedRef } from 'vue'
import { createContext } from '@/internal/context'
import type { Align, AnchorPositioning, Side } from '@/internal/floating/anchor-positioning'
import type { CompositeRoot } from '@/internal/floating/composite'
import type { TransitionStatus } from '@/internal/transition-status'
import type { ActivationDirection, NavigationMenuRoot } from './navigation-menu'

export type NavigationMenuItemContext = {
  value: ComputedRef<unknown>
}

export type NavigationMenuRootState = {
  open: boolean
  nested: boolean
}

export type NavigationMenuListState = {
  open: boolean
}

export type NavigationMenuTriggerState = {
  open: boolean
}

export type NavigationMenuIconState = {
  open: boolean
}

export type NavigationMenuLinkState = {
  active: boolean
}

export type NavigationMenuContentState = {
  open: boolean
  transitionStatus: TransitionStatus
  activationDirection: ActivationDirection
}

export type NavigationMenuPositionerState = {
  open: boolean
  side: Side
  align: Align
  anchorHidden: boolean
  instant: boolean
}

export type NavigationMenuPopupState = {
  open: boolean
  transitionStatus: TransitionStatus
  side: Side
  align: Align
  anchorHidden: boolean
}

export const NavigationMenuContext = createContext<NavigationMenuRoot>('NavigationMenu.Root')

export const NavigationMenuItemContext =
  createContext<NavigationMenuItemContext>('NavigationMenu.Item')

export const NavigationMenuCompositeContext = createContext<CompositeRoot>('NavigationMenu.List')

export const NavigationMenuPositionerContext = createContext<AnchorPositioning>(
  'NavigationMenu.Positioner'
)
