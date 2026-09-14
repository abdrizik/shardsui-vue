<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { FieldsetContext } from '@/components/fieldset/context'
import { FormContext } from '@/components/form/context'
import type { FormValidationMode } from '@/components/form/form'
import { createLabelable } from '@/internal/labelable'
import { LabelableContext } from '@/internal/labelable-context'
import type { PartProps } from '@/internal/types'
import { FieldContext, type FieldRootState } from './context'
import { getFieldState, useFieldRoot, type FieldValidator } from './field'

type Props = PartProps & {
  name?: string
  validate?: FieldValidator
  validationMode?: FormValidationMode
  validationDebounceTime?: number
  disabled?: boolean
  invalid?: boolean
  dirty?: boolean
  touched?: boolean
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  name,
  validate = () => null,
  validationMode,
  validationDebounceTime = 0,
  disabled = false,
  invalid = undefined,
  dirty = undefined,
  touched = undefined
} = defineProps<Props>()

defineSlots<{ default?: (state: FieldRootState) => any }>()

const formRoot = FormContext.getOr()
const fieldset = FieldsetContext.getOr()

const field = useFieldRoot({
  name: () => name,
  validate: (value, formValues) => validate(value, formValues),
  validationMode: () => validationMode,
  validationDebounceTime: () => validationDebounceTime,
  disabled: () => disabled,
  invalid: () => invalid,
  dirty: () => dirty,
  touched: () => touched,
  fieldset,
  form: formRoot
})

FieldContext.set(field)
LabelableContext.set(createLabelable())

const fieldState = computed<FieldRootState>(() => ({
  ...getFieldState(field),
  disabled: field.disabled.value
}))
</script>

<template>
  <component :is="as" v-bind="mergeProps(field.stateAttrs.value, $attrs)">
    <slot v-bind="fieldState" />
  </component>
</template>
