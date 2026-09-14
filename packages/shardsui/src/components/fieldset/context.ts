import { createContext } from '@/internal/context'
import type { FieldsetRoot } from './fieldset'

export type FieldsetState = {
  disabled: boolean
}

export const FieldsetContext = createContext<FieldsetRoot>('Fieldset.Root')
