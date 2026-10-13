<script setup lang="ts">
import { mergeProps } from '@/internal/merge-props'
import type { PartProps } from '@/internal/types'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: () => any }>()
</script>

<template>
  <component :is="as" v-bind="mergeProps({ 'data-drawer-content': '' }, $attrs)">
    <slot />
  </component>
</template>
