<script setup lang="ts">
import { computed, mergeProps, useId } from 'vue'
import { registerLabelId } from '@/internal/register-label-id'
import type { PartProps } from '@/internal/types'
import { MeterContext } from './context'

type Props = PartProps & {
  id?: string
}

defineOptions({ inheritAttrs: false })

const { as = 'span', id: idProp } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const meter = MeterContext.get()

registerLabelId(meter, () => id.value)

const ownAttrs = computed(() => ({ id: id.value, role: 'presentation' }))
</script>

<template>
  <component :is="as" v-bind="mergeProps(ownAttrs, $attrs)">
    <slot />
  </component>
</template>
