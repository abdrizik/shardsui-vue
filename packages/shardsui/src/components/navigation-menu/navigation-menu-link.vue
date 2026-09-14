<script setup lang="ts">
import { computed, mergeProps, useTemplateRef } from 'vue'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { useCompositeItem } from '@/internal/floating/composite'
import { REASONS } from '@/internal/reasons'
import type { PartProps } from '@/internal/types'
import {
  NavigationMenuCompositeContext,
  NavigationMenuContext,
  type NavigationMenuLinkState
} from './context'

type Props = PartProps & {
  active?: boolean
  closeOnClick?: boolean
  onClick?: (event: MouseEvent) => void
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'a',
  active = false,
  closeOnClick = false,
  onClick,
  onFocus,
  onBlur
} = defineProps<Props>()

defineSlots<{ default?: (state: NavigationMenuLinkState) => any }>()

const navigationMenu = NavigationMenuContext.get()
const composite = NavigationMenuCompositeContext.getOr()

const element = useTemplateRef<HTMLElement>('element')

const item = composite ? useCompositeItem({ composite, ref: element, disabled: false }) : null

function closeMenuOnClick(event: MouseEvent) {
  if (closeOnClick) {
    navigationMenu.setValue(null, REASONS.linkPress, event)
  }
}

function closeOnFocusOut(event: FocusEvent) {
  navigationMenu.closeOnFocusOut(element.value, event)
}

const navigationMenuState = computed<NavigationMenuLinkState>(() => ({ active }))

const stateAttrs = computed(() => dataAttrs({ active }))

const ownAttrs = computed(() => ({
  'aria-current': active ? 'page' : undefined,
  onClick: chain(onClick, closeMenuOnClick),
  onFocus: chain(onFocus, item?.onFocus),
  onBlur: chain(onBlur, closeOnFocusOut)
}))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)">
    <slot v-bind="navigationMenuState" />
  </component>
</template>
