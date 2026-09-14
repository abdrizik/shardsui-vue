import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { FieldState } from '@/components/field/field'
import { createContext } from '@/internal/context'
import type { Align, AnchorPositioning, Side } from '@/internal/floating/anchor-positioning'
import type { TransitionStatus } from '@/internal/transition-status'
import type { ComboboxRoot } from './combobox'

export type ComboboxValueType<Value, Multiple extends boolean | undefined> = Multiple extends true
  ? Value[]
  : Value

export type ComboboxItemContextValue = { selected: ComputedRef<boolean> }

export type ComboboxItemState = {
  disabled: boolean
  selected: boolean
  highlighted: boolean
}

export type ComboboxTriggerState = FieldState & {
  open: boolean
  disabled: boolean
  popupSide: Side | null
  listEmpty: boolean
  placeholder: boolean
}

export type ComboboxInputGroupState = FieldState & {
  open: boolean
  disabled: boolean
  readOnly: boolean
  popupSide: Side | null
  listEmpty: boolean
  placeholder: boolean
}

export type ComboboxClearState = {
  disabled: boolean
  visible: boolean
  open: boolean
  transitionStatus: TransitionStatus
}

export type ComboboxItemIndicatorState = {
  selected: boolean
  transitionStatus: TransitionStatus
}

export type ComboboxChipState = { disabled: boolean }

export type ComboboxChipRemoveState = { disabled: boolean }

export type ComboboxListState = { empty: boolean }

export type ComboboxPopupState = {
  open: boolean
  side: Side
  align: Align
  anchorHidden: boolean
  transitionStatus: TransitionStatus
  empty: boolean
}

export type ComboboxPositionerState = {
  open: boolean
  side: Side
  align: Align
  anchorHidden: boolean
  empty: boolean
}

export type ComboboxGroupContextValue = { labelId: Ref<string | undefined> }

export type ComboboxGroupItemsContextValue = { items: ComputedRef<readonly unknown[]> }

export type ComboboxChipContextValue = { index: ComputedRef<number> }

export type ComboboxChipsContextValue = {
  highlightedIndex: Ref<number | undefined>
  elements: Readonly<ShallowRef<HTMLElement[]>>
  registerChip: (element: HTMLElement) => () => void
}

export const ComboboxContext = createContext<ComboboxRoot>('Combobox.Root')

export const ComboboxPositionerContext = createContext<AnchorPositioning>('Combobox.Positioner')

export const ComboboxItemContext = createContext<ComboboxItemContextValue>('Combobox.Item')

export const ComboboxGroupContext = createContext<ComboboxGroupContextValue>('Combobox.Group')

export const ComboboxGroupItemsContext =
  createContext<ComboboxGroupItemsContextValue>('Combobox.Group')

export const ComboboxChipContext = createContext<ComboboxChipContextValue>('Combobox.Chip')

export const ComboboxChipsContext = createContext<ComboboxChipsContextValue>('Combobox.Chips')

export const ComboboxRowContext = createContext<boolean>('Combobox.Row', false)
