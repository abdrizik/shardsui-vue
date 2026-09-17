<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { useCompositeRoot } from '@/internal/floating/composite'
import { usePartElement } from '@/internal/part-element'
import type { Orientation, PartProps } from '@/internal/types'
import { ToolbarContext, type ToolbarRootState } from './context'

type Props = PartProps & {
  disabled?: boolean
  orientation?: Orientation
  loopFocus?: boolean
  onKeydown?: (event: KeyboardEvent) => void
  onFocusin?: (event: FocusEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  disabled = false,
  orientation = 'horizontal',
  loopFocus = true,
  onKeydown,
  onFocusin
} = defineProps<Props>()

defineSlots<{ default?: (state: ToolbarRootState) => any }>()

const element = usePartElement()

const composite = useCompositeRoot({
  orientation: () => orientation,
  loopFocus: () => loopFocus,
  ref: element
})

ToolbarContext.set({
  composite,
  disabled: computed(() => disabled),
  orientation: computed(() => orientation)
})

const state = computed<ToolbarRootState>(() => ({ disabled, orientation }))

const stateAttrs = computed(() => dataAttrs(state.value))

const ownAttrs = computed(() => ({
  role: 'toolbar',
  'aria-orientation': orientation,
  onKeydown: chain(onKeydown, composite.onKeydown),
  onFocusin: chain(onFocusin, composite.onFocus)
}))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)">
    <slot v-bind="state" />
  </component>
</template>
