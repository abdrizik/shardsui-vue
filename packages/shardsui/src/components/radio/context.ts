import type { ComputedRef } from 'vue'
import type { FieldState } from '@/components/field/field'
import { createContext } from '@/internal/context'

export type RadioState = FieldState & {
  checked: boolean
  disabled: boolean
  readOnly: boolean
  required: boolean
}

export type RadioContext = {
  state: ComputedRef<RadioState>
  stateAttrs: ComputedRef<Record<string, string | undefined>>
}

export const RadioContext = createContext<RadioContext>('Radio.Root')
