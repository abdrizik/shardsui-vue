<script setup lang="ts">
import { computed, mergeProps, useId } from 'vue'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { usePartElement } from '@/internal/part-element'
import type { Orientation, PartProps } from '@/internal/types'
import { MenubarContext } from './context'
import { useMenubarRoot } from './menubar'

export type MenubarState = {
  orientation: Orientation
  modal: boolean
  hasSubmenuOpen: boolean
}

type Props = PartProps & {
  id?: string
  modal?: boolean
  disabled?: boolean
  orientation?: Orientation
  loopFocus?: boolean
  onKeydown?: (event: KeyboardEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  id: idProp,
  modal = true,
  disabled = false,
  orientation = 'horizontal',
  loopFocus = true,
  onKeydown
} = defineProps<Props>()

defineSlots<{ default?: (state: MenubarState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const element = usePartElement()

const menubar = useMenubarRoot({
  id,
  modal: () => modal,
  disabled: () => disabled,
  orientation: () => orientation,
  loopFocus: () => loopFocus,
  ref: element
})

MenubarContext.set(menubar)

const menubarState = computed<MenubarState>(() => ({
  orientation,
  modal,
  hasSubmenuOpen: menubar.hasSubmenuOpen.value
}))

const stateAttrs = computed(() =>
  dataAttrs({ orientation, modal, 'has-submenu-open': menubar.hasSubmenuOpen.value })
)

const ownAttrs = computed(() => ({
  id: id.value,
  role: 'menubar',
  'aria-orientation': orientation,
  onKeydown: chain(onKeydown, menubar.composite.onKeydown)
}))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)">
    <slot v-bind="menubarState" />
  </component>
</template>
