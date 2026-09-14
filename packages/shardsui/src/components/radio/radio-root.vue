<script setup lang="ts">
import {
  computed,
  mergeProps,
  nextTick,
  onWatcherCleanup,
  useId,
  useTemplateRef,
  watchEffect,
  watchPostEffect
} from 'vue'
import { FieldContext, FieldItemContext } from '@/components/field/context'
import { getFieldAriaInvalid, getFieldState, getFieldStateAttrs } from '@/components/field/field'
import { RadioGroupContext } from '@/components/radio-group/context'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { dispatchClickWithModifiers } from '@/internal/dispatch-click-with-modifiers'
import { useFallbackAriaLabelledBy } from '@/internal/fallback-aria-labelled-by'
import { useCompositeItem } from '@/internal/floating/composite'
import { mergeDescribedBy } from '@/internal/labelable'
import { LabelableContext } from '@/internal/labelable-context'
import { serializeValue } from '@/internal/serialize-value'
import { visuallyHidden, visuallyHiddenInput } from '@/internal/visually-hidden'
import { RadioContext, type RadioState } from './context'

type Props = {
  as?: 'span' | 'button'
  id?: string
  value: unknown
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  ariaLabelledby?: string
  ariaDescribedby?: string
  onClick?: (event: MouseEvent) => void
  onMousedown?: (event: MouseEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onKeyup?: (event: KeyboardEvent) => void
  onPointerdown?: (event: PointerEvent) => void
  onFocus?: (event: FocusEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'span',
  id: idProp,
  value,
  disabled: disabledProp = false,
  readOnly: readOnlyProp = false,
  required: requiredProp = false,
  ariaLabelledby,
  ariaDescribedby,
  onClick,
  onMousedown,
  onKeydown,
  onKeyup,
  onPointerdown,
  onFocus
} = defineProps<Props>()

defineSlots<{ default?: (state: RadioState) => any }>()

const uid = useId()

const group = RadioGroupContext.getOr()
const field = FieldContext.getOr()
const fieldItem = FieldItemContext.getOr()
const labelable = LabelableContext.get()

const element = useTemplateRef<HTMLElement>('element')
const inputElement = useTemplateRef<HTMLInputElement>('input')

const rootId = computed(() => (as === 'button' ? (idProp ?? uid) : uid))
const inputId = computed(() => (as === 'button' ? undefined : (idProp ?? `${uid}-input`)))

const disabled = computed(
  () => field?.disabled.value || fieldItem?.disabled.value || group?.disabled.value || disabledProp
)
const readOnly = computed(() => group?.readOnly.value || readOnlyProp)
const required = computed(() => group?.required.value || requiredProp)

const checked = computed(() => (group ? group.value.value === value : value === ''))
const inputValue = computed(() => (value === undefined ? undefined : serializeValue(value)))

const item = group
  ? useCompositeItem({
      composite: group.composite,
      ref: element,
      disabled,
      active: checked
    })
  : undefined

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

const radioState = computed<RadioState>(() => ({
  ...getFieldState(field),
  checked: checked.value,
  disabled: disabled.value,
  readOnly: readOnly.value,
  required: required.value
}))

const stateAttrs = computed(() =>
  dataAttrs({
    checked: checked.value,
    unchecked: !checked.value,
    disabled: disabled.value,
    readonly: readOnly.value,
    required: required.value,
    ...getFieldStateAttrs(field)
  })
)

RadioContext.set({ state: radioState, stateAttrs })

watchPostEffect(() => {
  if (field && inputElement.value?.checked) field.filled.value = true
})

watchEffect(() => {
  onWatcherCleanup(labelable.registerControlId(inputId.value ?? rootId.value))
})

watchPostEffect(() => {
  const node = inputElement.value
  if (!node || !group || !field) return
  onWatcherCleanup(field.registerInput(node, { control: () => element.value, value: undefined }))
})

function forwardClickToInput(event: MouseEvent) {
  if (event.defaultPrevented || readOnly.value) return
  event.preventDefault()
  if (inputElement.value) dispatchClickWithModifiers(inputElement.value, event)
}

function preventEnterActivation(event: KeyboardEvent) {
  if (event.key === 'Enter') event.preventDefault()
}

function checkOnFocus(event: FocusEvent) {
  if (event.defaultPrevented || disabled.value || readOnly.value || !group?.touched) return
  inputElement.value?.click()
  group.touched = false
}

function restoreInputs() {
  const node = inputElement.value
  if (!node) return
  node.checked = checked.value

  const name = group?.name.value
  if (!name || group?.value.value === undefined) return

  const selected = serializeValue(group.value.value)
  for (const sibling of node.ownerDocument.querySelectorAll<HTMLInputElement>(
    'input[type="radio"]'
  )) {
    if (sibling.name !== name || sibling.form !== node.form) continue
    sibling.checked = sibling.value === selected
  }
}

function onChange() {
  if (!inputElement.value) return

  if (readOnly.value || value === undefined) {
    restoreInputs()
    return
  }

  if (!group) {
    field?.setTouched(true)
    return
  }

  group.setCheckedValue(value)

  if (group.value.value === value) {
    field?.setTouched(true)
    return
  }

  restoreInputs()
  nextTick(() => {
    if (group.value.value === value) field?.setTouched(true)
    else restoreInputs()
  })
}

function focusRoot() {
  element.value?.focus()
}

const button = useButton({
  disabled,
  as: () => as,
  tabindex: () => item?.tabindex.value,
  onClick: () => chain(onClick, forwardClickToInput),
  onMousedown: () => onMousedown,
  onKeydown: () => chain(onKeydown, preventEnterActivation),
  onKeyup: () => onKeyup,
  onPointerdown: () => onPointerdown
})

const ownAttrs = computed(() => ({
  id: rootId.value,
  role: 'radio',
  'aria-checked': checked.value,
  'aria-labelledby': ariaLabelledBy.value,
  'aria-describedby': ariaDescribedBy.value,
  'aria-invalid': ariaInvalid.value,
  onFocus: chain(onFocus, item?.onFocus, checkOnFocus)
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(button.attrs.value, stateAttrs, ownAttrs, $attrs)"
  >
    <slot v-bind="radioState" />
  </component>

  <input
    ref="input"
    type="radio"
    :id="inputId"
    :name="group?.name.value"
    :form="group?.form.value"
    :value="inputValue"
    :checked="checked"
    :disabled="disabled"
    :required="required"
    tabindex="-1"
    aria-hidden="true"
    :style="group?.name.value ? visuallyHiddenInput : visuallyHidden"
    @change="onChange"
    @click.stop
    @focus="focusRoot"
  />
</template>
