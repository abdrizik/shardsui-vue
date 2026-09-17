<script setup lang="ts">
import { computed, mergeProps, useId, useTemplateRef, type StyleValue } from 'vue'
import { FieldContext } from '@/components/field/context'
import { getFieldAriaInvalid } from '@/components/field/field'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { DirectionContext } from '@/internal/direction-context'
import { formatNumber } from '@/internal/format-number'
import { mergeDescribedBy } from '@/internal/labelable'
import { LabelableContext } from '@/internal/labelable-context'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import { visuallyHidden } from '@/internal/visually-hidden'
import { SliderContext } from './context'
import type { SliderState } from './slider'
import { useSliderThumb } from './thumb'

type Props = PartProps & {
  id?: string
  index?: number
  disabled?: boolean
  tabindex?: number
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  ariaValuetext?: string
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  id: idProp,
  index: explicitIndex,
  disabled: disabledProp = false,
  tabindex,
  ariaLabel,
  ariaLabelledby: ariaLabelledbyProp,
  ariaDescribedby: ariaDescribedbyProp,
  ariaValuetext: ariaValuetextProp,
  onFocus,
  onBlur,
  onKeydown
} = defineProps<Props>()

defineSlots<{ default?: (state: SliderState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const slider = SliderContext.get()
const field = FieldContext.getOr()
const labelable = LabelableContext.get()
const direction = DirectionContext.get()
const rtl = computed(() => direction.direction.value === 'rtl')

const element = usePartElement()
const input = useTemplateRef<HTMLInputElement>('input')

const thumb = useSliderThumb(slider, {
  ref: element,
  input,
  index: () => explicitIndex,
  disabled: () => disabledProp,
  generatedInputId: `${uid}-input`,
  onFocus: (event) => onFocus?.(event),
  onBlur: (event) => onBlur?.(event)
})

const defaultAriaValueText = computed(() => {
  if (!thumb.resolved.value) return undefined
  const formatted = formatNumber(thumb.value.value, slider.locale.value, slider.format.value)
  if (slider.values.value.length === 2) {
    return `${formatted} ${thumb.index.value === 0 ? 'start range' : 'end range'}`
  }
  return slider.format.value ? formatted : undefined
})

const ariaLabelledby = computed(
  () => ariaLabelledbyProp ?? (ariaLabel == null ? slider.ariaLabelledBy.value : undefined)
)
const ariaDescribedby = computed(() =>
  mergeDescribedBy(ariaDescribedbyProp, labelable.messageIds.value)
)
const ariaInvalid = computed(() => getFieldAriaInvalid(field, thumb.disabled.value))
const ariaValuetext = computed(() => ariaValuetextProp ?? defaultAriaValueText.value)

const thumbStyle = computed<StyleValue>(() => {
  if (!slider.inset.value && !Number.isFinite(thumb.valuePercent.value)) {
    return visuallyHidden
  }

  const startEdge = thumb.vertical.value ? 'bottom' : 'insetInlineStart'
  const crossOffset = thumb.vertical.value ? 'left' : 'top'

  const styles: Record<string, string> = { position: 'absolute' }

  if (slider.inset.value) {
    styles['--position'] = `${thumb.insetPosition.value ?? 0}%`
    styles[startEdge] = 'var(--position)'
  } else {
    styles[startEdge] = `${thumb.valuePercent.value}%`
  }

  styles[crossOffset] = '50%'
  styles.translate = `${(thumb.vertical.value || !rtl.value ? -1 : 1) * 50}% ${(thumb.vertical.value ? 1 : -1) * 50}%`

  if (slider.inset.value && thumb.insetPosition.value === undefined) {
    styles.visibility = 'hidden'
  }

  if (slider.range.value) {
    if (slider.activeThumbIndex.value === thumb.index.value) styles.zIndex = '2'
    else if (slider.lastUsedThumbIndex.value === thumb.index.value) styles.zIndex = '1'
  } else if (slider.activeThumbIndex.value === thumb.index.value) {
    styles.zIndex = '1'
  }

  return styles
})

const inputStyle = computed<StyleValue>(() => [
  visuallyHidden,
  {
    width: '100%',
    height: '100%',
    writingMode: thumb.vertical.value ? (rtl.value ? 'vertical-rl' : 'vertical-lr') : undefined
  }
])

const stateAttrs = computed(() => dataAttrs({ index: thumb.index.value }))

const ownAttrs = computed(() => ({ id: id.value }))

const inputAttrs = computed(() => ({
  type: 'range' as const,
  id: thumb.inputId.value,
  min: slider.min.value,
  max: slider.max.value,
  step: slider.step.value,
  disabled: thumb.disabled.value,
  name: slider.name.value,
  form: slider.form.value,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby.value,
  'aria-describedby': ariaDescribedby.value,
  'aria-invalid': ariaInvalid.value,
  'aria-orientation': slider.orientation.value,
  'aria-valuenow': thumb.resolved.value ? thumb.value.value : undefined,
  'aria-valuetext': ariaValuetext.value,
  tabindex,
  value: thumb.value.value,
  onKeydown: chain(onKeydown, thumb.onKeydown),
  onInput: thumb.onInput,
  onFocus: thumb.onFocus,
  onBlur: thumb.onBlur
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(slider.stateAttrs.value, stateAttrs, ownAttrs, $attrs)"
    :style="thumbStyle"
  >
    <slot v-bind="slider.state.value" />
    <input ref="input" v-bind="inputAttrs" :style="inputStyle" />
  </component>
</template>
