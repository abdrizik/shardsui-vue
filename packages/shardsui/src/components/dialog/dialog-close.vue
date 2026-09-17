<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { usePartElement } from '@/internal/part-element'
import { usePartTag } from '@/internal/part-tag'
import { REASONS } from '@/internal/reasons'
import type { PartProps } from '@/internal/types'
import { DialogContext, type DialogCloseState } from './context'

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

defineSlots<{ default?: (state: DialogCloseState) => any }>()

const dialog = DialogContext.get()

const element = usePartElement()

const tag = usePartTag({ as: () => as, defaultTag: 'button', element })
const button = useButton({
  disabled: () => disabled,
  as: tag,
  onClick: () => chain(onClick, closeOnClick),
  onMousedown: () => onMousedown,
  onKeydown: () => onKeydown,
  onKeyup: () => onKeyup,
  onPointerdown: () => onPointerdown
})

const dialogState = computed<DialogCloseState>(() => ({ disabled }))

const stateAttrs = computed(() => dataAttrs({ disabled }))

function closeOnClick(event: MouseEvent) {
  if (dialog.open.value) dialog.setOpen(false, REASONS.closePress, event)
}
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(button.attrs.value, stateAttrs, $attrs)">
    <slot v-bind="dialogState" />
  </component>
</template>
