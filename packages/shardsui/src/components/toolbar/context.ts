import type { Ref } from 'vue'
import { createContext } from '@/internal/context'
import type { CompositeRoot } from '@/internal/floating/composite'
import type { Orientation } from '@/internal/types'

export type ToolbarContext = {
  composite: CompositeRoot
  disabled: Readonly<Ref<boolean>>
  orientation: Readonly<Ref<Orientation>>
}

export type ToolbarGroupContext = {
  disabled: Readonly<Ref<boolean>>
}

export type ToolbarRootState = {
  disabled: boolean
  orientation: Orientation
}

export type ToolbarLinkState = {
  orientation: Orientation
}

export const ToolbarContext = createContext<ToolbarContext>('Toolbar.Root')

export const ToolbarGroupContext = createContext<ToolbarGroupContext>('Toolbar.Group')
