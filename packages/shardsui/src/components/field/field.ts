import {
  computed,
  onWatcherCleanup,
  shallowRef,
  toValue,
  watch,
  watchSyncEffect,
  type ComputedRef,
  type MaybeRefOrGetter,
  type ShallowRef
} from 'vue'
import type { FieldsetRoot } from '@/components/fieldset/fieldset'
import {
  collectFormValues,
  type FieldForm,
  type FormFieldEntry,
  type FormValidationMode
} from '@/components/form/form'
import { dataAttrs } from '@/internal/data-attrs'
import { useTimeout } from '@/internal/timeout'

type ValidityFlags = {
  badInput: boolean
  customError: boolean
  patternMismatch: boolean
  rangeOverflow: boolean
  rangeUnderflow: boolean
  stepMismatch: boolean
  tooLong: boolean
  tooShort: boolean
  typeMismatch: boolean
  valueMissing: boolean
  valid: boolean | null
}

export type FieldValidityData = {
  state: ValidityFlags
  error: string
  errors: string[]
  value: unknown
  initialValue: unknown
}

type FieldValidatorResult = string | string[] | null

export type FieldValidator = (
  value: unknown,
  formValues: Record<string, unknown>
) => FieldValidatorResult | Promise<FieldValidatorResult>

type RegisteredInput = {
  control: () => HTMLElement | null
  value: string | undefined
}

type ControlEntry = {
  id: string
  element: () => HTMLElement | null
  value: () => unknown
  formValue?: () => unknown
  validationElement?: () => HTMLElement | null
  name?: () => string | undefined
}

const DEFAULT_VALIDITY_STATE: ValidityFlags = {
  badInput: false,
  customError: false,
  patternMismatch: false,
  rangeOverflow: false,
  rangeUnderflow: false,
  stepMismatch: false,
  tooLong: false,
  tooShort: false,
  typeMismatch: false,
  valid: null,
  valueMissing: false
}

const DEFAULT_VALIDITY_DATA: FieldValidityData = {
  state: DEFAULT_VALIDITY_STATE,
  error: '',
  errors: [],
  value: null,
  initialValue: null
}

const VALIDITY_KEYS = Object.keys(DEFAULT_VALIDITY_STATE) as Array<keyof ValidityState>

function hasErrorBesides(
  validity: ValidityFlags | ValidityState,
  ...ignoredKeys: Array<keyof ValidityState>
): boolean {
  return VALIDITY_KEYS.some((key) => key !== 'valid' && !ignoredKeys.includes(key) && validity[key])
}

export type FieldState = {
  touched: boolean
  dirty: boolean
  filled: boolean
  focused: boolean
  valid: boolean | null
}

export type FieldRoot = {
  registeredInputs: Map<HTMLInputElement, RegisteredInput>
  filled: ShallowRef<boolean>
  focused: ShallowRef<boolean>
  validityData: Readonly<ShallowRef<FieldValidityData>>
  formElement: ComputedRef<HTMLElement | null>
  name: ComputedRef<string | undefined>
  validationMode: ComputedRef<FormValidationMode>
  disabled: ComputedRef<boolean>
  dirty: ComputedRef<boolean>
  touched: ComputedRef<boolean>
  formError: ComputedRef<string | string[] | null>
  hasFormError: ComputedRef<boolean>
  valid: ComputedRef<boolean | null>
  combinedValidityData: ComputedRef<FieldValidityData>
  stateAttrs: ComputedRef<Record<string, string | undefined>>
  validateControl: (control: ControlEntry | null) => void
  setTouched: (next: boolean) => void
  commitOnBlur: (value: unknown) => void
  setDirty: (next: boolean) => void
  registerControl: (entry: ControlEntry) => () => void
  registerInput: (input: HTMLInputElement, registration: RegisteredInput) => () => void
  getRepresentativeControl: () => HTMLElement | null
  commit: (value: unknown, revalidate?: boolean) => Promise<void>
  commitValue: (value: unknown) => void
}

export function getFieldState(field: FieldRoot | undefined): FieldState {
  return {
    touched: field?.touched.value ?? false,
    dirty: field?.dirty.value ?? false,
    filled: field?.filled.value ?? false,
    focused: field?.focused.value ?? false,
    valid: field?.valid.value ?? null
  }
}

export function getFieldStateAttrs(field: FieldRoot | undefined) {
  return {
    touched: field?.touched.value,
    dirty: field?.dirty.value,
    filled: field?.filled.value,
    focused: field?.focused.value,
    valid: field?.valid.value === true,
    invalid: field?.valid.value === false
  }
}

export function getFieldAriaInvalid(
  field: FieldRoot | undefined,
  disabled: boolean
): true | undefined {
  return field?.valid.value === false && !disabled ? true : undefined
}

function isFormInputElement(element: HTMLElement): element is HTMLInputElement {
  return 'validity' in element
}

export function isSubmittableInput(
  input: HTMLInputElement,
  formElement: HTMLElement | null
): boolean {
  if (input.matches(':disabled')) return false
  if (!formElement || input.form === formElement) return true
  return input.form === null && !input.hasAttribute('form')
}

function toFormField(field: FieldRoot, control: ControlEntry): FormFieldEntry {
  return {
    get name() {
      return field.name.value
    },
    get valid() {
      return field.valid.value
    },
    validate: () => field.validateControl(control),
    control: () => control.element(),
    value: () => (control.formValue ? control.formValue() : control.value())
  }
}

type FieldRootOptions = {
  name: MaybeRefOrGetter<string | undefined>
  validate: FieldValidator
  validationMode: MaybeRefOrGetter<FormValidationMode | undefined>
  validationDebounceTime: MaybeRefOrGetter<number>
  disabled: MaybeRefOrGetter<boolean>
  invalid: MaybeRefOrGetter<boolean | undefined>
  dirty: MaybeRefOrGetter<boolean | undefined>
  touched: MaybeRefOrGetter<boolean | undefined>
  fieldset: FieldsetRoot | undefined
  form: FieldForm | undefined
}

export function useFieldRoot(options: FieldRootOptions): FieldRoot {
  const debounceTimeout = useTimeout()

  const registeredInputs = new Map<HTMLInputElement, RegisteredInput>()

  const ownForm: FieldForm = {
    fields: new Map(),
    validationMode: shallowRef<FormValidationMode>('onSubmit'),
    errors: shallowRef({}),
    clearErrors: () => {},
    submitAttempted: false,
    element: shallowRef<HTMLElement | null>(null)
  }

  let markedDirty = toValue(options.dirty) ?? false
  let initialValueCaptured = false
  let validationCommitId = 0
  let currentValidityData: FieldValidityData = DEFAULT_VALIDITY_DATA
  let currentControl: ControlEntry | null = null

  const filled = shallowRef(false)
  const focused = shallowRef(false)
  const touchedState = shallowRef(false)
  const dirtyState = shallowRef(false)
  const activeControl = shallowRef<ControlEntry | null>(null)
  const validityData = shallowRef<FieldValidityData>(DEFAULT_VALIDITY_DATA)

  function setValidityData(next: FieldValidityData): void {
    currentValidityData = next
    validityData.value = next
  }

  const form = computed(() => options.form ?? ownForm)

  const formElement = computed(() => form.value.element.value)

  const name = computed(() => toValue(options.name) ?? activeControl.value?.name?.())

  const validationMode = computed(
    () => toValue(options.validationMode) ?? form.value.validationMode.value
  )

  const disabled = computed(() => options.fieldset?.disabled.value || toValue(options.disabled))

  const dirty = computed(() => toValue(options.dirty) ?? dirtyState.value)
  const touched = computed(() => toValue(options.touched) ?? touchedState.value)

  const formError = computed(() => {
    const errors = form.value.errors.value
    return name.value && Object.hasOwn(errors, name.value) ? (errors[name.value] ?? null) : null
  })

  const hasFormError = computed(
    () => !!(Array.isArray(formError.value) ? formError.value.length : formError.value)
  )

  const invalid = computed(() => toValue(options.invalid) === true || hasFormError.value)

  const valid = computed(
    () => !invalid.value && (disabled.value ? null : validityData.value.state.valid)
  )

  const combinedValidityData = computed<FieldValidityData>(() => ({
    ...validityData.value,
    state: {
      ...validityData.value.state,
      valid: !invalid.value && validityData.value.state.valid
    }
  }))

  function validateControl(control: ControlEntry | null) {
    markedDirty = true
    commit(control ? control.value() : currentValidityData.value)
  }

  function setTouched(next: boolean) {
    if (toValue(options.touched) !== undefined) return
    touchedState.value = next
  }

  function commitOnBlur(value: unknown) {
    setTouched(true)
    focused.value = false
    if (validationMode.value === 'onBlur') commit(value)
  }

  function setDirty(next: boolean) {
    if (toValue(options.dirty) !== undefined) return
    if (next) markedDirty = true
    dirtyState.value = next
  }

  function setActiveControl(next: ControlEntry | null): void {
    currentControl = next
    activeControl.value = next
  }

  function registerControl(entry: ControlEntry): () => void {
    setActiveControl(entry)
    if (!initialValueCaptured) {
      initialValueCaptured = true
      const initialValue = entry.value()
      if (currentValidityData.initialValue !== initialValue) {
        setValidityData({ ...currentValidityData, initialValue })
      }
    }
    return () => {
      if (currentControl?.id === entry.id) setActiveControl(null)
    }
  }

  function registerInput(input: HTMLInputElement, registration: RegisteredInput): () => void {
    registeredInputs.set(input, registration)
    return () => {
      registeredInputs.delete(input)
    }
  }

  function findRepresentativeInput(): HTMLInputElement | null {
    let fallback: HTMLInputElement | null = null
    for (const input of registeredInputs.keys()) {
      if (!isSubmittableInput(input, formElement.value)) continue
      if (!input.validity.valid) return input
      fallback ??= input
    }
    return fallback
  }

  function getRepresentativeControl(): HTMLElement | null {
    const input = findRepresentativeInput()
    return (input && registeredInputs.get(input)?.control()) ?? null
  }

  function shouldValidateOnChange() {
    return (
      validationMode.value === 'onChange' ||
      (validationMode.value === 'onSubmit' && form.value.submitAttempted)
    )
  }

  function getValidityState(element: HTMLInputElement): ValidityFlags {
    const next: ValidityFlags = { ...DEFAULT_VALIDITY_STATE }
    for (const key of VALIDITY_KEYS) next[key] = element.validity[key]

    if (next.valueMissing && !hasErrorBesides(next, 'valueMissing') && !markedDirty) {
      next.valid = true
      next.valueMissing = false
    }
    return next
  }

  function clearCustomValidity(element: HTMLInputElement | null) {
    for (const input of registeredInputs.keys()) input.setCustomValidity('')
    element?.setCustomValidity('')
  }

  function resolveValidationInput(): HTMLInputElement | null {
    const control =
      registeredInputs.size > 0
        ? findRepresentativeInput()
        : (activeControl.value?.validationElement?.() ?? activeControl.value?.element() ?? null)
    return control && isFormInputElement(control) ? control : null
  }

  function writeValidityData(next: Omit<FieldValidityData, 'initialValue'>) {
    setValidityData({ ...next, initialValue: currentValidityData.initialValue })
  }

  function settleRevalidation(input: HTMLInputElement | null, value: unknown): boolean {
    if (valid.value !== false || !input) return true

    if (input.validity.valueMissing) {
      return hasErrorBesides(input.validity, 'valueMissing', 'customError')
    }

    clearCustomValidity(input)
    writeValidityData({
      value,
      state: { ...DEFAULT_VALIDITY_STATE, valid: true },
      error: '',
      errors: []
    })
    return true
  }

  async function commit(value: unknown, revalidate = false): Promise<void> {
    const input = resolveValidationInput()

    const commitId = ++validationCommitId

    if (revalidate && settleRevalidation(input, value)) return

    debounceTimeout.clear()

    const nextState = input ? getValidityState(input) : { ...DEFAULT_VALIDITY_STATE, valid: true }

    let result: string | string[] | null = null
    let validationErrors: string[] = []
    let defaultValidationMessage: string | undefined
    const validateOnChange = shouldValidateOnChange()

    if (input?.validationMessage && !validateOnChange) {
      defaultValidationMessage = input.validationMessage
      validationErrors = [input.validationMessage]
    } else {
      const validateResult = options.validate(value, collectFormValues(form.value.fields))
      result =
        validateResult !== null && typeof validateResult === 'object' && 'then' in validateResult
          ? await validateResult
          : validateResult

      if (commitId !== validationCommitId) return

      if (result !== null) {
        nextState.valid = false
        nextState.customError = true
        if (Array.isArray(result)) {
          validationErrors = result
          input?.setCustomValidity(result.join('\n'))
        } else if (result) {
          validationErrors = [result]
          input?.setCustomValidity(result)
        }
      } else if (validateOnChange) {
        clearCustomValidity(input)
        nextState.customError = false
        if (input?.validationMessage) {
          defaultValidationMessage = input.validationMessage
          validationErrors = [input.validationMessage]
        } else if ((!input || input.validity.valid) && !nextState.valid) {
          nextState.valid = true
        }
      }
    }

    writeValidityData({
      value,
      state: nextState,
      error: defaultValidationMessage ?? (Array.isArray(result) ? result[0] : (result ?? '')),
      errors: validationErrors
    })
  }

  function commitValue(value: unknown) {
    debounceTimeout.clear()

    const validateOnChange = shouldValidateOnChange()
    const debounceTime = toValue(options.validationDebounceTime)
    if (validateOnChange && value !== '' && debounceTime) {
      validationCommitId += 1
      debounceTimeout.start(debounceTime, () => commit(value))
      return
    }

    commit(value, !validateOnChange)
  }

  const field: FieldRoot = {
    registeredInputs,
    filled,
    focused,
    validityData,
    formElement,
    name,
    validationMode,
    disabled,
    dirty,
    touched,
    formError,
    hasFormError,
    valid,
    combinedValidityData,
    stateAttrs: computed(() =>
      dataAttrs({ disabled: disabled.value, ...getFieldStateAttrs(field) })
    ),
    validateControl,
    setTouched,
    commitOnBlur,
    setDirty,
    registerControl,
    registerInput,
    getRepresentativeControl,
    commit,
    commitValue
  }

  watch(
    () => toValue(options.dirty),
    (next) => {
      if (next !== undefined) markedDirty = next
    }
  )

  watchSyncEffect(() => {
    const currentForm = form.value
    const control = activeControl.value
    if (!control?.id || disabled.value) return

    const id = control.id
    const entry = toFormField(field, control)
    currentForm.fields.set(id, entry)
    onWatcherCleanup(() => {
      if (currentForm.fields.get(id) === entry) currentForm.fields.delete(id)
    })
  })

  return field
}
