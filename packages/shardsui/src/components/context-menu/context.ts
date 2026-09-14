import type { ShallowRef } from 'vue'
import { createContext } from '@/internal/context'
import type { VirtualAnchorElement } from '@/internal/floating/anchor-positioning'

export type ContextMenuRoot = {
  anchor: ShallowRef<VirtualAnchorElement>
  initialCursorPoint: ShallowRef<{ x: number; y: number } | null>
  allowMouseUpTrigger: ShallowRef<boolean>
}

export const ContextMenuContext = createContext<ContextMenuRoot>('ContextMenu.Root')

export type ContextMenuTriggerState = {
  open: boolean
}
