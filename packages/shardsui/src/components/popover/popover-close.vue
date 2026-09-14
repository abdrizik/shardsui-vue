<script setup lang="ts">
import { mergeProps, onScopeDispose } from 'vue'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { REASONS } from '@/internal/reasons'
import type { PartProps } from '@/internal/types'
import { PopoverClosePartContext, PopoverContext } from './context'

type Props = PartProps & {
  disabled?: boolean
  onClick?: (event: MouseEvent) => void
  onMousedown?: (event: MouseEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onKeyup?: (event: KeyboardEvent) => void
  onPointerdown?: (event: PointerEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'button',
  disabled = false,
  onClick,
  onMousedown,
  onKeydown,
  onKeyup,
  onPointerdown
} = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const popover = PopoverContext.get()
const closePart = PopoverClosePartContext.getOr()

const button = useButton({
  disabled: () => disabled,
  as: () => as,
  onClick: () => chain(onClick, closeOnClick),
  onMousedown: () => onMousedown,
  onKeydown: () => onKeydown,
  onKeyup: () => onKeyup,
  onPointerdown: () => onPointerdown
})

const unregister = closePart?.register()
onScopeDispose(() => unregister?.())

function closeOnClick(event: MouseEvent) {
  popover.setOpen(false, REASONS.closePress, event)
}
</script>

<template>
  <component :is="as" v-bind="mergeProps(button.attrs.value, $attrs)">
    <slot />
  </component>
</template>
