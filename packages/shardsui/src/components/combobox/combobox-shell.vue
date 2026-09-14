<script setup lang="ts" generic="Value = unknown, Multiple extends boolean | undefined = false">
import { computed, useId, useTemplateRef, watch } from 'vue'
import { defaultItemEquality, type ItemEqualityComparer } from '@/internal/item-equality'
import { visuallyHidden, visuallyHiddenInput } from '@/internal/visually-hidden'
import { useComboboxRoot } from './combobox'
import type { HighlightReason } from './item-registry'
import type { ComboboxShellProps } from './shell-props'
import { ComboboxContext, type ComboboxValueType } from './context'

const {
  id,
  name,
  form,
  disabled = false,
  readOnly = false,
  required = false,
  modal = false,
  loopFocus = true,
  grid = false,
  isItemEqualToValue = defaultItemEquality as ItemEqualityComparer<Value>,
  multiple = false as Multiple,
  selectionMode = undefined,
  openOnInputClick = true,
  autoHighlight = false,
  highlightItemOnHover = true,
  keepHighlight = false,
  itemToStringValue,
  itemToStringLabel,
  items = undefined,
  filteredItems = undefined,
  filter = undefined,
  limit = -1,
  locale = undefined,
  inline = false,
  virtualized = false,
  autoComplete = 'list',
  formAutoComplete = undefined,
  submitOnItemClick = false
} = defineProps<ComboboxShellProps<Value, Multiple>>()

const emit = defineEmits<{
  openChangeComplete: [open: boolean]
  itemHighlighted: [highlightedValue: Value | undefined, reason: HighlightReason, index: number]
}>()

const emitOpenChangeComplete = (open: boolean): void => emit('openChangeComplete', open)

const emitItemHighlighted = (
  highlightedValue: unknown,
  reason: HighlightReason,
  index: number
): void => emit('itemHighlighted', highlightedValue as Value | undefined, reason, index)

const value = defineModel<ComboboxValueType<Value, Multiple> | null>('value')
const inputValue = defineModel<string>('inputValue')
const open = defineModel<boolean>('open', { default: false })

defineOptions({ inheritAttrs: false })

defineSlots<{ default?: () => any }>()

const resolvedSelectionMode = computed(
  () => selectionMode ?? ((multiple as unknown) === '' || Boolean(multiple) ? 'multiple' : 'single')
)

const defaultValue = (resolvedSelectionMode.value === 'multiple' ? [] : null) as ComboboxValueType<
  Value,
  Multiple
> | null

const resolvedValue = computed(() => (value.value === undefined ? defaultValue : value.value))

const uid = useId()

const combobox = useComboboxRoot({
  id: () => id ?? uid,
  value: () => resolvedValue.value,
  setValue: (next) => {
    value.value = next as ComboboxValueType<Value, Multiple> | null
  },
  inputValue,
  setInputValue: (next) => {
    inputValue.value = next
  },
  open,
  setOpen: (next) => {
    open.value = next
  },
  onOpenChangeComplete: () => emitOpenChangeComplete,
  name: () => name,
  form: () => form,
  disabled: () => disabled,
  readOnly: () => readOnly,
  required: () => required,
  modal: () => modal,
  loopFocus: () => loopFocus,
  grid: () => grid,
  isItemEqualToValue: () => isItemEqualToValue as ItemEqualityComparer,
  selectionMode: () => resolvedSelectionMode.value,
  openOnInputClick: () => openOnInputClick,
  autoHighlight: () => autoHighlight,
  highlightItemOnHover: () => highlightItemOnHover,
  keepHighlight: () => keepHighlight,
  onItemHighlighted: () => emitItemHighlighted,
  itemToStringValue: () => itemToStringValue as ((item: unknown) => string) | undefined,
  itemToStringLabel: () => itemToStringLabel as ((item: unknown) => string) | undefined,
  items: () => items,
  filteredItems: () => filteredItems,
  filter: () =>
    filter as
      | null
      | ((item: unknown, query: string, itemToString?: (item: unknown) => string) => boolean)
      | undefined,
  limit: () => limit,
  locale: () => locale,
  inline: () => inline,
  virtualized: () => virtualized,
  autoComplete: () => autoComplete,
  submitOnItemClick: () => submitOnItemClick
})

ComboboxContext.set(combobox)

const element = useTemplateRef<HTMLInputElement>('element')

watch(
  () => element.value,
  (node) => {
    combobox.hiddenInputElement.value = node ?? null
  },
  { immediate: true, flush: 'sync' }
)

const hiddenInputName = computed(() =>
  combobox.multiple.value || combobox.inputOwnsFormValue.value ? undefined : combobox.name.value
)
const hiddenInputRequired = computed(
  () => required && !(combobox.multiple.value && combobox.hasSelectedValue.value)
)

const hiddenInputValues = computed(() => {
  const occurrences: Record<string, number> = {}
  return combobox.selectedValues.value.map((selectedValue) => {
    const serialized = combobox.serialize(selectedValue)
    const occurrence = occurrences[serialized] ?? 0
    occurrences[serialized] = occurrence + 1
    return { value: serialized, key: `${occurrence} ${serialized}` }
  })
})

function onFocus() {
  if (combobox.inputInsidePopup.value) {
    combobox.triggerElement.value?.focus()
    return
  }
  ;(combobox.inputElement.value ?? combobox.triggerElement.value)?.focus()
}
</script>

<template>
  <slot />

  <template v-if="combobox.name.value && combobox.multiple.value">
    <input
      v-for="hiddenInputValue in hiddenInputValues"
      :key="hiddenInputValue.key"
      type="hidden"
      :name="combobox.name.value"
      :form="form"
      :value="hiddenInputValue.value"
      :disabled="combobox.disabled.value"
    />
  </template>
  <input
    ref="element"
    :id="hiddenInputName === undefined ? `${combobox.rootId.value}-hidden-input` : undefined"
    :form="form"
    :name="hiddenInputName"
    :value="combobox.serializedValue.value"
    :disabled="combobox.disabled.value"
    :required="hiddenInputRequired"
    :readonly="readOnly"
    :autocomplete="formAutoComplete"
    :tabindex="-1"
    aria-hidden="true"
    :style="hiddenInputName ? visuallyHiddenInput : visuallyHidden"
    @focus="onFocus"
    @input="combobox.commitAutofilledValue"
    @change="combobox.commitAutofilledValue"
  />
</template>
