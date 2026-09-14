<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import type { PartProps } from '@/internal/types'
import { ToolbarContext, ToolbarGroupContext, type ToolbarRootState } from './context'

type Props = PartProps & {
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

const { as = 'div', disabled: disabledProp = false } = defineProps<Props>()

defineSlots<{ default?: (state: ToolbarRootState) => any }>()

const toolbar = ToolbarContext.get()

const disabled = computed(() => toolbar.disabled.value || disabledProp)

ToolbarGroupContext.set({ disabled })

const state = computed<ToolbarRootState>(() => ({
  disabled: disabled.value,
  orientation: toolbar.orientation.value
}))

const stateAttrs = computed(() => dataAttrs(state.value))

const ownAttrs = computed(() => ({ role: 'group' }))
</script>

<template>
  <component :is="as" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)">
    <slot v-bind="state" />
  </component>
</template>
