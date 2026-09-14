<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import type { Orientation, PartProps } from '@/internal/types'

type Props = PartProps & {
  orientation?: Orientation
}

defineOptions({ inheritAttrs: false })

const { as = 'div', orientation = 'horizontal' } = defineProps<Props>()

const ownAttrs = computed(() => ({ 'data-orientation': orientation, role: 'presentation' }))
</script>

<template>
  <component :is="as" v-bind="mergeProps(ownAttrs, $attrs)" />
</template>
