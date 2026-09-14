import type {
  AnchoredPopupState,
  AnchoredPositionerState,
  AnchoredViewportState
} from '@/internal/anchored-state'
import { createContext } from '@/internal/context'
import type { AnchorPositioning } from '@/internal/floating/anchor-positioning'
import type { REASONS } from '@/internal/reasons'
import type { PopoverInstantType, PopoverRoot } from './popover'

export type PopoverPopupState = AnchoredPopupState<PopoverInstantType>

export type PopoverPositionerState = AnchoredPositionerState<PopoverInstantType>

export type PopoverViewportState = AnchoredViewportState<PopoverInstantType>

export type PopoverTriggerState = {
  disabled: boolean
  open: boolean
}

export type PopoverOpenReason =
  | typeof REASONS.triggerHover
  | typeof REASONS.triggerPress
  | typeof REASONS.outsidePress
  | typeof REASONS.escapeKey
  | typeof REASONS.closePress
  | typeof REASONS.focusOut
  | typeof REASONS.imperativeAction

export const PopoverContext = createContext<PopoverRoot>('Popover.Root')

export const PopoverClosePartContext = createContext<{
  register: () => () => void
}>('Popover.Popup')

export const PopoverPositionerContext = createContext<AnchorPositioning>('Popover.Positioner')
