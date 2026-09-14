import { createContext } from '@/internal/context'
import type { FormRoot } from './form'

export const FormContext = createContext<FormRoot>('Form')
