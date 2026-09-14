import { createContext } from '@/internal/context'
import type { AccordionItem, AccordionRoot } from './accordion'

export const AccordionContext = createContext<AccordionRoot<any>>('Accordion.Root')

export const AccordionItemContext = createContext<AccordionItem>('Accordion.Item')
