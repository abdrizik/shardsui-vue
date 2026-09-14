<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const {
  onValueChange,
  onInputValueChange,
  onOpenChange,
  disabled = false,
  inputDisabled = false,
  readOnly = false,
  required = false,
  multiple = false,
  withTrigger = false,
  withDisabledItem = false,
  name = undefined,
  loopFocus = true,
  as = 'input',
  inputStyle = undefined,
  side = undefined,
  onInputCompositionStart,
  onTriggerPointerDown
} = defineProps<{
  onValueChange?: (value: unknown) => void
  onInputValueChange?: (value: string) => void
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  inputDisabled?: boolean
  readOnly?: boolean
  required?: boolean
  multiple?: boolean
  withTrigger?: boolean
  withDisabledItem?: boolean
  name?: string
  loopFocus?: boolean
  as?: 'input' | 'textarea'
  inputStyle?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  onInputCompositionStart?: (event: CompositionEvent) => void
  onTriggerPointerDown?: (event: PointerEvent) => void
}>()

const value = defineModel<unknown>('value')
const inputValue = defineModel<string | undefined>('inputValue')
const open = defineModel<boolean>('open')
</script>

<template>
  <Combobox.Root
    v-model:value="value"
    v-model:input-value="inputValue"
    v-model:open="open"
    @update:value="onValueChange"
    @update:input-value="onInputValueChange"
    @update:open="onOpenChange"
    :disabled="disabled"
    :read-only="readOnly"
    :required="required"
    :multiple="multiple"
    :name="name"
    :loop-focus="loopFocus"
  >
    <Combobox.Input
      :as="as"
      :disabled="inputDisabled"
      data-testid="input"
      placeholder="Search..."
      :style="inputStyle"
      :on-compositionstart="onInputCompositionStart"
    />
    <Combobox.Trigger
      v-if="withTrigger"
      data-testid="trigger"
      :on-pointerdown="onTriggerPointerDown"
    >
      Open
    </Combobox.Trigger>
    <Combobox.Portal>
      <Combobox.Positioner :side="side">
        <Combobox.Popup data-testid="popup">
          <Combobox.List data-testid="list">
            <Combobox.Item value="apple">Apple</Combobox.Item>
            <Combobox.Item value="banana">Banana</Combobox.Item>
            <Combobox.Item value="cherry" :disabled="withDisabledItem">Cherry</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
