import type { Ref } from 'vue'
import { createContext } from '@/internal/context'
import type { REASONS } from '@/internal/reasons'
import type { TransitionStatus } from '@/internal/transition-status'
import type { DialogRoot } from './dialog'

export type DialogRole = 'dialog' | 'alertdialog'

export type DialogOpenReason =
  | typeof REASONS.triggerPress
  | typeof REASONS.outsidePress
  | typeof REASONS.escapeKey
  | typeof REASONS.closeWatcher
  | typeof REASONS.closePress
  | typeof REASONS.focusOut
  | typeof REASONS.imperativeAction
  | typeof REASONS.swipe

export type DialogPortalContext = { keepMounted: Readonly<Ref<boolean>> }

export type DialogTriggerState = {
  disabled: boolean
  open: boolean
}

export type DialogCloseState = {
  disabled: boolean
}

export type DialogPopupState = {
  open: boolean
  transitionStatus: TransitionStatus
  nested: boolean
  nestedDialogOpen: boolean
}

export type DialogViewportState = DialogPopupState

export const DialogContext = createContext<DialogRoot>('Dialog.Root')

export const DialogPortalContext = createContext<DialogPortalContext>('Dialog.Portal')
