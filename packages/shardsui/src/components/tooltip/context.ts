import type { Ref } from 'vue'
import type {
  AnchoredArrowState,
  AnchoredPopupState,
  AnchoredPositionerState,
  AnchoredViewportState
} from '@/internal/anchored-state'
import { createContext } from '@/internal/context'
import type { AnchorPositioning } from '@/internal/floating/anchor-positioning'
import type { REASONS } from '@/internal/reasons'
import type { DelayGroup } from './delay-group'
import type { TooltipInstantType, TooltipRoot } from './tooltip'

export type TooltipPopupState = AnchoredPopupState<TooltipInstantType>

export type TooltipArrowState = AnchoredArrowState & {
  instant: TooltipInstantType | undefined
}

export type TooltipViewportState = AnchoredViewportState<TooltipInstantType>

export type TooltipTriggerState = {
  open: boolean
}

export type TooltipPositionerState = AnchoredPositionerState<TooltipInstantType | 'tracking-cursor'>

export type TooltipOpenReason =
  | typeof REASONS.triggerHover
  | typeof REASONS.triggerFocus
  | typeof REASONS.outsidePress
  | typeof REASONS.escapeKey
  | typeof REASONS.triggerPress
  | typeof REASONS.disabled
  | typeof REASONS.imperativeAction
  | typeof REASONS.none

export type TooltipProviderContext = {
  delay: Readonly<Ref<number | undefined>>
  delayGroup: DelayGroup
}

export const TooltipContext = createContext<TooltipRoot>('Tooltip.Root')

export const TooltipProviderContext = createContext<TooltipProviderContext>('Tooltip.Provider')

export const TooltipPositionerContext = createContext<AnchorPositioning>('Tooltip.Positioner')
