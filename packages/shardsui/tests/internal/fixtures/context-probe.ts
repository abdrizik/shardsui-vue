import { createContext } from '@/internal/context'

export const ProbeContext = createContext<string>('Owner.Part')

export const observations: { seen?: string | undefined; thrown?: unknown } = {}

export function resetObservations(): void {
  observations.seen = undefined
  observations.thrown = undefined
}
