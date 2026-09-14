<script setup lang="ts">
import { computed, mergeProps, useId } from 'vue'
import { registerLabelId } from '@/internal/register-label-id'
import type { PartProps } from '@/internal/types'
import { FieldsetContext, type FieldsetState } from './context'

type Props = PartProps & {
  id?: string
}

defineOptions({ inheritAttrs: false })

const { as = 'div', id: idProp } = defineProps<Props>()

defineSlots<{ default?: (state: FieldsetState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const fieldset = FieldsetContext.get()

registerLabelId(fieldset, () => id.value)
</script>

<template>
  <component :is="as" v-bind="mergeProps(fieldset.stateAttrs.value, { id }, $attrs)">
    <slot v-bind="fieldset.state.value" />
  </component>
</template>
