import { computed, shallowRef, toValue, type MaybeRefOrGetter } from 'vue'
import { clamp } from '@/internal/clamp'
import { dataAttrs } from '@/internal/data-attrs'
import { formatNumber } from '@/internal/format-number'
import { valueToPercent } from '@/internal/value-to-percent'

export type ProgressStatus = 'indeterminate' | 'progressing' | 'complete'

export type ProgressState = {
  status: ProgressStatus
}

type ProgressRootOptions = {
  value: MaybeRefOrGetter<number | null>
  min: MaybeRefOrGetter<number>
  max: MaybeRefOrGetter<number>
  format: MaybeRefOrGetter<Intl.NumberFormatOptions | undefined>
  locale: MaybeRefOrGetter<Intl.LocalesArgument>
}

export type ProgressValueSlotState = {
  formattedValue: string
  value: number | null
}

export function useProgressRoot(options: ProgressRootOptions) {
  const labelId = shallowRef<string | undefined>(undefined)

  const value = computed(() => toValue(options.value))

  const determinateValue = computed(() => {
    const current = value.value
    return current != null && Number.isFinite(current) ? current : null
  })

  const clampedValue = computed(() => {
    const current = determinateValue.value
    if (current == null) return null
    return clamp(current, toValue(options.min), toValue(options.max))
  })

  const percentageValue = computed(() => {
    const current = determinateValue.value
    if (current == null) return null
    const percentage = valueToPercent(current, toValue(options.min), toValue(options.max))
    return clamp(Number.isNaN(percentage) ? 0 : percentage, 0, 100)
  })

  const formattedValue = computed(() => {
    const clamped = clampedValue.value
    const percentage = percentageValue.value
    if (clamped == null || percentage == null) return ''
    const format = toValue(options.format)
    return format
      ? formatNumber(clamped, toValue(options.locale), format)
      : formatNumber(percentage / 100, toValue(options.locale), { style: 'percent' })
  })

  const status = computed<ProgressStatus>(() => {
    if (determinateValue.value == null) return 'indeterminate'
    return clampedValue.value === toValue(options.max) ? 'complete' : 'progressing'
  })

  const state = computed<ProgressState>(() => ({ status: status.value }))

  const stateAttrs = computed(() =>
    dataAttrs({
      indeterminate: status.value === 'indeterminate',
      progressing: status.value === 'progressing',
      complete: status.value === 'complete'
    })
  )

  return {
    labelId,
    value,
    clampedValue,
    percentageValue,
    formattedValue,
    status,
    state,
    stateAttrs
  }
}

export type ProgressRoot = ReturnType<typeof useProgressRoot>
