import { createContext } from '@/internal/context'
import type { TransitionStatus } from '@/internal/transition-status'
import type { Ref } from 'vue'
import type { FieldRoot, FieldState, FieldValidityData } from './field'

export type FieldItemContext = { disabled: Readonly<Ref<boolean>> }

export type FieldRootState = FieldState & { disabled: boolean }

export type FieldErrorState = FieldRootState & { transitionStatus: TransitionStatus }

export type FieldValidityState = Omit<FieldValidityData, 'state'> & {
  validity: FieldValidityData['state']
  transitionStatus: TransitionStatus
}

export const FieldContext = createContext<FieldRoot>('Field.Root')

export const FieldItemContext = createContext<FieldItemContext>('Field.Item')
