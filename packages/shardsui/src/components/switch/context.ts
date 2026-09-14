import type { FieldState } from '@/components/field/field'
import { createContext } from '@/internal/context'
import type { ComputedRef } from 'vue'

export type SwitchState = FieldState & {
  checked: boolean
  disabled: boolean
  readOnly: boolean
  required: boolean
}

export type SwitchContext = {
  state: ComputedRef<SwitchState>
  stateAttrs: ComputedRef<Record<string, string | undefined>>
}

export const SwitchContext = createContext<SwitchContext>('Switch.Root')
