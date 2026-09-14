import { createContext } from '@/internal/context'

/** Presence marker: anchored positioners assert they are inside a `*.Portal`. */
export const AnchoredPortalContext = createContext<true>('*.Portal')
