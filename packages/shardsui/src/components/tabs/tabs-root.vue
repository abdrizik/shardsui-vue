<script setup lang="ts">
import { mergeProps } from 'vue'
import type { PartProps } from '@/internal/types'
import { TabsContext } from './context'
import { useTabsRoot, type TabsOrientation, type TabsState, type TabsValue } from './tabs'

type Props = PartProps & {
  orientation?: TabsOrientation
}

defineOptions({ inheritAttrs: false })

const { as = 'div', orientation = 'horizontal' } = defineProps<Props>()

const value = defineModel<TabsValue>('value')

defineSlots<{ default?: (state: TabsState) => any }>()

const tabs = useTabsRoot({
  value,
  setValue: (next) => {
    value.value = next
  },
  orientation: () => orientation
})

TabsContext.set(tabs)
</script>

<template>
  <component :is="as" v-bind="mergeProps(tabs.stateAttrs.value, $attrs)">
    <slot v-bind="tabs.state.value" />
  </component>
</template>
