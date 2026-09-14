import type { Ref } from 'vue'
import { createContext } from '@/internal/context'
import type { CompositeRoot } from '@/internal/floating/composite'
import type { Orientation } from '@/internal/types'

export type ToggleGroupState = {
  disabled: boolean
  multiple: boolean
  orientation: Orientation
}

export type ToggleGroupContext = {
  composite: CompositeRoot
  value: Readonly<Ref<readonly string[]>>
  disabled: Readonly<Ref<boolean>>
  isValueInitialized: boolean
  setValue: (toggleValue: string, nextPressed: boolean) => void
}

export const ToggleGroupContext = createContext<ToggleGroupContext>('ToggleGroup')
