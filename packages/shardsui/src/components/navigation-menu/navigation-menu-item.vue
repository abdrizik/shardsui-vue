<script setup lang="ts">
import { computed, useId } from 'vue'
import type { PartProps } from '@/internal/types'
import { NavigationMenuItemContext } from './context'

type Props = PartProps & {
  value?: unknown
}

defineOptions({ inheritAttrs: false })

const { as = 'li', value: valueProp } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const uid = useId()

const value = computed(() => valueProp ?? uid)

NavigationMenuItemContext.set({ value })
</script>

<template>
  <component :is="as" v-bind="$attrs">
    <slot />
  </component>
</template>
