import type { Ref } from 'vue'
import type {
  AnchoredPopupState,
  AnchoredPositionerState,
  AnchoredViewportState
} from '@/internal/anchored-state'
import { createContext } from '@/internal/context'
import type { AnchorPositioning } from '@/internal/floating/anchor-positioning'
import type { FloatingTreeEvents } from '@/internal/floating/floating-tree'
import type { TransitionStatus } from '@/internal/transition-status'
import type { MenuRoot } from './menu'

export type MenuInstantType = 'group' | 'click' | 'dismiss' | 'trigger-change'

export type MenuPopupState = AnchoredPopupState<MenuInstantType> & { nested: boolean }

export type MenuPositionerState = AnchoredPositionerState<MenuInstantType> & { nested: boolean }

export type MenuViewportState = AnchoredViewportState<MenuInstantType>

export type MenuOpenChangeReason =
  | 'trigger-press'
  | 'trigger-hover'
  | 'trigger-focus'
  | 'focus-out'
  | 'item-press'
  | 'sibling-open'
  | 'list-navigation'
  | 'outside-press'
  | 'escape-key'
  | 'imperative-action'
  | 'cancel-open'

export type MenuOpenChangeEvent = {
  open: boolean
  nodeId: string
  parentNodeId: string | null
  reason: MenuOpenChangeReason | null
}

export type MenuItemHoverEvent = {
  nodeId: string
  target: Element
}

export type MenuTreeEvents = FloatingTreeEvents & {
  menuopenchange: MenuOpenChangeEvent
  itemhover: MenuItemHoverEvent
  close: { domEvent: Event; reason: MenuOpenChangeReason }
}

export type MenuGroupContext = {
  labelId: Ref<string | undefined>
}

export type MenuRadioGroupContext = {
  value: Readonly<Ref<unknown>>
  setValue: (value: unknown) => void
  disabled: Readonly<Ref<boolean>>
}

export type MenuCheckableItemContext = {
  checked: Readonly<Ref<boolean>>
  disabled: Readonly<Ref<boolean>>
  highlighted: Readonly<Ref<boolean>>
}

export const MenuContext = createContext<MenuRoot>('Menu.Root')

export const MenuPositionerContext = createContext<AnchorPositioning>('Menu.Positioner')

export const MenuGroupContext = createContext<MenuGroupContext>('Menu.Group')

export const MenuRadioGroupContext = createContext<MenuRadioGroupContext>('Menu.RadioGroup')

export const MenuCheckboxItemContext = createContext<MenuCheckableItemContext>('Menu.CheckboxItem')

export const MenuRadioItemContext = createContext<MenuCheckableItemContext>('Menu.RadioItem')

export const MenuSubmenuContext = createContext<true>('Menu.SubmenuRoot')

export type MenuItemState = {
  highlighted: boolean
  disabled: boolean
}

export type MenuCheckableItemState = MenuItemState & {
  checked: boolean
}

export type MenuItemIndicatorState = MenuCheckableItemState & {
  transitionStatus: TransitionStatus
}

export type MenuLinkItemState = {
  highlighted: boolean
}

export type MenuRadioGroupState = {
  disabled: boolean
}

export type MenuSubmenuTriggerState = MenuItemState & {
  open: boolean
}

export type MenuTriggerState = {
  disabled: boolean
  open: boolean
}
