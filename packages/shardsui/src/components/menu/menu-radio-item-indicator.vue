<script setup lang="ts">
import type { PartProps } from '@/internal/types'
import { MenuRadioItemContext, type MenuItemIndicatorState } from './context'
import MenuItemIndicator from './menu-item-indicator.vue'

type Props = PartProps & {
  keepMounted?: boolean
}

defineOptions({ inheritAttrs: false })

const { as = 'span', keepMounted = false } = defineProps<Props>()

defineSlots<{ default?: (state: MenuItemIndicatorState) => any }>()

const item = MenuRadioItemContext.get()
</script>

<template>
  <MenuItemIndicator :item="item" :as="as" :keep-mounted="keepMounted" v-bind="$attrs">
    <template #default="state">
      <slot v-bind="state" />
    </template>
  </MenuItemIndicator>
</template>
