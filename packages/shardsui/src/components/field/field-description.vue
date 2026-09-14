<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, useId, watchEffect } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import { LabelableContext } from '@/internal/labelable-context'
import type { PartProps } from '@/internal/types'
import { FieldContext, FieldItemContext, type FieldRootState } from './context'
import { getFieldState, getFieldStateAttrs } from './field'

type Props = PartProps & {
  id?: string
}

defineOptions({ inheritAttrs: false })

const { as = 'p', id: idProp } = defineProps<Props>()

defineSlots<{ default?: (state: FieldRootState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const field = FieldContext.get()
const item = FieldItemContext.getOr()
const labelable = LabelableContext.get()

watchEffect(() => {
  const current = id.value
  if (!current) return
  onWatcherCleanup(labelable.registerMessageId(current))
})

const disabled = computed(() => field.disabled.value || (item?.disabled.value ?? false))

const fieldState = computed<FieldRootState>(() => ({
  ...getFieldState(field),
  disabled: disabled.value
}))

const stateAttrs = computed(() =>
  dataAttrs({ disabled: disabled.value, ...getFieldStateAttrs(field) })
)
</script>

<template>
  <component :is="as" v-bind="mergeProps(stateAttrs, { id }, $attrs)">
    <slot v-bind="fieldState" />
  </component>
</template>
