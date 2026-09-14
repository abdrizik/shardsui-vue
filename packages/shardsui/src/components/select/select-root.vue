<script setup lang="ts" generic="Value = unknown, Multiple extends boolean | undefined = false">
import { computed, useId, useTemplateRef, watchPostEffect } from 'vue'
import { defaultItemEquality, type ItemEqualityComparer } from '@/internal/item-equality'
import type { Group } from '@/internal/resolve-value-label'
import { visuallyHidden, visuallyHiddenInput } from '@/internal/visually-hidden'
import { SelectContext, type SelectValueType } from './context'
import { useSelectRoot } from './select'

type Props = {
  id?: string
  name?: string
  form?: string
  autoComplete?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  modal?: boolean
  isItemEqualToValue?: ItemEqualityComparer<Value>
  items?:
    | ReadonlyArray<{ label: unknown; value: unknown }>
    | readonly Group<unknown>[]
    | Record<string, unknown>
  itemToStringLabel?: (item: Value) => string
  itemToStringValue?: (item: Value) => string
  multiple?: Multiple
  highlightItemOnHover?: boolean
}

defineOptions({ inheritAttrs: false })

const uid = useId()

const {
  id: idProp,
  name,
  form,
  autoComplete,
  disabled = false,
  readOnly = false,
  required = false,
  modal = true,
  isItemEqualToValue = defaultItemEquality as ItemEqualityComparer<Value>,
  items,
  itemToStringLabel,
  itemToStringValue,
  multiple = false as Multiple,
  highlightItemOnHover = true
} = defineProps<Props>()

const emit = defineEmits<{ openChangeComplete: [open: boolean] }>()

const emitOpenChangeComplete = (open: boolean): void => emit('openChangeComplete', open)

const value = defineModel<SelectValueType<Value, Multiple> | null | undefined>('value')
const open = defineModel<boolean>('open', { default: false })

defineSlots<{ default?: () => any }>()

const id = computed(() => idProp ?? uid)

const isMultiple = computed(() => ((multiple as unknown) === '' ? true : Boolean(multiple)))

const hiddenInput = useTemplateRef<HTMLInputElement>('hiddenInput')

const select = useSelectRoot({
  id,
  value: () => value.value,
  setValue: (next) => {
    value.value = next as SelectValueType<Value, Multiple> | null
  },
  open,
  setOpen: (next) => {
    open.value = next
  },
  onOpenChangeComplete: () => emitOpenChangeComplete,
  name: () => name,
  disabled: () => disabled,
  readOnly: () => readOnly,
  required: () => required,
  modal: () => modal,
  multiple: isMultiple,
  highlightItemOnHover: () => highlightItemOnHover,
  items: () => items,
  isItemEqualToValue: () => isItemEqualToValue as ItemEqualityComparer,
  itemToStringLabel: () => itemToStringLabel as ((item: unknown) => string) | undefined,
  itemToStringValue: () => itemToStringValue as ((item: unknown) => string) | undefined
})

SelectContext.set(select)

watchPostEffect(() => {
  select.hiddenInputElement.value = hiddenInput.value
})

const hiddenInputValues = computed(() => {
  const occurrences: Record<string, number> = {}
  return select.selectedValues.value.map((selectedValue) => {
    const serialized = select.serialize(selectedValue)
    const occurrence = occurrences[serialized] ?? 0
    occurrences[serialized] = occurrence + 1
    return { value: serialized, key: `${occurrence} ${serialized}` }
  })
})

const hiddenInputRequired = computed(
  () => required && !(isMultiple.value && select.selectedValues.value.length > 0)
)
</script>

<template>
  <slot />

  <input
    ref="hiddenInput"
    :id="
      select.hiddenInputName.value === undefined ? `${select.rootId.value}-hidden-input` : undefined
    "
    :name="select.hiddenInputName.value"
    :form="form"
    :autocomplete="autoComplete"
    :value="select.serializedValue.value"
    :disabled="select.disabled.value"
    :required="hiddenInputRequired"
    :readonly="readOnly"
    :tabindex="-1"
    aria-hidden="true"
    :style="select.resolvedName.value ? visuallyHiddenInput : visuallyHidden"
    @focus="select.onFocus"
    @change="select.onChange"
  />
  <template v-if="isMultiple && select.resolvedName.value">
    <input
      v-for="hiddenInputValue in hiddenInputValues"
      :key="hiddenInputValue.key"
      type="hidden"
      :name="select.resolvedName.value"
      :form="form"
      :value="hiddenInputValue.value"
      :disabled="select.disabled.value"
    />
  </template>
</template>
