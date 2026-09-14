<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, useTemplateRef, watchPostEffect } from 'vue'
import { chain } from '@/internal/chain'
import type { PartProps } from '@/internal/types'
import { SliderContext } from './context'
import { useSliderControl } from './control'
import type { SliderState } from './slider'

type Props = PartProps & {
  onPointerdown?: (event: PointerEvent) => void
}

defineOptions({ inheritAttrs: false })

const { as = 'div', onPointerdown } = defineProps<Props>()

defineSlots<{ default?: (state: SliderState) => any }>()

const slider = SliderContext.get()

const element = useTemplateRef<HTMLElement>('element')

const control = useSliderControl(slider)

watchPostEffect(() => {
  const node = element.value
  if (!node) return
  onWatcherCleanup(control.publishControlElement(node))
})

const ownAttrs = computed(() => ({
  onPointerdown: chain(onPointerdown, control.onPointerdown)
}))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(slider.stateAttrs.value, ownAttrs, $attrs)">
    <slot v-bind="slider.state.value" />
  </component>
</template>
