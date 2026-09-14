import {
  computed,
  shallowReactive,
  shallowRef,
  toValue,
  watch,
  watchPostEffect,
  onWatcherCleanup,
  type MaybeRefOrGetter
} from 'vue'
import { FieldContext } from '@/components/field/context'
import {
  getFieldAriaInvalid,
  getFieldState,
  getFieldStateAttrs,
  type FieldState
} from '@/components/field/field'
import { FormContext } from '@/components/form/context'
import { clamp } from '@/internal/clamp'
import { dataAttrs } from '@/internal/data-attrs'
import { sortByDocumentPosition } from '@/internal/document-position'
import { contains, isHTMLElement } from '@/internal/dom'
import { mergeDescribedBy } from '@/internal/labelable'
import { LabelableContext } from '@/internal/labelable-context'
import type { Orientation } from '@/internal/types'
import { asc, getSliderValue, validateMinimumDistance } from './math'

export type SliderValue = number | readonly number[]

export type SliderState = FieldState & {
  activeThumbIndex: number
  disabled: boolean
  dragging: boolean
  orientation: Orientation
  max: number
  min: number
  minStepsBetweenValues: number
  step: number
  values: number[]
}

type SliderRootOptions = {
  uid: MaybeRefOrGetter<string>
  id: MaybeRefOrGetter<string | null | undefined>
  value: MaybeRefOrGetter<SliderValue>
  setValue: (value: SliderValue) => void
  min: MaybeRefOrGetter<number>
  max: MaybeRefOrGetter<number>
  step: MaybeRefOrGetter<number>
  largeStep: MaybeRefOrGetter<number>
  orientation: MaybeRefOrGetter<Orientation>
  disabled: MaybeRefOrGetter<boolean>
  minStepsBetweenValues: MaybeRefOrGetter<number>
  thumbCollisionBehavior: MaybeRefOrGetter<'push' | 'swap' | 'none'>
  thumbAlignment: MaybeRefOrGetter<'center' | 'edge'>
  name: MaybeRefOrGetter<string | undefined>
  form: MaybeRefOrGetter<string | undefined>
  format: MaybeRefOrGetter<Intl.NumberFormatOptions | undefined>
  locale: MaybeRefOrGetter<Intl.LocalesArgument>
  ariaLabelledBy: MaybeRefOrGetter<string | undefined>
  ariaDescribedBy: MaybeRefOrGetter<string | undefined>
  onValueCommitted?: (value: SliderValue) => void
  ref: MaybeRefOrGetter<HTMLElement | null>
}

type ThumbRegistration = {
  inputId: () => string
  input: () => HTMLInputElement | null
}

function areValuesEqual(a: SliderValue, b: SliderValue | null | undefined): boolean {
  if (a === b) return true
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((value, index) => value === b[index])
  )
}

export function useSliderRoot(options: SliderRootOptions) {
  const field = FieldContext.getOr()
  const labelable = LabelableContext.get()
  const formRoot = FormContext.getOr()

  const thumbs = shallowReactive(new Map<HTMLElement, ThumbRegistration>())

  const dragging = shallowRef(false)
  const indicatorStart = shallowRef<number | undefined>(undefined)
  const indicatorEnd = shallowRef<number | undefined>(undefined)
  const activeThumbIndex = shallowRef(-1)
  const lastUsedThumbIndex = shallowRef(-1)
  const controlElement = shallowRef<HTMLElement | null>(null)
  const labelId = shallowRef<string | undefined>(undefined)

  const ref = computed(() => toValue(options.ref))

  const id = computed(() => toValue(options.id) ?? toValue(options.uid))
  const disabled = computed(() => field?.disabled.value || toValue(options.disabled))
  const name = computed(() => field?.name.value ?? toValue(options.name))
  const form = computed(() => toValue(options.form))
  const min = computed(() => toValue(options.min))
  const max = computed(() => toValue(options.max))
  const step = computed(() => toValue(options.step))
  const largeStep = computed(() => toValue(options.largeStep))
  const orientation = computed(() => toValue(options.orientation))
  const minStepsBetweenValues = computed(() => toValue(options.minStepsBetweenValues))
  const thumbCollisionBehavior = computed(() => toValue(options.thumbCollisionBehavior))
  const inset = computed(() => toValue(options.thumbAlignment) !== 'center')
  const locale = computed(() => toValue(options.locale))
  const format = computed(() => toValue(options.format))

  const arrayValue = computed(() => Array.isArray(toValue(options.value)))

  const values = computed((): number[] => {
    const value = toValue(options.value)
    const lower = min.value
    const upper = max.value
    const entries = Array.isArray(value) ? value : [value]
    return entries.map((entry) => clamp(entry, lower, upper)).toSorted(asc)
  })

  const range = computed(() => values.value.length > 1)

  const fieldValue = computed((): SliderValue =>
    arrayValue.value ? values.value : values.value[0]
  )

  const ariaLabelledBy = computed(
    () => toValue(options.ariaLabelledBy) ?? labelable.labelId.value ?? labelId.value
  )

  const ariaDescribedBy = computed(() =>
    mergeDescribedBy(toValue(options.ariaDescribedBy), labelable.messageIds.value)
  )

  const ariaInvalid = computed(() => getFieldAriaInvalid(field, disabled.value))

  const thumbElements = computed(() =>
    Array.from(thumbs.keys())
      .filter((element) => element.isConnected)
      .sort(sortByDocumentPosition)
  )

  const thumbInputIds = computed(() =>
    thumbElements.value.map((element) => thumbs.get(element)!.inputId())
  )

  const state = computed<SliderState>(() => ({
    ...getFieldState(field),
    activeThumbIndex: activeThumbIndex.value,
    disabled: disabled.value,
    dragging: dragging.value,
    orientation: orientation.value,
    max: max.value,
    min: min.value,
    minStepsBetweenValues: minStepsBetweenValues.value,
    step: step.value,
    values: values.value
  }))

  const stateAttrs = computed(() =>
    dataAttrs({
      dragging: dragging.value,
      orientation: orientation.value,
      disabled: disabled.value,
      ...getFieldStateAttrs(field)
    })
  )

  function setActive(index: number): void {
    activeThumbIndex.value = index
    if (index !== -1) lastUsedThumbIndex.value = index
  }

  function setValue(newValue: SliderValue): boolean {
    if (typeof newValue === 'number' && Number.isNaN(newValue)) return false
    if (areValuesEqual(newValue, toValue(options.value))) return false
    options.setValue(newValue)
    return true
  }

  function commitValue(next: SliderValue): void {
    options.onValueCommitted?.(next)
  }

  function setValueFromInput(valueInput: number, index: number): void {
    const newValue = getSliderValue(
      valueInput,
      index,
      min.value,
      max.value,
      arrayValue.value,
      values.value
    )
    if (validateMinimumDistance(newValue, step.value, minStepsBetweenValues.value)) {
      const applied = setValue(newValue)
      field?.setTouched(true)
      if (applied) {
        commitValue(newValue)
      }
    }
  }

  function registerThumb(element: HTMLElement, registration: ThumbRegistration): () => void {
    thumbs.set(element, registration)
    return () => {
      thumbs.delete(element)
    }
  }

  function getThumbInput(index: number): HTMLInputElement | null {
    const element = thumbElements.value[index]
    return (element && thumbs.get(element)?.input()) ?? null
  }

  function setIndicatorPosition(slot: 0 | 1, position: number | undefined): void {
    if (slot === 0) indicatorStart.value = position
    else indicatorEnd.value = position
  }

  watchPostEffect(() => {
    if (!field || disabled.value) return
    onWatcherCleanup(
      field.registerControl({
        id: id.value,
        element: () => getThumbInput(thumbElements.value.length - 1),
        value: () => fieldValue.value,
        name: () => toValue(options.name)
      })
    )
  })

  watch(
    fieldValue,
    (current, previous) => {
      if (areValuesEqual(current, previous)) return

      formRoot?.clearErrors(name.value)

      if (!field) return

      field.commitValue(current)

      const initial = field.validityData.value.initialValue as SliderValue | null | undefined
      field.setDirty(!areValuesEqual(current, initial))
    },
    { flush: 'post' }
  )

  watchPostEffect(() => {
    if (!disabled.value) return
    const root = ref.value
    const activeEl = (root?.ownerDocument ?? document).activeElement
    if (isHTMLElement(activeEl) && contains(root, activeEl)) {
      activeEl.blur()
    }
    setActive(-1)
  })

  return {
    dragging,
    indicatorStart,
    indicatorEnd,
    activeThumbIndex,
    lastUsedThumbIndex,
    controlElement,
    labelId,
    id,
    disabled,
    name,
    form,
    min,
    max,
    step,
    largeStep,
    orientation,
    minStepsBetweenValues,
    thumbCollisionBehavior,
    inset,
    locale,
    format,
    values,
    range,
    ariaLabelledBy,
    ariaDescribedBy,
    ariaInvalid,
    thumbElements,
    thumbInputIds,
    state,
    stateAttrs,
    setActive,
    setValue,
    commitValue,
    setValueFromInput,
    registerThumb,
    getThumbInput,
    setIndicatorPosition
  }
}

export type SliderRoot = ReturnType<typeof useSliderRoot>
