<script setup lang="ts">
import { mergeProps } from 'vue'
import type { PartProps } from '@/internal/types'
import { SwitchContext, type SwitchState } from './context'

defineOptions({ inheritAttrs: false })

const { as = 'span' } = defineProps<PartProps>()

defineSlots<{ default?: (state: SwitchState) => any }>()

const switchRoot = SwitchContext.get()
</script>

<template>
  <component :is="as" v-bind="mergeProps(switchRoot.stateAttrs.value, $attrs)">
    <slot v-bind="switchRoot.state.value" />
  </component>
</template>
