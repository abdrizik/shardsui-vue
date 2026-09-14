import { createContext } from '@/internal/context'
import type { CollapsibleRoot } from './collapsible'

export const CollapsibleContext = createContext<CollapsibleRoot>('Collapsible.Root')
