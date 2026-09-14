<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import type { Orientation, PartProps } from '@/internal/types'

type Props = PartProps & {
  orientation?: Orientation
}

defineOptions({ inheritAttrs: false })

const { as = 'div', orientation = 'horizontal' } = defineProps<Props>()

const stateAttrs = computed(() => dataAttrs({ orientation }))

const ownAttrs = computed(() => ({ role: 'separator', 'aria-orientation': orientation }))
</script>

<template>
  <component :is="as" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)" />
</template>
