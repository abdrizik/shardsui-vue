import { shallowRef, type Ref } from 'vue'
import { createContext } from '@/internal/context'

export type TextDirection = 'ltr' | 'rtl'

export type DirectionContextValue = {
  direction: Readonly<Ref<TextDirection>>
}

export const DirectionContext = createContext<DirectionContextValue>('DirectionProvider', {
  direction: shallowRef<TextDirection>('ltr')
})

export function getDirection(): Readonly<Ref<TextDirection>> {
  return DirectionContext.get().direction
}
