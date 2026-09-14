<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import type { PartProps } from '@/internal/types'
import { ProgressContext } from './context'
import type { ProgressState } from './progress'

type Props = PartProps

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<Props>()

defineSlots<{ default?: (state: ProgressState) => any }>()

const progress = ProgressContext.get()

const style = computed(() =>
  progress.percentageValue.value != null
    ? `inset-inline-start:0;height:inherit;width:${progress.percentageValue.value}%`
    : undefined
)
</script>

<template>
  <component :is="as" v-bind="mergeProps(progress.stateAttrs.value, $attrs)" :style="style">
    <slot v-bind="progress.state.value" />
  </component>
</template>
