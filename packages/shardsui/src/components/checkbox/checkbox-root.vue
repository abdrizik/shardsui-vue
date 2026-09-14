<script setup lang="ts">
import {
  computed,
  mergeProps,
  onWatcherCleanup,
  useId,
  useTemplateRef,
  watch,
  watchEffect,
  watchPostEffect
} from 'vue'
import { CheckboxGroupContext } from '@/components/checkbox-group/context'
import { FieldContext, FieldItemContext } from '@/components/field/context'
import { getFieldAriaInvalid, getFieldState, getFieldStateAttrs } from '@/components/field/field'
import { FormContext } from '@/components/form/context'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { dispatchClickWithModifiers } from '@/internal/dispatch-click-with-modifiers'
import { makeEventPreventable } from '@/internal/event-preventable'
import { useFallbackAriaLabelledBy } from '@/internal/fallback-aria-labelled-by'
import { mergeDescribedBy } from '@/internal/labelable'
import { LabelableContext } from '@/internal/labelable-context'
import { visuallyHidden, visuallyHiddenInput } from '@/internal/visually-hidden'
import { CheckboxContext, type CheckboxState } from './context'

type Props = {
  as?: 'span' | 'button'
  id?: string
  disabled?: boolean
  indeterminate?: boolean
  readOnly?: boolean
  required?: boolean
  name?: string
  form?: string
  value?: string
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
  id,
  disabled: disabledProp = false,
  indeterminate = false,
  readOnly = false,
  required = false,
  name: nameProp,
  form,
  value: valueProp,
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

const checkedProp = defineModel<boolean>('checked', { default: false })

const emit = defineEmits<{ (event: 'update:checked', checked: boolean): void }>()

defineSlots<{ default?: (state: CheckboxState) => any }>()

const uid = useId()

const group = CheckboxGroupContext.getOr()
const field = FieldContext.getOr()
const fieldItem = FieldItemContext.getOr()
const labelable = LabelableContext.get()
const formRoot = FormContext.getOr()

const element = useTemplateRef<HTMLElement>('element')
const inputElement = useTemplateRef<HTMLInputElement>('input')

const name = computed(() => field?.name.value ?? nameProp)
const value = computed(() => valueProp ?? name.value)
const disabled = computed(
  () => field?.disabled.value || fieldItem?.disabled.value || group?.disabled.value || disabledProp
)

// Always set: Chrome warns about a form field with no `id` or `name`.
const rootId = computed(() => (as === 'button' ? id || uid : uid))
const inputId = computed(() => (as === 'button' ? undefined : id || `${uid}-input`))

const checked = computed(() =>
  group && value.value !== undefined ? group.value.value.includes(value.value) : checkedProp.value
)

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

const checkboxState = computed<CheckboxState>(() => ({
  ...getFieldState(field),
  checked: checked.value,
  disabled: disabled.value,
  readOnly,
  required,
  indeterminate
}))

const stateAttrs = computed(() =>
  dataAttrs({
    checked: !indeterminate && checked.value,
    unchecked: !indeterminate && !checked.value,
    indeterminate,
    disabled: disabled.value,
    readonly: readOnly,
    required,
    ...getFieldStateAttrs(field)
  })
)

CheckboxContext.set({ state: checkboxState, stateAttrs })

watchPostEffect(() => {
  if (checked.value && field) field.filled.value = true
})

watchPostEffect(() => {
  const rootElement = element.value
  if (!rootElement || group || !field || disabled.value) return
  onWatcherCleanup(
    field.registerControl({
      id: rootId.value,
      element: () => inputElement.value ?? rootElement,
      value: () => checked.value,
      name: () => nameProp
    })
  )
})

watch(
  checkedProp,
  (current) => {
    if (group) return

    formRoot?.clearErrors(name.value)
    if (!field) return
    field.setDirty(current !== field.validityData.value.initialValue)
    field.filled.value = current
    field.commitValue(current)
  },
  { flush: 'post' }
)

watchEffect(() => {
  onWatcherCleanup(labelable.registerControlId(inputId.value ?? rootId.value))
})

watchPostEffect(() => {
  const node = inputElement.value
  if (!node || !field) return
  onWatcherCleanup(
    field.registerInput(node, {
      control: () => element.value,
      value: group ? value.value : undefined
    })
  )
})

function forwardClickToInput(event: MouseEvent) {
  if (readOnly) return
  event.preventDefault()
  if (inputElement.value) dispatchClickWithModifiers(inputElement.value, event)
}

function getDefaultFormSubmitter(formElement: HTMLFormElement | null) {
  if (!formElement) return null

  for (const candidate of formElement.elements) {
    if (!(candidate instanceof HTMLButtonElement) && !(candidate instanceof HTMLInputElement))
      continue
    if (candidate.type === 'submit') return candidate
  }

  return null
}

function submitFormOnEnter(event: KeyboardEvent) {
  if (event.key !== 'Enter') return

  makeEventPreventable(event).preventShardsUIHandler()

  if (event.defaultPrevented) return

  const inputForm = inputElement.value?.form ?? null
  const preventDefault = event.preventDefault.bind(event)
  let preventedDuringPropagation = false

  event.preventDefault = () => {
    preventedDuringPropagation = true
    preventDefault()
  }

  preventDefault()

  const win = element.value?.ownerDocument.defaultView ?? window
  win.queueMicrotask(() => {
    Reflect.deleteProperty(event, 'preventDefault')
    if (!preventedDuringPropagation) getDefaultFormSubmitter(inputForm)?.click()
  })
}

function onChange() {
  const node = inputElement.value
  if (!node) return

  if (readOnly) {
    node.checked = checked.value
    return
  }

  const next = node.checked

  if (group && value.value !== undefined) {
    emit('update:checked', next)
    group.toggleChild(value.value, next)
  } else {
    checkedProp.value = next
  }

  if (checked.value !== next) node.checked = checked.value
}

function focusRoot() {
  element.value?.focus()
}

function markFieldFocused() {
  if (!disabled.value && field) field.focused.value = true
}

function commitFieldOnBlur() {
  field?.commitOnBlur(group ? group.value.value : checked.value)
}

const button = useButton({
  disabled,
  as: () => as,
  onClick: () => chain(onClick, forwardClickToInput),
  onMousedown: () => onMousedown,
  onKeydown: () => chain(onKeydown, submitFormOnEnter),
  onKeyup: () => onKeyup,
  onPointerdown: () => onPointerdown
})

const ownAttrs = computed(() => ({
  id: rootId.value,
  role: 'checkbox',
  'aria-checked': indeterminate ? 'mixed' : checked.value,
  'aria-labelledby': ariaLabelledBy.value,
  'aria-readonly': readOnly || undefined,
  'aria-required': required || undefined,
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
    <slot v-bind="checkboxState" />
  </component>

  <input
    ref="input"
    type="checkbox"
    :id="inputId"
    :checked="checked"
    :indeterminate="indeterminate"
    :disabled="disabled"
    :form="form"
    :name="name"
    :required="required"
    :value.attr="valueProp"
    tabindex="-1"
    aria-hidden="true"
    :style="name ? visuallyHiddenInput : visuallyHidden"
    @change="onChange"
    @click.stop
    @focus="focusRoot"
  />
</template>
