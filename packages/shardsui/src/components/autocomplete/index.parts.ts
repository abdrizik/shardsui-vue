import type {
  ComboboxInputGroupState,
  ComboboxItemState,
  ComboboxTriggerState
} from '@/components/combobox/context'
import {
  InputGroup as ComboboxInputGroup,
  Item as ComboboxItem,
  Trigger as ComboboxTrigger
} from '@/components/combobox/index.parts'

type ComponentProps<C extends abstract new (...args: any[]) => any> = InstanceType<C>['$props']

type NarrowPayload<Props, State> = new (...args: any[]) => {
  $props: Props
  $slots: { default?: (state: State) => any }
}

export {
  Arrow,
  Backdrop,
  Clear,
  Collection,
  Empty,
  Group,
  GroupLabel,
  Icon,
  Input,
  List,
  Popup,
  Portal,
  Positioner,
  Row,
  Separator,
  Status
} from '@/components/combobox/index.parts'
export { createCoreFilter as createFilter } from '@/internal/create-filter'
export { default as Root } from './autocomplete-root.vue'
export { default as Value } from './autocomplete-value.vue'

export const Item = ComboboxItem as NarrowPayload<
  ComponentProps<typeof ComboboxItem>,
  Omit<ComboboxItemState, 'selected'>
>

export const Trigger = ComboboxTrigger as NarrowPayload<
  ComponentProps<typeof ComboboxTrigger>,
  Omit<ComboboxTriggerState, 'placeholder'>
>

export const InputGroup = ComboboxInputGroup as NarrowPayload<
  ComponentProps<typeof ComboboxInputGroup>,
  Omit<ComboboxInputGroupState, 'placeholder'>
>
