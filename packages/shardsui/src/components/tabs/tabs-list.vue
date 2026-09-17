<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { chain } from '@/internal/chain'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import { TabsContext, TabsListContext } from './context'
import { useTabsList } from './list'
import type { TabsState } from './tabs'

type Props = PartProps & {
  activateOnFocus?: boolean
  loopFocus?: boolean
  onKeydown?: (event: KeyboardEvent) => void
}

defineOptions({ inheritAttrs: false })

const { as = 'div', activateOnFocus = false, loopFocus = true, onKeydown } = defineProps<Props>()

defineSlots<{ default?: (state: TabsState) => any }>()

const tabs = TabsContext.get()

const element = usePartElement()

const list = useTabsList({
  orientation: tabs.orientation,
  activateOnFocus: () => activateOnFocus,
  loopFocus: () => loopFocus,
  ref: element
})

TabsListContext.set(list)

const ownAttrs = computed(() => ({
  role: 'tablist',
  'aria-orientation': tabs.orientation.value === 'vertical' ? 'vertical' : undefined,
  onKeydown: chain(onKeydown, list.composite.onKeydown)
}))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(tabs.stateAttrs.value, ownAttrs, $attrs)">
    <slot v-bind="tabs.state.value" />
  </component>
</template>
