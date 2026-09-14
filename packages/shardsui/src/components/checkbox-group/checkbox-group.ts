import {
  computed,
  onWatcherCleanup,
  toValue,
  watch,
  watchPostEffect,
  type ComputedRef,
  type MaybeRefOrGetter
} from 'vue'
import { FieldContext } from '@/components/field/context'
import { isSubmittableInput } from '@/components/field/field'
import { FormContext } from '@/components/form/context'

type CheckboxGroupRootOptions = {
  uid: MaybeRefOrGetter<string>
  value: MaybeRefOrGetter<string[]>
  setValue: (value: string[]) => void
  disabled: MaybeRefOrGetter<boolean>
}

export type CheckboxGroupRoot = {
  value: ComputedRef<string[]>
  disabled: ComputedRef<boolean>
  toggleChild: (childValue: string, checked: boolean) => void
}

export function useCheckboxGroupRoot(options: CheckboxGroupRootOptions): CheckboxGroupRoot {
  const field = FieldContext.getOr()
  const formRoot = FormContext.getOr()

  const value = computed(() => toValue(options.value))
  const disabled = computed(() => field?.disabled.value || toValue(options.disabled))

  function formValue(): string[] {
    const formElement = field?.formElement.value
    if (!field || !formElement) return value.value

    const submittedValues = new Set<string>()
    for (const [input, registration] of field.registeredInputs) {
      if (registration.value === undefined || !input.checked) continue
      if (isSubmittableInput(input, formElement)) submittedValues.add(registration.value)
    }

    return value.value.filter((item) => submittedValues.has(item))
  }

  function toggleChild(childValue: string, checked: boolean) {
    const next = checked
      ? [...value.value, childValue]
      : value.value.filter((item) => item !== childValue)

    options.setValue(next)
  }

  watchPostEffect(() => {
    if (!field?.name.value || disabled.value) return
    onWatcherCleanup(
      field.registerControl({
        id: `${toValue(options.uid)}-control`,
        element: () => field.getRepresentativeControl(),
        value: () => value.value,
        formValue
      })
    )
  })

  watch(
    () => toValue(options.value),
    (next) => {
      if (field?.name.value) formRoot?.clearErrors(field.name.value)
      if (!field) return

      const initial = field.validityData.value.initialValue
      const previous: string[] = Array.isArray(initial) ? initial : []
      const isDirty =
        next.length !== previous.length || next.some((item, i) => item !== previous[i])

      field.setDirty(isDirty)
      field.filled.value = next.length > 0
      field.commitValue(next)
    },
    { flush: 'post' }
  )

  return { value, disabled, toggleChild }
}
