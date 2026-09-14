import type { Ref } from 'vue'
import { createContext } from '@/internal/context'
import type { Orientation } from '@/internal/types'
import type { ScrollAreaRoot, ScrollAreaRootState } from './scroll-area'

export type ScrollAreaScrollbarContext = {
  orientation: Readonly<Ref<Orientation>>
}

export type ScrollAreaScrollbarState = ScrollAreaRootState & {
  hovering: boolean
  orientation: Orientation
}

export type ScrollAreaThumbState = {
  scrolling: boolean
  orientation: Orientation
}

export const ScrollAreaContext = createContext<ScrollAreaRoot>('ScrollArea.Root')
export const ScrollAreaScrollbarContext =
  createContext<ScrollAreaScrollbarContext>('ScrollArea.Scrollbar')
