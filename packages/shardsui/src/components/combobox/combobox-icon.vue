<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import type { PartProps } from '@/internal/types'

type Props = PartProps

defineOptions({ inheritAttrs: false })

const { as = 'span' } = defineProps<Props>()

const slots = defineSlots<{ default?: () => any }>()

const ownAttrs = computed(() => ({ 'aria-hidden': 'true' }))
</script>

<template>
  <component :is="as" v-bind="mergeProps(ownAttrs, $attrs)">
    <slot v-if="slots.default" />
    <template v-else>▼</template>
  </component>
</template>
