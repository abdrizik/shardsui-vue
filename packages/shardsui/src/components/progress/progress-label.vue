<script setup lang="ts">
import { computed, mergeProps, useId } from 'vue'
import { registerLabelId } from '@/internal/register-label-id'
import type { PartProps } from '@/internal/types'
import { ProgressContext } from './context'
import type { ProgressState } from './progress'

type Props = PartProps & {
  id?: string
}

defineOptions({ inheritAttrs: false })

const { as = 'span', id: idProp } = defineProps<Props>()

defineSlots<{ default?: (state: ProgressState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const progress = ProgressContext.get()

registerLabelId(progress, () => id.value)

const ownAttrs = computed(() => ({ id: id.value, role: 'presentation' }))
</script>

<template>
  <component :is="as" v-bind="mergeProps(progress.stateAttrs.value, ownAttrs, $attrs)">
    <slot v-bind="progress.state.value" />
  </component>
</template>
