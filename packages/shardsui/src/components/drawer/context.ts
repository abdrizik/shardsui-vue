import type { ComputedRef, Ref } from 'vue'
import type { DialogRoot } from '@/components/dialog/dialog'
import { createContext } from '@/internal/context'
import type { TransitionStatus } from '@/internal/transition-status'
import type { DrawerRoot, DrawerSwipeDirection } from './drawer'
import type { DrawerSwipe } from './swipe'

export type DrawerPopupState = {
  open: boolean
  transitionStatus: TransitionStatus
  expanded: boolean
  nested: boolean
  nestedDrawerOpen: boolean
  nestedDrawerSwiping: boolean
  swipeDirection: DrawerSwipeDirection
  swiping: boolean
}

export type DrawerSwipeAreaState = {
  open: boolean
  swiping: boolean
  swipeDirection: DrawerSwipeDirection
  disabled: boolean
}

export type DrawerIndentState = {
  active: boolean
}

export type DrawerVisual = {
  swipeProgress: number
  frontmostHeight: number
}

export type DrawerProvider = {
  active: ComputedRef<boolean>
  setDrawerOpen: (drawer: DialogRoot, open: boolean) => void
  visualState: Readonly<Ref<DrawerVisual>>
  setVisualState: (state: DrawerVisual) => void
}

export const DrawerContext = createContext<DrawerRoot>('Drawer.Root')

export const DrawerViewportContext = createContext<DrawerSwipe>('Drawer.Viewport')

export const DrawerProviderContext = createContext<DrawerProvider>('Drawer.Provider')
