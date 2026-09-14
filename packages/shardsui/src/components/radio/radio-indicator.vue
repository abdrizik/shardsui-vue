<script setup lang="ts">
import { computed, mergeProps, useTemplateRef } from 'vue'
import { useItemIndicator } from '@/internal/item-indicator'
import type { TransitionStatus } from '@/internal/transition-status'
import type { PartProps } from '@/internal/types'
import { RadioContext, type RadioState } from './context'

type Props = PartProps & {
  keepMounted?: boolean
}

defineOptions({ inheritAttrs: false })

const { as = 'span', keepMounted = false } = defineProps<Props>()

defineSlots<{
  default?: (state: RadioState & { transitionStatus: TransitionStatus }) => any
}>()

const radio = RadioContext.get()

const element = useTemplateRef<HTMLElement>('element')

const indicator = useItemIndicator({
  keepMounted: () => keepMounted,
  element,
  open: () => radio.state.value.checked
})

const indicatorState = computed(() => ({
  ...radio.state.value,
  transitionStatus: indicator.transitionStatus.value
}))
</script>

<template>
  <component
    :is="as"
    v-if="indicator.shouldRender.value"
    ref="element"
    v-bind="mergeProps(radio.stateAttrs.value, indicator.stateAttrs.value, $attrs)"
  >
    <slot v-bind="indicatorState" />
  </component>
</template>
