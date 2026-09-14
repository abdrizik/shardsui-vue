import type { ComputedRef, ShallowRef } from 'vue'
import { createContext } from '@/internal/context'

export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'

export type AvatarRootState = {
  imageLoadingStatus: ImageLoadingStatus
}

export type AvatarRoot = {
  imageLoadingStatus: ShallowRef<ImageLoadingStatus>
  state: ComputedRef<AvatarRootState>
}

export const AvatarContext = createContext<AvatarRoot>('Avatar.Root')
