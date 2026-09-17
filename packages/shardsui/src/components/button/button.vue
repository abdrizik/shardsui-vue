<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { useButton } from '@/internal/button'
import { dataAttrs } from '@/internal/data-attrs'
import { usePartElement } from '@/internal/part-element'
import { usePartTag } from '@/internal/part-tag'
import type { PartProps } from '@/internal/types'

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

defineSlots<{ default?: (state: { disabled: boolean }) => any }>()

const element = usePartElement()

const tag = usePartTag({ as: () => as, defaultTag: 'button', element })
const button = useButton({
  disabled: () => disabled,
  as: tag,
  onClick: () => onClick,
  onMousedown: () => onMousedown,
  onKeydown: () => onKeydown,
  onKeyup: () => onKeyup,
  onPointerdown: () => onPointerdown
})

const stateAttrs = computed(() => dataAttrs({ disabled }))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(button.attrs.value, stateAttrs, $attrs)">
    <slot :disabled="disabled" />
  </component>
</template>
