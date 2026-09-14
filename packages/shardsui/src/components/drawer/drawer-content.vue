<script setup lang="ts">
import { mergeProps } from 'vue'
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
