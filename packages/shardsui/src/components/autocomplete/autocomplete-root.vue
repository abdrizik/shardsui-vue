<script setup lang="ts" generic="Value = unknown">
import { computed, shallowRef, watch } from 'vue'
import ComboboxShell from '@/components/combobox/combobox-shell.vue'
import type { HighlightReason } from '@/components/combobox/item-registry'
import type { ComboboxShellProps } from '@/components/combobox/shell-props'
import { createCoreFilter } from '@/internal/create-filter'
import { stringifyAsLabel } from '@/internal/resolve-value-label'

type ShellProps = ComboboxShellProps<Value>
type FilterFn = Exclude<ShellProps['filter'], undefined>

type Props = Omit<
  ShellProps,
  | 'multiple'
  | 'selectionMode'
  | 'isItemEqualToValue'
  | 'itemToStringLabel'
  | 'autoComplete'
  | 'formAutoComplete'
> & {
  mode?: 'list' | 'both' | 'inline' | 'none'
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
  openOnInputClick = false,
  autoHighlight = false,
  highlightItemOnHover = true,
  keepHighlight = false,
  itemToStringValue,
  items = undefined,
  filteredItems = undefined,
  filter = undefined,
  limit = -1,
  locale = undefined,
  inline = false,
  virtualized = false,
  submitOnItemClick = false,
  mode = 'list'
} = defineProps<Props>()

const emit = defineEmits<{
  openChangeComplete: [open: boolean]
  itemHighlighted: [highlightedValue: Value | undefined, reason: HighlightReason, index: number]
}>()

const value = defineModel<string>('value', { default: '' })
const open = defineModel<boolean>('open', { default: false })

defineSlots<{ default?: () => any }>()

const inlineInputValue = shallowRef('')

const baseFilter = computed<FilterFn>(() =>
  filter !== undefined ? filter : (createCoreFilter({ locale }).contains as FilterFn)
)

const resolvedFilter = computed((): FilterFn => {
  if (mode === 'inline' || mode === 'none') return null
  if (mode !== 'both' || baseFilter.value === null) return baseFilter.value
  const matches = baseFilter.value
  return (item, _query, itemToString) => matches(item, value.value.trim(), itemToString)
})

const isInlineEnabled = computed(() => mode === 'inline' || mode === 'both')

const resolvedInputValue = computed(() =>
  isInlineEnabled.value && inlineInputValue.value !== '' ? inlineInputValue.value : value.value
)

watch(
  () => value.value,
  () => {
    inlineInputValue.value = ''
  },
  { flush: 'post' }
)

function applyInputValue(nextValue: string | undefined) {
  inlineInputValue.value = ''
  value.value = nextValue ?? ''
}

function syncInlineCompletion(
  highlightedValue: Value | undefined,
  reason: HighlightReason,
  index: number
) {
  emit('itemHighlighted', highlightedValue, reason, index)
  if (reason === 'pointer') return
  inlineInputValue.value =
    isInlineEnabled.value && highlightedValue != null
      ? stringifyAsLabel(highlightedValue, itemToStringValue)
      : ''
}
</script>

<template>
  <ComboboxShell
    v-model:open="open"
    :input-value="resolvedInputValue"
    :id="id"
    :name="name"
    :form="form"
    :disabled="disabled"
    :read-only="readOnly"
    :required="required"
    :modal="modal"
    :loop-focus="loopFocus"
    :grid="grid"
    :open-on-input-click="openOnInputClick"
    :auto-highlight="autoHighlight"
    :highlight-item-on-hover="highlightItemOnHover"
    :keep-highlight="keepHighlight"
    :item-to-string-value="itemToStringValue"
    :items="items"
    :filtered-items="filteredItems"
    :limit="limit"
    :locale="locale"
    :inline="inline"
    :virtualized="virtualized"
    :submit-on-item-click="submitOnItemClick"
    :auto-complete="mode"
    :filter="resolvedFilter"
    :item-to-string-label="itemToStringValue"
    selection-mode="none"
    @item-highlighted="syncInlineCompletion"
    @update:input-value="applyInputValue"
    @open-change-complete="emit('openChangeComplete', $event)"
  >
    <slot />
  </ComboboxShell>
</template>
