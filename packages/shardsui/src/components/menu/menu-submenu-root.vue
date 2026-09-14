<script setup lang="ts">
import { MenuSubmenuContext } from './context'
import MenuRoot from './menu-root.vue'

type Props = {
  disabled?: boolean
  loopFocus?: boolean
  orientation?: 'horizontal' | 'vertical'
  closeParentOnEsc?: boolean
  highlightItemOnHover?: boolean
}

defineOptions({ inheritAttrs: false })

const {
  disabled = false,
  loopFocus = true,
  orientation = 'vertical',
  closeParentOnEsc = false,
  highlightItemOnHover = true
} = defineProps<Props>()

const emit = defineEmits<{ openChangeComplete: [open: boolean] }>()

const open = defineModel<boolean>('open', { default: false })

defineSlots<{ default?: () => any }>()

MenuSubmenuContext.set(true)
</script>

<template>
  <MenuRoot
    v-model:open="open"
    :disabled="disabled"
    :loop-focus="loopFocus"
    :orientation="orientation"
    :close-parent-on-esc="closeParentOnEsc"
    :highlight-item-on-hover="highlightItemOnHover"
    @open-change-complete="emit('openChangeComplete', $event)"
  >
    <slot />
  </MenuRoot>
</template>
