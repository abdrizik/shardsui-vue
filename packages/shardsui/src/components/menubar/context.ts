import { createContext } from '@/internal/context'
import type { MenubarRoot } from './menubar'

export const MenubarContext = createContext<MenubarRoot>('Menubar')
