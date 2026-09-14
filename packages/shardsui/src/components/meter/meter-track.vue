<script setup lang="ts">
import type { PartProps } from '@/internal/types'

type Props = PartProps

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<Props>()

defineSlots<{ default?: () => any }>()
</script>

<template>
  <component :is="as" v-bind="$attrs">
    <slot />
  </component>
</template>
