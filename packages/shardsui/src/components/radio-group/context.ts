import type { FieldState } from '@/components/field/field'
import { createContext } from '@/internal/context'
import type { RadioGroupRoot } from './radio-group'

export type RadioGroupState = FieldState & {
  disabled: boolean
  readOnly: boolean
  required: boolean
}

export const RadioGroupContext = createContext<RadioGroupRoot<any>>('RadioGroup')
