<script setup lang="ts" generic="Value = unknown">
import { computed, mergeProps } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import {
  NavigationMenuContext,
  NavigationMenuPositionerContext,
  type NavigationMenuRootState
} from './context'
import { useNavigationMenuRoot, type NavigationMenuRoot } from './navigation-menu'

type Props = PartProps & {
  delay?: number
  closeDelay?: number
  orientation?: 'horizontal' | 'vertical'
}

defineOptions({ inheritAttrs: false })

const { as, delay = 50, closeDelay = 50, orientation = 'horizontal' } = defineProps<Props>()

const emit = defineEmits<{ openChangeComplete: [open: boolean] }>()

const emitOpenChangeComplete = (open: boolean): void => emit('openChangeComplete', open)

const value = defineModel<Value | null>('value', { default: null })

defineSlots<{ default?: (state: NavigationMenuRootState) => any }>()

const parent = NavigationMenuContext.getOr()

const tag = computed(() => as ?? (parent ? 'div' : 'nav'))

const element = usePartElement()

const navigationMenu = useNavigationMenuRoot({
  value,
  setValue: (next) => {
    value.value = next as Value | null
  },
  delay: () => delay,
  closeDelay: () => closeDelay,
  orientation: () => orientation,
  onOpenChangeComplete: () => emitOpenChangeComplete,
  parentRoot: parent,
  ref: element
})

NavigationMenuContext.set(navigationMenu as NavigationMenuRoot)
NavigationMenuPositionerContext.set(undefined)

const navigationMenuState = computed<NavigationMenuRootState>(() => ({
  open: navigationMenu.open.value,
  nested: navigationMenu.nested.value
}))

const stateAttrs = computed(() =>
  dataAttrs({ open: navigationMenu.open.value, nested: navigationMenu.nested.value })
)
</script>

<template>
  <component :is="tag" ref="element" v-bind="mergeProps(stateAttrs, $attrs)">
    <slot v-bind="navigationMenuState" />
  </component>
</template>
