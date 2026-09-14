import { createContext } from '@/internal/context'
import { DEFAULT_LABELABLE, type LabelableContextValue } from '@/internal/labelable'

export const LabelableContext = createContext<LabelableContextValue>(
  'Field.Root',
  DEFAULT_LABELABLE
)
