<script setup lang="ts">
import { mergeProps } from '@/internal/merge-props'
import type { PartProps } from '@/internal/types'
import { SliderContext } from './context'
import type { SliderState } from './slider'

type Props = PartProps

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<Props>()

defineSlots<{ default?: (state: SliderState) => any }>()

const slider = SliderContext.get()
</script>

<template>
  <component
    :is="as"
    v-bind="mergeProps(slider.stateAttrs.value, $attrs)"
    :style="{ position: 'relative' }"
  >
    <slot v-bind="slider.state.value" />
  </component>
</template>
