<script setup lang="ts">
import { computed, mergeProps, type CSSProperties } from 'vue'
import type { PartProps } from '@/internal/types'
import { valueToPercent } from '@/internal/value-to-percent'
import { SliderContext } from './context'
import type { SliderState } from './slider'

type Props = PartProps

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<Props>()

defineSlots<{ default?: (state: SliderState) => any }>()

const slider = SliderContext.get()

const vertical = computed(() => slider.orientation.value === 'vertical')

const style = computed<CSSProperties>(() => {
  const startEdge = vertical.value ? 'bottom' : 'insetInlineStart'
  const mainSide = vertical.value ? 'height' : 'width'
  const crossSide = vertical.value ? 'width' : 'height'
  const styles: Record<string, string> = {
    position: vertical.value ? 'absolute' : 'relative',
    [crossSide]: 'inherit'
  }

  const values = slider.values.value
  const range = slider.range.value

  if (slider.inset.value) {
    const start = slider.indicatorStart.value
    const end = slider.indicatorEnd.value

    if (start === undefined || (range && end === undefined)) {
      styles.visibility = 'hidden'
    }

    styles['--start-position'] = `${start ?? 0}%`

    if (!range) {
      styles[startEdge] = '0'
      styles[mainSide] = 'var(--start-position)'
    } else {
      styles['--relative-size'] = `${(end ?? 0) - (start ?? 0)}%`
      styles[startEdge] = 'var(--start-position)'
      styles[mainSide] = 'var(--relative-size)'
    }
  } else {
    const start = valueToPercent(values[0], slider.min.value, slider.max.value)
    const end = valueToPercent(values[values.length - 1], slider.min.value, slider.max.value)

    if (!range) {
      styles[startEdge] = '0'
      styles[mainSide] = `${start}%`
    } else {
      styles[startEdge] = `${start}%`
      styles[mainSide] = `${end - start}%`
    }
  }

  return styles
})
</script>

<template>
  <component :is="as" v-bind="mergeProps(slider.stateAttrs.value, $attrs)" :style="style">
    <slot v-bind="slider.state.value" />
  </component>
</template>
