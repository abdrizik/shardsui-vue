import { createContext } from '@/internal/context'
import type { Align, AnchorPositioning, Side } from '@/internal/floating/anchor-positioning'
import type { SwipeDirection } from '@/internal/swipe-dismiss'
import type { ToastProvider, ToastRoot } from './toast'
import type { ToastObject } from './types'

export type ToastRootState = {
  transitionStatus: ToastObject['transitionStatus']
  expanded: boolean
  limited: boolean
  type: string | undefined
  swiping: boolean
  swipeDirection: SwipeDirection | undefined
}

export type ToastContentState = {
  expanded: boolean
  behind: boolean
}

export type ToastViewportState = {
  expanded: boolean
}

export type ToastTitleState = {
  type: string | undefined
}

export type ToastDescriptionState = {
  type: string | undefined
}

export type ToastCloseState = {
  type: string | undefined
}

export type ToastActionState = {
  type: string | undefined
}

export type ToastPositionerState = {
  side: Side
  align: Align
  anchorHidden: boolean
}

export type ToastArrowState = {
  side: Side
  align: Align
  uncentered: boolean
}

export const ToastProviderContext = createContext<ToastProvider>('Toast.Provider')

export const ToastContext = createContext<ToastRoot>('Toast.Root')

export const ToastPositionerContext = createContext<AnchorPositioning>('Toast.Positioner')
