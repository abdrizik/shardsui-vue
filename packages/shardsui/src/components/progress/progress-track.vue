<script setup lang="ts">
import { mergeProps } from 'vue'
import type { PartProps } from '@/internal/types'
import { ProgressContext } from './context'
import type { ProgressState } from './progress'

type Props = PartProps

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<Props>()

defineSlots<{ default?: (state: ProgressState) => any }>()

const progress = ProgressContext.get()
</script>

<template>
  <component :is="as" v-bind="mergeProps(progress.stateAttrs.value, $attrs)">
    <slot v-bind="progress.state.value" />
  </component>
</template>
