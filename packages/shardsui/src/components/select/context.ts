import type { ComputedRef, Ref } from 'vue'
import type { FieldState } from '@/components/field/field'
import { createContext } from '@/internal/context'
import type { Align, AnchorPositioning, Side } from '@/internal/floating/anchor-positioning'
import type { TransitionStatus } from '@/internal/transition-status'
import type { SelectRoot } from './select'

export type SelectTriggerState = FieldState & {
  open: boolean
  disabled: boolean
  readOnly: boolean
  popupSide: Side | null
  value: unknown
  placeholder: boolean
}

export type SelectIconState = {
  open: boolean
}

export type SelectPopupState = {
  open: boolean
  transitionStatus: TransitionStatus
  side: Side
  align: Align
}

export type SelectItemState = {
  selected: boolean
  highlighted: boolean
  disabled: boolean
}

export type SelectItemIndicatorState = {
  selected: boolean
  transitionStatus: TransitionStatus
}

export type SelectScrollArrowState = {
  direction: 'up' | 'down'
  visible: boolean
  side: Side
  transitionStatus: TransitionStatus
}

export type SelectPositionerState = {
  open: boolean
  side: Side
  align: Align
  anchorHidden: boolean
}

export type SelectValueType<Value, Multiple extends boolean | undefined> = Multiple extends true
  ? Value[]
  : Value

export type SelectItem = {
  element: HTMLElement
  value: unknown
}

export type SelectItemContextValue = {
  selected: ComputedRef<boolean>
}

export type SelectGroupContextValue = {
  labelId: Ref<string | undefined>
}

export const SelectContext = createContext<SelectRoot>('Select.Root')

export const SelectPositionerContext = createContext<AnchorPositioning>('Select.Positioner')

export const SelectItemContext = createContext<SelectItemContextValue>('Select.Item')

export const SelectGroupContext = createContext<SelectGroupContextValue>('Select.Group')
