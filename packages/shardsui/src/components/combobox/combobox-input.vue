<script setup lang="ts">
import { computed, mergeProps, useId, useTemplateRef } from 'vue'
import { FieldContext } from '@/components/field/context'
import { getFieldStateAttrs } from '@/components/field/field'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { mergeDescribedBy } from '@/internal/labelable'
import { LabelableContext } from '@/internal/labelable-context'
import ComboboxInternalDismissButton from './combobox-internal-dismiss-button.vue'
import { ComboboxContext, ComboboxPositionerContext } from './context'
import { useComboboxInput } from './input'

type Props = {
  as?: 'input' | 'textarea'
  id?: string
  placeholder?: string
  disabled?: boolean
  autocomplete?: string
  ariaDescribedby?: string
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onInput?: (event: Event) => void
  onClick?: (event: MouseEvent) => void
  onPointerdown?: (event: PointerEvent) => void
  onCompositionstart?: (event: CompositionEvent) => void
  onCompositionend?: (event: CompositionEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'input',
  id: idProp,
  placeholder,
  disabled = false,
  autocomplete = 'off',
  ariaDescribedby: ariaDescribedByProp,
  onFocus,
  onBlur,
  onKeydown,
  onInput,
  onClick,
  onPointerdown,
  onCompositionstart,
  onCompositionend
} = defineProps<Props>()

const combobox = ComboboxContext.get()
const field = FieldContext.getOr()
const labelable = LabelableContext.get()
const positioner = ComboboxPositionerContext.getOr()
const uid = useId()
const hasPositionerParent = positioner != null

const element = useTemplateRef<HTMLElement>('element')

const input = useComboboxInput(combobox, {
  ref: element,
  id: () => idProp,
  uid,
  disabled: () => disabled
})

const ariaDescribedBy = computed(() =>
  hasPositionerParent
    ? ariaDescribedByProp
    : mergeDescribedBy(ariaDescribedByProp, labelable.messageIds.value)
)

const isExpanded = computed(() => combobox.open.value || combobox.inline.value)
const shouldApplyAria = computed(() => as === 'input' || isExpanded.value)

const stateAttrs = computed(() =>
  dataAttrs({
    'popup-open': combobox.open.value,
    pressed: combobox.open.value,
    disabled: input.disabled.value,
    readonly: combobox.readOnly.value,
    'popup-side': combobox.popupSide.value ?? undefined,
    'list-empty': combobox.isEmpty.value,
    ...(hasPositionerParent ? {} : getFieldStateAttrs(field))
  })
)

const ownAttrs = computed(() => ({
  id: input.id.value,
  disabled: input.disabled.value,
  readonly: combobox.readOnly.value,
  required: combobox.noSelection.value ? combobox.required.value : undefined,
  name: combobox.name.value && combobox.inputOwnsFormValue.value ? combobox.name.value : undefined,
  form: combobox.form.value || undefined,
  placeholder,
  autocomplete,
  spellcheck: as === 'input' ? false : undefined,
  autocorrect: as === 'input' ? 'off' : undefined,
  autocapitalize: as === 'input' ? 'none' : undefined,
  role: shouldApplyAria.value ? 'combobox' : undefined,
  'aria-haspopup': shouldApplyAria.value ? (combobox.grid.value ? 'grid' : 'listbox') : undefined,
  'aria-expanded': shouldApplyAria.value ? isExpanded.value : undefined,
  'aria-controls': isExpanded.value ? combobox.listId.value : undefined,
  'aria-activedescendant': input.highlightedItemId.value,
  'aria-autocomplete': shouldApplyAria.value ? combobox.autoComplete.value : undefined,
  'aria-labelledby': labelable.labelId.value,
  'aria-describedby': ariaDescribedBy.value,
  'aria-invalid':
    !hasPositionerParent && field?.valid.value === false && !input.disabled.value
      ? true
      : undefined,
  'aria-required': combobox.required.value || undefined,
  'aria-readonly': combobox.readOnly.value || undefined,
  onFocus: chain(onFocus, input.onFocus),
  onBlur: chain(onBlur, input.onBlur),
  onInput: chain(onInput, input.onInput),
  onKeydown: chain(onKeydown, input.onKeydown),
  onClick: chain(onClick, input.onClick),
  onPointerdown: chain(onPointerdown, combobox.openInteractionHandlers.onPointerdown),
  onCompositionstart: chain(onCompositionstart, input.onCompositionstart),
  onCompositionend: chain(onCompositionend, input.onCompositionend)
}))
</script>

<template>
  <ComboboxInternalDismissButton
    v-if="combobox.open.value && combobox.focusManagerModal.value"
    :element="combobox.startDismissElement"
  />
  <component :is="as" ref="element" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)" />
</template>
