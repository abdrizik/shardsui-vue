import { createContext } from '@/internal/context'
import type { MeterRoot } from './meter'

export const MeterContext = createContext<MeterRoot>('Meter.Root')
