<script setup lang="ts">
import { computed, mergeProps, shallowRef } from 'vue'
import type { PartProps } from '@/internal/types'
import { MenuGroupContext } from './context'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: () => any }>()

const labelId = shallowRef<string | undefined>(undefined)
MenuGroupContext.set({ labelId })

const ownAttrs = computed(() => ({ role: 'group', 'aria-labelledby': labelId.value }))
</script>

<template>
  <component :is="as" v-bind="mergeProps(ownAttrs, $attrs)">
    <slot />
  </component>
</template>
