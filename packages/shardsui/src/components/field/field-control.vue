<script setup lang="ts">
import {
  computed,
  mergeProps,
  onWatcherCleanup,
  useId,
  useTemplateRef,
  watchEffect,
  watchPostEffect
} from 'vue'
import { FormContext } from '@/components/form/context'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { mergeDescribedBy } from '@/internal/labelable'
import { LabelableContext } from '@/internal/labelable-context'
import { FieldContext } from './context'
import { getFieldAriaInvalid, getFieldStateAttrs } from './field'

type Control = HTMLInputElement | HTMLTextAreaElement

type Props = {
  as?: 'input' | 'textarea'
  id?: string
  name?: string
  disabled?: boolean
  autofocus?: boolean
  ariaDescribedby?: string
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
  onInput?: (event: Event) => void
  onKeydown?: (event: KeyboardEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'input',
  id: idProp,
  name: nameProp,
  disabled: disabledProp = false,
  autofocus = false,
  ariaDescribedby,
  onFocus,
  onBlur,
  onInput,
  onKeydown
} = defineProps<Props>()

const value = defineModel<string | number | readonly string[]>('value')

const uid = useId()
const id = computed(() => idProp ?? uid)

const field = FieldContext.getOr()
const formRoot = FormContext.getOr()
const labelable = LabelableContext.get()

const element = useTemplateRef<Control>('element')

const disabled = computed(() => field?.disabled.value || disabledProp)
const name = computed(() => field?.name.value ?? nameProp ?? undefined)

const describedBy = computed(() => mergeDescribedBy(ariaDescribedby, labelable.messageIds.value))

watchEffect(() => {
  onWatcherCleanup(labelable.registerControlId(id.value))
})

watchPostEffect(() => {
  const node = element.value
  const next = value.value
  if (!node || next === undefined) return
  const text = next === null ? '' : String(next)
  if (node.value !== text) node.value = text
})

watchPostEffect(() => {
  if (disabled.value || !field) return
  onWatcherCleanup(
    field.registerControl({
      id: id.value,
      element: () => element.value,
      value: () => element.value?.value ?? '',
      name: () => nameProp ?? undefined
    })
  )
})

watchPostEffect(() => {
  const node = element.value
  if (!field || !node) return
  if (value.value != null) field.filled.value = value.value !== ''
  else if (node.value) field.filled.value = true
})

watchPostEffect(() => {
  const node = element.value
  if (autofocus && field && node && node.ownerDocument.activeElement === node) {
    field.focused.value = true
  }
})

function markFieldFocused() {
  if (field) field.focused.value = true
}

function commitFieldOnBlur() {
  if (!element.value) return
  field?.commitOnBlur(element.value.value)
}

function commitFieldValue(event: Event) {
  if (!element.value) return
  const next = element.value.value
  value.value = next
  if (!field) return
  field.setDirty(next !== (field.validityData.value.initialValue ?? ''))
  field.filled.value = next !== ''

  if (event.defaultPrevented) return
  formRoot?.clearErrors(name.value)
  field.commitValue(next)
}

function commitFieldOnEnter(event: KeyboardEvent) {
  if (!field || !element.value || as !== 'input' || event.key !== 'Enter') return
  field.setTouched(true)
  field.commit(element.value.value)
}

const stateAttrs = computed(() =>
  dataAttrs({ disabled: disabled.value, ...getFieldStateAttrs(field) })
)

const ownAttrs = computed(() => ({
  id: id.value,
  name: name.value,
  disabled: disabled.value,
  autofocus,
  'aria-labelledby': labelable.labelId.value,
  'aria-describedby': describedBy.value,
  'aria-invalid': getFieldAriaInvalid(field, disabled.value),
  onFocus: chain(onFocus, markFieldFocused),
  onBlur: chain(onBlur, commitFieldOnBlur),
  onInput: chain(onInput, commitFieldValue),
  onKeydown: chain(onKeydown, commitFieldOnEnter)
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :value.attr="value"
  />
</template>
