<script
  setup
  lang="ts"
  generic="Value extends number | readonly number[] = number | readonly number[]"
>
import { computed, mergeProps, shallowRef, useId, useTemplateRef, watchSyncEffect } from 'vue'
import type { Orientation, PartProps } from '@/internal/types'
import { SliderContext } from './context'
import { useSliderRoot, type SliderState, type SliderValue } from './slider'

type Props = PartProps & {
  id?: string
  value?: Value
  min?: number
  max?: number
  step?: number
  largeStep?: number
  orientation?: Orientation
  disabled?: boolean
  minStepsBetweenValues?: number
  name?: string
  form?: string
  format?: Intl.NumberFormatOptions
  locale?: Intl.LocalesArgument
  thumbCollisionBehavior?: 'push' | 'swap' | 'none'
  thumbAlignment?: 'center' | 'edge'
  ariaLabelledby?: string
  ariaDescribedby?: string
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  id: idProp,
  value: valueProp,
  min = 0,
  max = 100,
  step = 1,
  largeStep = 10,
  orientation = 'horizontal',
  disabled = false,
  minStepsBetweenValues = 0,
  name,
  form,
  format,
  locale,
  thumbCollisionBehavior = 'push',
  thumbAlignment = 'center',
  ariaLabelledby,
  ariaDescribedby
} = defineProps<Props>()

const emit = defineEmits<{
  'update:value': [value: Value]
  valueCommitted: [value: Value]
}>()

defineSlots<{ default?: (state: SliderState) => any }>()

const uid = useId()

const element = useTemplateRef<HTMLElement>('element')

const localValue = shallowRef<Value | undefined>(valueProp)

watchSyncEffect(() => {
  localValue.value = valueProp
})

const slider = useSliderRoot({
  uid,
  id: () => idProp,
  value: () => localValue.value ?? min,
  setValue: (next) => {
    localValue.value = next as Value
    emit('update:value', next as Value)
  },
  min: () => min,
  max: () => max,
  step: () => step,
  largeStep: () => largeStep,
  orientation: () => orientation,
  disabled: () => disabled,
  minStepsBetweenValues: () => minStepsBetweenValues,
  thumbCollisionBehavior: () => thumbCollisionBehavior,
  thumbAlignment: () => thumbAlignment,
  name: () => name,
  form: () => form,
  format: () => format,
  locale: () => locale,
  ariaLabelledBy: () => ariaLabelledby ?? undefined,
  ariaDescribedBy: () => ariaDescribedby ?? undefined,
  onValueCommitted: (next: SliderValue) => emit('valueCommitted', next as Value),
  ref: element
})

SliderContext.set(slider)

const ownAttrs = computed(() => ({
  id: slider.id.value,
  role: 'group',
  'aria-labelledby': slider.ariaLabelledBy.value,
  'aria-describedby': slider.ariaDescribedBy.value,
  'aria-invalid': slider.ariaInvalid.value
}))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(slider.stateAttrs.value, ownAttrs, $attrs)">
    <slot v-bind="slider.state.value" />
  </component>
</template>
