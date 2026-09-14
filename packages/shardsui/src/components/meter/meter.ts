import { computed, shallowRef, toValue, type MaybeRefOrGetter } from 'vue'
import { clamp } from '@/internal/clamp'
import { formatNumber } from '@/internal/format-number'
import { valueToPercent } from '@/internal/value-to-percent'

type MeterRootOptions = {
  value: MaybeRefOrGetter<number>
  min: MaybeRefOrGetter<number>
  max: MaybeRefOrGetter<number>
  format: MaybeRefOrGetter<Intl.NumberFormatOptions | undefined>
  locale: MaybeRefOrGetter<Intl.LocalesArgument>
}

export type MeterValueSlotState = {
  formattedValue: string
  value: number
}

export function useMeterRoot(options: MeterRootOptions) {
  const labelId = shallowRef<string | undefined>(undefined)

  const value = computed(() => toValue(options.value))

  const percentageValue = computed(() => {
    const percentage = valueToPercent(value.value, toValue(options.min), toValue(options.max))
    return clamp(Number.isNaN(percentage) ? 0 : percentage, 0, 100)
  })

  const clampedValue = computed(() => {
    const min = toValue(options.min)
    return clamp(Number.isNaN(value.value) ? min : value.value, min, toValue(options.max))
  })

  const formattedValue = computed(() => {
    const format = toValue(options.format)
    return format
      ? formatNumber(clampedValue.value, toValue(options.locale), format)
      : formatNumber(percentageValue.value / 100, toValue(options.locale), { style: 'percent' })
  })

  return { labelId, value, percentageValue, clampedValue, formattedValue }
}

export type MeterRoot = ReturnType<typeof useMeterRoot>
