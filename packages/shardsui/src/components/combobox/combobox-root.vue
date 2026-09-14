<script setup lang="ts" generic="Value = unknown, Multiple extends boolean | undefined = false">
import { computed } from 'vue'
import ComboboxShell from './combobox-shell.vue'
import type { ComboboxValueType } from './context'
import type { HighlightReason } from './item-registry'
import type { ComboboxShellProps } from './shell-props'

type Props = Omit<
  ComboboxShellProps<Value, Multiple>,
  'selectionMode' | 'formAutoComplete' | 'autoComplete' | 'autoHighlight'
> & {
  autoComplete?: string | undefined
  autoHighlight?: boolean | undefined
  inputValue?: string
}

defineOptions({ inheritAttrs: false })

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
  isItemEqualToValue,
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
  submitOnItemClick = false,
  autoComplete = undefined,
  multiple = false as Multiple,
  inputValue = undefined
} = defineProps<Props>()

const emit = defineEmits<{
  'update:inputValue': [value: string]
  openChangeComplete: [open: boolean]
  itemHighlighted: [highlightedValue: Value | undefined, reason: HighlightReason, index: number]
}>()

const emitItemHighlighted = (
  highlightedValue: Value | undefined,
  reason: HighlightReason,
  index: number
): void => emit('itemHighlighted', highlightedValue, reason, index)

const value = defineModel<ComboboxValueType<Value, Multiple> | null>('value')
const open = defineModel<boolean>('open', { default: false })

defineSlots<{ default?: () => any }>()

const ownerSuppliesInputValue = inputValue !== undefined
const inputValueProps = computed(() => (ownerSuppliesInputValue ? { inputValue } : {}))
</script>

<template>
  <ComboboxShell
    v-model:value="value"
    v-bind="inputValueProps"
    @update:input-value="(next: string | undefined) => emit('update:inputValue', next ?? '')"
    v-model:open="open"
    :id="id"
    :name="name"
    :form="form"
    :disabled="disabled"
    :read-only="readOnly"
    :required="required"
    :modal="modal"
    :loop-focus="loopFocus"
    :grid="grid"
    :is-item-equal-to-value="isItemEqualToValue"
    :open-on-input-click="openOnInputClick"
    :auto-highlight="autoHighlight"
    :highlight-item-on-hover="highlightItemOnHover"
    :keep-highlight="keepHighlight"
    :item-to-string-value="itemToStringValue"
    :item-to-string-label="itemToStringLabel"
    :items="items"
    :filtered-items="filteredItems"
    :filter="filter"
    :limit="limit"
    :locale="locale"
    :inline="inline"
    :virtualized="virtualized"
    :submit-on-item-click="submitOnItemClick"
    :form-auto-complete="autoComplete"
    :multiple="multiple"
    @item-highlighted="emitItemHighlighted"
    @open-change-complete="emit('openChangeComplete', $event)"
  >
    <slot />
  </ComboboxShell>
</template>
