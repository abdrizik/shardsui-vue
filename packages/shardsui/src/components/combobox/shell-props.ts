import type { ItemEqualityComparer } from '@/internal/item-equality'
import type { Group } from '@/internal/resolve-value-label'

export type ComboboxShellProps<Value = unknown, Multiple extends boolean | undefined = false> = {
  id?: string
  name?: string
  form?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  modal?: boolean
  loopFocus?: boolean
  grid?: boolean
  isItemEqualToValue?: ItemEqualityComparer<Value>
  multiple?: Multiple
  selectionMode?: 'single' | 'multiple' | 'none'
  openOnInputClick?: boolean
  autoHighlight?: boolean | 'always'
  highlightItemOnHover?: boolean
  keepHighlight?: boolean
  itemToStringValue?: (item: Value) => string
  itemToStringLabel?: (item: Value) => string
  items?: readonly NoInfer<Value>[] | readonly Group<NoInfer<Value>>[] | undefined
  filteredItems?: readonly NoInfer<Value>[] | readonly Group<NoInfer<Value>>[] | undefined
  filter?:
    | null
    | ((item: Value, query: string, itemToString?: (item: Value) => string) => boolean)
    | undefined
  limit?: number | undefined
  locale?: Intl.LocalesArgument | undefined
  inline?: boolean | undefined
  virtualized?: boolean | undefined
  submitOnItemClick?: boolean | undefined
  autoComplete?: 'list' | 'both' | 'inline' | 'none' | undefined
  formAutoComplete?: string | undefined
}
