import {
  computed,
  onWatcherCleanup,
  shallowRef,
  toValue,
  watchPostEffect,
  type MaybeRefOrGetter
} from 'vue'
import { FieldContext } from '@/components/field/context'
import { clamp } from '@/internal/clamp'
import { COMPOSITE_KEYS } from '@/internal/composite'
import { DirectionContext } from '@/internal/direction-context'
import { contains } from '@/internal/dom'
import { matchesFocusVisible } from '@/internal/floating/element'
import { LabelableContext } from '@/internal/labelable-context'
import { valueToPercent } from '@/internal/value-to-percent'
import { getDecimalPrecision, getSliderValue, roundValueToStep } from './math'
import type { SliderRoot } from './slider'

const SLIDER_KEYS = new Set([...COMPOSITE_KEYS, 'PageUp', 'PageDown'])

type SliderThumbOptions = {
  ref: MaybeRefOrGetter<HTMLElement | null>
  input: MaybeRefOrGetter<HTMLInputElement | null>
  index: MaybeRefOrGetter<number | undefined>
  disabled: MaybeRefOrGetter<boolean>
  generatedInputId: MaybeRefOrGetter<string>
  onFocus: ((event: FocusEvent) => void) | null | undefined
  onBlur: ((event: FocusEvent) => void) | null | undefined
}

export function useSliderThumb(slider: SliderRoot, options: SliderThumbOptions) {
  const field = FieldContext.getOr()
  const labelable = LabelableContext.get()
  const direction = DirectionContext.get()

  let isRestoringFocusVisible = false

  const insetPosition = shallowRef<number | undefined>(undefined)

  const ref = computed(() => toValue(options.ref))

  const index = computed(() => {
    if (!slider.range.value) return 0
    const explicitIndex = toValue(options.index)
    const element = ref.value
    if (explicitIndex !== undefined) return explicitIndex
    if (!element) return -1
    return slider.thumbElements.value.indexOf(element)
  })

  const resolved = computed(() => index.value >= 0 && index.value < slider.values.value.length)

  const value = computed(() => slider.values.value[index.value] ?? NaN)

  const valuePercent = computed(() =>
    valueToPercent(value.value, slider.min.value, slider.max.value)
  )

  const disabled = computed(() => toValue(options.disabled) || slider.disabled.value)

  const vertical = computed(() => slider.orientation.value === 'vertical')

  const inputId = computed(() => {
    const generated = toValue(options.generatedInputId)
    return slider.range.value ? generated : (labelable.controlId.value ?? generated)
  })

  const indicatorSlot = computed<0 | 1 | undefined>(() => {
    if (index.value === 0) return 0
    if (index.value === slider.values.value.length - 1) return 1
    return undefined
  })

  function measureInsetPosition(): void {
    const slot = indicatorSlot.value
    const control = slider.controlElement.value
    const element = ref.value
    if (!control || !element) return

    const side = vertical.value ? 'height' : 'width'
    const controlSize = control.getBoundingClientRect()[side]
    const thumbSize = element.getBoundingClientRect()[side]
    const offsetFromControlEdge =
      thumbSize / 2 + ((controlSize - thumbSize) * valuePercent.value) / 100
    const percent = (offsetFromControlEdge / controlSize) * 100
    const position = Number.isFinite(percent) ? percent : undefined

    insetPosition.value = position
    if (slot !== undefined) slider.setIndicatorPosition(slot, position)
  }

  watchPostEffect(() => {
    if (!slider.inset.value) return
    measureInsetPosition()
  })

  watchPostEffect(() => {
    const element = ref.value
    if (!element) return
    onWatcherCleanup(
      slider.registerThumb(element, {
        inputId: () => inputId.value,
        input: () => toValue(options.input)
      })
    )
  })

  watchPostEffect(() => {
    const thumb = ref.value
    const control = slider.controlElement.value
    if (!slider.inset.value || !control || !thumb) return

    const observer = new ResizeObserver(() => measureInsetPosition())
    observer.observe(control)
    observer.observe(thumb)

    onWatcherCleanup(() => observer.disconnect())
  })

  function steppedValue(currentValue: number, increment: number, sign: 1 | -1): number {
    const stepped = currentValue + increment * sign
    const roundedValue = Number(
      stepped.toFixed(
        Math.max(
          getDecimalPrecision(currentValue),
          getDecimalPrecision(increment),
          getDecimalPrecision(slider.min.value)
        )
      )
    )
    return clamp(roundedValue, slider.min.value, slider.max.value)
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.defaultPrevented) {
      return
    }

    if (!SLIDER_KEYS.has(event.key)) return

    if (COMPOSITE_KEYS.has(event.key)) {
      event.stopPropagation()
    }

    const currentIndex = index.value
    const range = slider.range.value
    const values = slider.values.value
    const rtl = direction.direction.value === 'rtl'

    let newValue: number | null = null
    let sign: 1 | -1 | 0 = 0
    let increment = event.shiftKey ? slider.largeStep.value : slider.step.value
    const roundedValue = roundValueToStep(value.value, slider.step.value, slider.min.value)

    switch (event.key) {
      case 'ArrowUp':
        sign = 1
        break
      case 'ArrowRight':
        sign = rtl ? -1 : 1
        break
      case 'ArrowDown':
        sign = -1
        break
      case 'ArrowLeft':
        sign = rtl ? 1 : -1
        break
      case 'PageUp':
        increment = slider.largeStep.value
        sign = 1
        break
      case 'PageDown':
        increment = slider.largeStep.value
        sign = -1
        break
      case 'End':
        newValue =
          range && Number.isFinite(values[currentIndex + 1])
            ? values[currentIndex + 1] - slider.step.value * slider.minStepsBetweenValues.value
            : slider.max.value
        break
      case 'Home':
        newValue =
          range && Number.isFinite(values[currentIndex - 1])
            ? values[currentIndex - 1] + slider.step.value * slider.minStepsBetweenValues.value
            : slider.min.value
        break
    }

    if (sign !== 0) {
      newValue = steppedValue(roundedValue, increment, sign)
    }

    if (newValue !== null) {
      const input = toValue(options.input)
      if (input && !matchesFocusVisible(input)) {
        isRestoringFocusVisible = true
        input.blur()
        input.focus({ preventScroll: true, focusVisible: true } as FocusOptions)
      }

      slider.setValueFromInput(newValue, currentIndex)
      event.preventDefault()
    }
  }

  function onInput(): void {
    const input = toValue(options.input)
    if (input) slider.setValueFromInput(input.valueAsNumber, index.value)
  }

  function onFocus(event: FocusEvent): void {
    const wasRestoringFocusVisible = isRestoringFocusVisible
    isRestoringFocusVisible = false

    slider.setActive(index.value)
    if (field) field.focused.value = true

    if (wasRestoringFocusVisible) return
    options.onFocus?.(event)
  }

  function onBlur(event: FocusEvent): void {
    if (isRestoringFocusVisible) return

    slider.setActive(-1)

    const movingToAnotherThumb = slider.thumbElements.value.some((thumb) =>
      contains(thumb, event.relatedTarget)
    )

    if (!movingToAnotherThumb) {
      field?.commitOnBlur(
        getSliderValue(
          value.value,
          index.value,
          slider.min.value,
          slider.max.value,
          slider.range.value,
          slider.values.value
        )
      )
    }

    options.onBlur?.(event)
  }

  return {
    insetPosition,
    index,
    resolved,
    value,
    valuePercent,
    disabled,
    vertical,
    inputId,
    onKeydown,
    onInput,
    onFocus,
    onBlur
  }
}
