import type {
  AnchoredPopupState,
  AnchoredPositionerState,
  AnchoredViewportState
} from '@/internal/anchored-state'
import { createContext } from '@/internal/context'
import type { AnchorPositioning } from '@/internal/floating/anchor-positioning'
import type { REASONS } from '@/internal/reasons'
import type { PreviewCardInstantType, PreviewCardRoot } from './preview-card'

export type PreviewCardPopupState = AnchoredPopupState<PreviewCardInstantType>

export type PreviewCardViewportState = AnchoredViewportState<PreviewCardInstantType>

export type PreviewCardTriggerState = {
  open: boolean
}

export type PreviewCardPositionerState = AnchoredPositionerState<PreviewCardInstantType>

export type PreviewCardOpenReason =
  | typeof REASONS.triggerHover
  | typeof REASONS.triggerFocus
  | typeof REASONS.triggerPress
  | typeof REASONS.outsidePress
  | typeof REASONS.escapeKey
  | typeof REASONS.imperativeAction
  | typeof REASONS.none

export const PreviewCardContext = createContext<PreviewCardRoot>('PreviewCard.Root')
export const PreviewCardPositionerContext =
  createContext<AnchorPositioning>('PreviewCard.Positioner')
