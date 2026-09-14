<script setup lang="ts" generic="Value = unknown">
import { computed, mergeProps, useId, useTemplateRef } from 'vue'
import { FieldContext } from '@/components/field/context'
import { getFieldAriaInvalid, getFieldState, getFieldStateAttrs } from '@/components/field/field'
import { FieldsetContext } from '@/components/fieldset/context'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { mergeDescribedBy } from '@/internal/labelable'
import { LabelableContext } from '@/internal/labelable-context'
import type { PartProps } from '@/internal/types'
import { RadioGroupContext, type RadioGroupState } from './context'
import { useRadioGroupRoot } from './radio-group'

type Props = PartProps & {
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  name?: string
  form?: string
  ariaDescribedby?: string
  onKeydownCapture?: (event: KeyboardEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onFocusin?: (event: FocusEvent) => void
  onFocusout?: (event: FocusEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  disabled = false,
  readOnly = false,
  required = false,
  name,
  form,
  ariaDescribedby,
  onKeydownCapture,
  onKeydown,
  onFocusin,
  onFocusout
} = defineProps<Props>()

const value = defineModel<Value>('value')

defineSlots<{ default?: (state: RadioGroupState) => any }>()

const uid = useId()

const field = FieldContext.getOr()
const fieldset = FieldsetContext.getOr()
const labelable = LabelableContext.get()

const element = useTemplateRef<HTMLElement>('element')

const radioGroup = useRadioGroupRoot<Value>({
  uid,
  value,
  setValue: (next) => {
    value.value = next
  },
  disabled: () => disabled,
  readOnly: () => readOnly,
  required: () => required,
  name: () => name,
  form: () => form,
  ref: element
})

RadioGroupContext.set(radioGroup)

const ariaLabelledBy = computed(() => labelable.labelId.value ?? fieldset?.labelId.value)
const ariaDescribedBy = computed(() =>
  mergeDescribedBy(ariaDescribedby, labelable.messageIds.value)
)
const ariaInvalid = computed(() => getFieldAriaInvalid(field, radioGroup.disabled.value))

const radioGroupState = computed<RadioGroupState>(() => ({
  ...getFieldState(field),
  disabled: radioGroup.disabled.value,
  readOnly: radioGroup.readOnly.value,
  required: radioGroup.required.value
}))

const stateAttrs = computed(() =>
  dataAttrs({
    disabled: radioGroup.disabled.value,
    readonly: radioGroup.readOnly.value,
    required: radioGroup.required.value,
    ...getFieldStateAttrs(field)
  })
)

const ownAttrs = computed(() => ({
  role: 'radiogroup',
  'aria-required': radioGroup.required.value || undefined,
  'aria-disabled': radioGroup.disabled.value || undefined,
  'aria-readonly': radioGroup.readOnly.value || undefined,
  'aria-labelledby': ariaLabelledBy.value,
  'aria-describedby': ariaDescribedBy.value,
  'aria-invalid': ariaInvalid.value,
  onKeydownCapture: chain(onKeydownCapture, radioGroup.onKeydownCapture),
  onKeydown: chain(onKeydown, radioGroup.composite.onKeydown),
  onFocusin: chain(onFocusin, radioGroup.onFocusin),
  onFocusout: chain(onFocusout, radioGroup.onFocusout)
}))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)">
    <slot v-bind="radioGroupState" />
  </component>
</template>
