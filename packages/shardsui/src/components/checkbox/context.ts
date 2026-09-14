import type { ComputedRef } from 'vue'
import type { FieldState } from '@/components/field/field'
import { createContext } from '@/internal/context'

export type CheckboxState = FieldState & {
  checked: boolean
  disabled: boolean
  readOnly: boolean
  required: boolean
  indeterminate: boolean
}

export type CheckboxContext = {
  state: ComputedRef<CheckboxState>
  stateAttrs: ComputedRef<Record<string, string | undefined>>
}

export const CheckboxContext = createContext<CheckboxContext>('Checkbox.Root')
