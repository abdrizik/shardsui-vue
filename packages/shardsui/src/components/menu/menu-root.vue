<script setup lang="ts" generic="Payload = unknown">
import { useId } from 'vue'
import { FloatingTreeContext, type FloatingTree } from '@/internal/floating/floating-tree'
import { MenuContext } from './context'
import type { MenuHandle } from './handle'
import { createMenuRoot, type MenuRoot } from './menu'

type Props = {
  disabled?: boolean
  modal?: boolean
  loopFocus?: boolean
  orientation?: 'horizontal' | 'vertical'
  closeParentOnEsc?: boolean
  highlightItemOnHover?: boolean
  handle?: MenuHandle<Payload>
}

defineOptions({ inheritAttrs: false })

const {
  disabled = false,
  modal = true,
  loopFocus = true,
  orientation = 'vertical',
  closeParentOnEsc = false,
  highlightItemOnHover = true,
  handle
} = defineProps<Props>()

const emit = defineEmits<{ openChangeComplete: [open: boolean] }>()

const emitOpenChangeComplete = (open: boolean): void => emit('openChangeComplete', open)

const open = defineModel<boolean>('open', { default: false })
const triggerId = defineModel<string | null>('triggerId', { default: null })

defineSlots<{ default?: (props: { payload: Payload | undefined }) => any }>()

const uid = useId()

const menu: MenuRoot<Payload> = handle ? handle.state : createMenuRoot<Payload>()

menu.register({
  open,
  setOpen: (next) => {
    open.value = next
  },
  disabled: () => disabled,
  modal: () => modal,
  loopFocus: () => loopFocus,
  orientation: () => orientation,
  closeParentOnEsc: () => closeParentOnEsc,
  highlightItemOnHover: () => highlightItemOnHover,
  onOpenChangeComplete: () => emitOpenChangeComplete,
  triggerId,
  setTriggerId: (next) => {
    triggerId.value = next
  },
  ownId: uid
})

MenuContext.set(menu as MenuRoot)
if (menu.providesFloatingTree) {
  FloatingTreeContext.set(menu.tree.value as FloatingTree)
}
</script>

<template>
  <slot :payload="menu.payload.value" />
</template>
