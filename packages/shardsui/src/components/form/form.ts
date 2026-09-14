import {
  computed,
  shallowRef,
  toValue,
  watch,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
  type ShallowRef
} from 'vue'

export type FormValidationMode = 'onSubmit' | 'onBlur' | 'onChange'
export type FormErrors = Record<string, string | string[]>

export type FormFieldEntry = {
  name: string | undefined
  validate: () => void
  valid: boolean | null
  control: () => HTMLElement | null
  value: () => unknown
}

export function collectFormValues(fields: Map<string, FormFieldEntry>): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  for (const field of fields.values()) {
    if (field.name) values[field.name] = field.value()
  }
  return values
}

export type FieldForm = {
  fields: Map<string, FormFieldEntry>
  validationMode: Ref<FormValidationMode>
  errors: Ref<FormErrors>
  clearErrors: (name: string | undefined) => void
  submitAttempted: boolean
  element: Ref<HTMLElement | null>
}

type FormRootOptions = {
  validationMode: MaybeRefOrGetter<FormValidationMode>
  externalErrors: MaybeRefOrGetter<FormErrors | undefined>
  element: MaybeRefOrGetter<HTMLElement | null>
  onsubmit?: ((event: SubmitEvent) => void) | null
  onFormSubmit?: () => ((values: Record<string, unknown>) => void) | undefined
}

export type FormRoot = {
  fields: Map<string, FormFieldEntry>
  submitAttempted: boolean
  errors: ShallowRef<FormErrors>
  validationMode: ComputedRef<FormValidationMode>
  element: ComputedRef<HTMLElement | null>
  validate: (fieldName?: string) => void
  clearErrors: (name: string | undefined) => void
  onsubmit: (event: SubmitEvent) => void
}

function comesBeforeInSameTree(element: Node, reference: Node): boolean {
  const position = element.compareDocumentPosition(reference)
  return (
    (position & Node.DOCUMENT_POSITION_DISCONNECTED) === 0 &&
    (position & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
  )
}

export function useFormRoot(options: FormRootOptions): FormRoot {
  const fields = new Map<string, FormFieldEntry>()

  let submittedSuccessfully = false

  const errors = shallowRef<FormErrors>(toValue(options.externalErrors) ?? {})

  const validationMode = computed(() => toValue(options.validationMode))

  const element = computed(() => toValue(options.element))

  function validate(fieldName?: string) {
    for (const field of fields.values()) {
      if (fieldName && field.name !== fieldName) continue
      field.validate()
      if (fieldName) return
    }
  }

  function focusFirstInvalid(): boolean {
    let hasInvalid = false
    let firstControl: HTMLElement | null = null

    for (const field of fields.values()) {
      if (field.valid !== false) continue

      hasInvalid = true
      const control = field.control()
      if (control && (!firstControl || comesBeforeInSameTree(control, firstControl))) {
        firstControl = control
      }
    }

    if (firstControl) {
      firstControl.focus()
      if (firstControl instanceof HTMLInputElement) firstControl.select()
    }

    return hasInvalid
  }

  function clearErrors(name: string | undefined) {
    if (!name) return
    if (Object.hasOwn(errors.value, name)) {
      const next = { ...errors.value }
      delete next[name]
      errors.value = next
    }
  }

  function onsubmit(event: SubmitEvent) {
    form.submitAttempted = true

    for (const field of fields.values()) {
      field.validate()
    }

    const hasInvalidField = focusFirstInvalid()
    if (hasInvalidField) {
      event.preventDefault()
      return
    }

    submittedSuccessfully = true
    options.onsubmit?.(event)

    const onFormSubmit = options.onFormSubmit?.()
    if (onFormSubmit) {
      event.preventDefault()
      onFormSubmit(collectFormValues(fields))
    }
  }

  const form: FormRoot = {
    fields,
    submitAttempted: false,
    errors,
    validationMode,
    element,
    validate,
    clearErrors,
    onsubmit
  }

  watch(
    () => toValue(options.externalErrors),
    (next) => {
      errors.value = next ?? {}
    }
  )

  watch(
    errors,
    () => {
      if (!submittedSuccessfully) return
      submittedSuccessfully = false

      focusFirstInvalid()
    },
    { flush: 'post' }
  )

  return form
}
