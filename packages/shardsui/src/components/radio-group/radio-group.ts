import {
  computed,
  onWatcherCleanup,
  toValue,
  watch,
  watchPostEffect,
  type MaybeRefOrGetter
} from 'vue'
import { FieldContext } from '@/components/field/context'
import { isSubmittableInput } from '@/components/field/field'
import { FormContext } from '@/components/form/context'
import type { ModifierKey } from '@/internal/composite'
import { contains } from '@/internal/dom'
import { useCompositeRoot } from '@/internal/floating/composite'

const MODIFIER_KEYS: ModifierKey[] = ['Shift']

type RadioGroupRootOptions<Value = unknown> = {
  uid: MaybeRefOrGetter<string>
  value: MaybeRefOrGetter<Value | undefined>
  setValue: (value: Value) => void
  disabled: MaybeRefOrGetter<boolean>
  readOnly: MaybeRefOrGetter<boolean>
  required: MaybeRefOrGetter<boolean>
  name: MaybeRefOrGetter<string | undefined>
  form: MaybeRefOrGetter<string | undefined>
  ref: MaybeRefOrGetter<HTMLElement | null>
}

export function useRadioGroupRoot<Value = unknown>(options: RadioGroupRootOptions<Value>) {
  const controlId = `${toValue(options.uid)}-control`

  const field = FieldContext.getOr()
  const formRoot = FormContext.getOr()

  const composite = useCompositeRoot({
    orientation: 'both',
    loopFocus: true,
    modifierKeys: MODIFIER_KEYS,
    ref: options.ref
  })

  const value = computed(() => toValue(options.value))
  const readOnly = computed(() => toValue(options.readOnly))
  const required = computed(() => toValue(options.required))
  const form = computed(() => toValue(options.form))
  const disabled = computed(() => field?.disabled.value || toValue(options.disabled))
  const name = computed(() => field?.name.value ?? toValue(options.name))

  function formValue() {
    const formElement = field?.formElement.value
    if (!field || !formElement) return value.value ?? null

    for (const input of field.registeredInputs.keys()) {
      if (input.checked && isSubmittableInput(input, formElement)) return value.value ?? null
    }
    return null
  }

  watchPostEffect(() => {
    if (disabled.value || !field) return
    onWatcherCleanup(
      field.registerControl({
        id: controlId,
        element: () => field.getRepresentativeControl(),
        value: () => value.value ?? null,
        formValue,
        name: () => toValue(options.name)
      })
    )
  })

  watch(
    () => toValue(options.value),
    (next) => {
      formRoot?.clearErrors(name.value)
      if (!field) return
      field.setDirty(next !== field.validityData.value.initialValue)
      field.filled.value = next != null
      field.commitValue(next)
    },
    { flush: 'post' }
  )

  const group = {
    composite,
    touched: false,
    value,
    readOnly,
    required,
    form,
    disabled,
    name,
    setCheckedValue: (next: Value) => {
      options.setValue(next)
    },
    onKeydownCapture: (event: KeyboardEvent) => {
      if (!event.key.startsWith('Arrow')) return
      group.touched = true
      if (field) field.focused.value = true
    },
    onFocusin: () => {
      if (field) field.focused.value = true
    },
    onFocusout: (event: FocusEvent) => {
      const ref = toValue(options.ref)
      if (!field || !ref) return
      if (contains(ref, event.relatedTarget)) return
      field.commitOnBlur(value.value)
    }
  }

  return group
}

export type RadioGroupRoot<Value = unknown> = ReturnType<typeof useRadioGroupRoot<Value>>
