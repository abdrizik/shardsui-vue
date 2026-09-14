import { createContext } from '@/internal/context'
import type { SliderRoot } from './slider'

export const SliderContext = createContext<SliderRoot>('Slider.Root')
