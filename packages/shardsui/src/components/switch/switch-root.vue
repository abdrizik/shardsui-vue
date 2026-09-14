<script setup lang="ts">
import {
  computed,
  mergeProps,
  nextTick,
  onWatcherCleanup,
  useId,
  useTemplateRef,
  watch,
  watchEffect,
  watchPostEffect,
  watchSyncEffect
} from 'vue'
import { FieldContext } from '@/components/field/context'
import { getFieldAriaInvalid, getFieldState, getFieldStateAttrs } from '@/components/field/field'
import { FormContext } from '@/components/form/context'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { dispatchClickWithModifiers } from '@/internal/dispatch-click-with-modifiers'
import { useFallbackAriaLabelledBy } from '@/internal/fallback-aria-labelled-by'
import { mergeDescribedBy } from '@/internal/labelable'
import { LabelableContext } from '@/internal/labelable-context'
import { visuallyHidden, visuallyHiddenInput } from '@/internal/visually-hidden'
import { SwitchContext, type SwitchState } from './context'

type Props = {
  as?: 'span' | 'button'
  id?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  name?: string
  value?: string
  form?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  onClick?: (event: MouseEvent) => void
  onMousedown?: (event: MouseEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onKeyup?: (event: KeyboardEvent) => void
  onPointerdown?: (event: PointerEvent) => void
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'span',
  id: idProp,
  disabled: disabledProp = false,
  readOnly = false,
  required = false,
  name: nameProp,
  value,
  form,
  ariaLabelledby,
  ariaDescribedby,
  onClick,
  onMousedown,
  onKeydown,
  onKeyup,
  onPointerdown,
  onFocus,
  onBlur
} = defineProps<Props>()

const checked = defineModel<boolean>('checked', { default: false })

defineSlots<{ default?: (state: SwitchState) => any }>()

const uid = useId()

const field = FieldContext.getOr()
const labelable = LabelableContext.get()
const formRoot = FormContext.getOr()

const element = useTemplateRef<HTMLElement>('element')
const inputElement = useTemplateRef<HTMLInputElement>('input')

const name = computed(() => field?.name.value ?? nameProp)
const disabled = computed(() => field?.disabled.value || disabledProp)

const rootId = computed(() => (as === 'button' ? (idProp ?? uid) : uid))
const inputId = computed(() => (as === 'button' ? undefined : (idProp ?? `${uid}-input`)))

const ariaLabelledBy = useFallbackAriaLabelledBy({
  element: inputElement,
  elementId: inputId,
  ariaLabelledBy: () => ariaLabelledby,
  labelId: labelable.labelId
})

const ariaDescribedBy = computed(() =>
  mergeDescribedBy(ariaDescribedby, labelable.messageIds.value)
)

const ariaInvalid = computed(() => getFieldAriaInvalid(field, disabled.value))

const switchState = computed<SwitchState>(() => ({
  ...getFieldState(field),
  checked: checked.value,
  disabled: disabled.value,
  readOnly,
  required
}))

const stateAttrs = computed(() =>
  dataAttrs({
    checked: checked.value,
    unchecked: !checked.value,
    disabled: disabled.value,
    readonly: readOnly,
    required,
    ...getFieldStateAttrs(field)
  })
)

SwitchContext.set({ state: switchState, stateAttrs })

watchPostEffect(() => {
  if (!field || disabled.value) return
  onWatcherCleanup(
    field.registerControl({
      id: uid,
      element: () => inputElement.value,
      value: () => checked.value,
      name: () => nameProp
    })
  )
})

watchPostEffect(() => {
  if (field) field.filled.value = checked.value
})

watch(
  checked,
  (current) => {
    formRoot?.clearErrors(name.value)
    if (!field) return
    field.setDirty(current !== field.validityData.value.initialValue)
    field.commitValue(current)
  },
  { flush: 'post' }
)

watchEffect(() => {
  onWatcherCleanup(labelable.registerControlId(inputId.value ?? rootId.value))
})

function forwardClickToInput(event: MouseEvent) {
  if (readOnly) return
  event.preventDefault()
  if (inputElement.value) dispatchClickWithModifiers(inputElement.value, event)
}

function onChange() {
  const input = inputElement.value
  if (!input) return

  if (readOnly) {
    input.checked = checked.value
    return
  }

  const next = input.checked
  checked.value = next
  nextTick(() => {
    if (input.checked !== checked.value) input.checked = checked.value
  })
}

function focusRoot() {
  element.value?.focus()
}

function markFieldFocused() {
  if (!disabled.value && field) field.focused.value = true
}

function commitFieldOnBlur() {
  if (!inputElement.value || disabled.value) return
  field?.commitOnBlur(inputElement.value.checked)
}

const button = useButton({
  disabled,
  as: () => as,
  onClick: () => chain(onClick, forwardClickToInput),
  onMousedown: () => onMousedown,
  onKeydown: () => onKeydown,
  onKeyup: () => onKeyup,
  onPointerdown: () => onPointerdown
})

const ownAttrs = computed(() => ({
  id: rootId.value,
  role: 'switch',
  'aria-checked': checked.value,
  'aria-readonly': readOnly || undefined,
  'aria-required': required || undefined,
  'aria-labelledby': ariaLabelledBy.value,
  'aria-describedby': ariaDescribedBy.value,
  'aria-invalid': ariaInvalid.value,
  onFocus: chain(onFocus, markFieldFocused),
  onBlur: chain(onBlur, commitFieldOnBlur)
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(button.attrs.value, stateAttrs, ownAttrs, $attrs)"
  >
    <slot v-bind="switchState" />
  </component>

  <input
    ref="input"
    type="checkbox"
    :id="inputId"
    :checked="checked"
    :disabled="disabled"
    :form="form"
    :name="name"
    :required="required"
    :value="value"
    tabindex="-1"
    aria-hidden="true"
    :style="name ? visuallyHiddenInput : visuallyHidden"
    @change="onChange"
    @click.stop
    @focus="focusRoot"
  />
</template>
