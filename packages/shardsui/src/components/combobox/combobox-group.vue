<script setup lang="ts">
import { computed, mergeProps, shallowRef } from 'vue'
import type { PartProps } from '@/internal/types'
import { ComboboxGroupContext, ComboboxGroupItemsContext } from './context'

type Props = PartProps & {
  items?: readonly unknown[]
}

defineOptions({ inheritAttrs: false })

const { as = 'div', items = undefined } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const labelId = shallowRef<string | undefined>(undefined)
ComboboxGroupContext.set({ labelId })

const groupItems = computed(() => items ?? [])

if (items !== undefined) {
  ComboboxGroupItemsContext.set({ items: groupItems })
}

const ownAttrs = computed(() => ({ role: 'group', 'aria-labelledby': labelId.value }))
</script>

<template>
  <component :is="as" v-bind="mergeProps(ownAttrs, $attrs)">
    <slot />
  </component>
</template>
