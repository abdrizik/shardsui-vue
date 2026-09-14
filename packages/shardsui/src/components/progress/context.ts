import { createContext } from '@/internal/context'
import type { ProgressRoot } from './progress'

export const ProgressContext = createContext<ProgressRoot>('Progress.Root')
