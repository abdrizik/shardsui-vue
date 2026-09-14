<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import { createLabelable } from '@/internal/labelable'
import { LabelableContext } from '@/internal/labelable-context'
import type { PartProps } from '@/internal/types'
import { FieldContext, FieldItemContext, type FieldRootState } from './context'
import { getFieldState, getFieldStateAttrs } from './field'

type Props = PartProps & {
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

const { as = 'div', disabled: disabledProp = false } = defineProps<Props>()

defineSlots<{ default?: (state: FieldRootState) => any }>()

const field = FieldContext.get()
const labelable = LabelableContext.get()

const disabled = computed(() => field.disabled.value || disabledProp)

FieldItemContext.set({ disabled })
LabelableContext.set(createLabelable(labelable))

const fieldState = computed<FieldRootState>(() => ({
  ...getFieldState(field),
  disabled: disabled.value
}))

const stateAttrs = computed(() =>
  dataAttrs({ disabled: disabled.value, ...getFieldStateAttrs(field) })
)
</script>

<template>
  <component :is="as" v-bind="mergeProps(stateAttrs, $attrs)">
    <slot v-bind="fieldState" />
  </component>
</template>
