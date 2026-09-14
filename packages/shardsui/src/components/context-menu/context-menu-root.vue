<script setup lang="ts">
import { shallowRef } from 'vue'
import { MenuContext } from '@/components/menu/context'
import MenuRoot from '@/components/menu/menu-root.vue'
import type { VirtualAnchorElement } from '@/internal/floating/anchor-positioning'
import { ContextMenuContext } from './context'

type Props = {
  disabled?: boolean
  loopFocus?: boolean
  orientation?: 'horizontal' | 'vertical'
  highlightItemOnHover?: boolean
}

defineOptions({ inheritAttrs: false })

const {
  disabled = false,
  loopFocus = true,
  orientation = 'vertical',
  highlightItemOnHover = true
} = defineProps<Props>()

const emit = defineEmits<{ openChangeComplete: [open: boolean] }>()

const open = defineModel<boolean>('open', { default: false })

defineSlots<{ default?: () => any }>()

ContextMenuContext.set({
  anchor: shallowRef<VirtualAnchorElement>({
    getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, x: 0, y: 0 })
  }),
  initialCursorPoint: shallowRef<{ x: number; y: number } | null>(null),
  allowMouseUpTrigger: shallowRef(true)
})
MenuContext.set(undefined)
</script>

<template>
  <MenuRoot
    v-model:open="open"
    :disabled="disabled"
    :loop-focus="loopFocus"
    :orientation="orientation"
    :highlight-item-on-hover="highlightItemOnHover"
    @open-change-complete="emit('openChangeComplete', $event)"
  >
    <slot />
  </MenuRoot>
</template>
