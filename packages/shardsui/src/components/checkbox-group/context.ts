import type { FieldState } from '@/components/field/field'
import { createContext } from '@/internal/context'
import type { CheckboxGroupRoot } from './checkbox-group'

export type CheckboxGroupState = FieldState & {
  disabled: boolean
}

export const CheckboxGroupContext = createContext<CheckboxGroupRoot>('CheckboxGroup')
