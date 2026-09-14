<script setup lang="ts">
import { computed, mergeProps, useId } from 'vue'
import { registerLabelId } from '@/internal/register-label-id'
import type { PartProps } from '@/internal/types'
import { MenuGroupContext } from './context'

type Props = PartProps & {
  id?: string
}

defineOptions({ inheritAttrs: false })

const { as = 'div', id: idProp } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const group = MenuGroupContext.get()

registerLabelId(group, () => id.value)

const ownAttrs = computed(() => ({ id: id.value, role: 'presentation' }))
</script>

<template>
  <component :is="as" v-bind="mergeProps(ownAttrs, $attrs)">
    <slot />
  </component>
</template>
