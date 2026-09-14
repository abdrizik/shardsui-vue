import { createContext } from '@/internal/context'
import type { TransitionStatus } from '@/internal/transition-status'
import type { TabsList } from './list'
import type { TabsRoot, TabsState } from './tabs'

export type TabPosition = {
  left: number
  right: number
  top: number
  bottom: number
}

export type TabSize = {
  width: number
  height: number
}

export type TabsTabState = TabsState & {
  active: boolean
  disabled: boolean
}

export type TabsPanelState = TabsState & {
  hidden: boolean
  transitionStatus: TransitionStatus
}

export type TabsIndicatorState = TabsState & {
  activeTabPosition: TabPosition | null
  activeTabSize: TabSize | null
}

export const TabsContext = createContext<TabsRoot>('Tabs.Root')

export const TabsListContext = createContext<TabsList>('Tabs.List')
