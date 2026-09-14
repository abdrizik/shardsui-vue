<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import type { PartProps } from '@/internal/types'
import type { CollapsibleState } from './collapsible'
import { CollapsibleContext } from './context'

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
  disabled: disabledProp = undefined,
  onClick,
  onMousedown,
  onKeydown,
  onKeyup,
  onPointerdown
} = defineProps<Props>()

defineSlots<{ default?: (state: CollapsibleState) => any }>()

const collapsible = CollapsibleContext.get()

const disabled = computed(() => disabledProp ?? collapsible.disabled.value)

const button = useButton({
  disabled,
  as: () => as,
  focusableWhenDisabled: true,
  onClick: () => chain(onClick, collapsible.toggle),
  onMousedown: () => onMousedown,
  onKeydown: () => onKeydown,
  onKeyup: () => onKeyup,
  onPointerdown: () => onPointerdown
})

const stateAttrs = computed(() =>
  dataAttrs({
    'panel-open': collapsible.open.value,
    disabled: collapsible.disabled.value,
    'starting-style': collapsible.transitionStatus.value === 'starting',
    'ending-style': collapsible.transitionStatus.value === 'ending'
  })
)

const ownAttrs = computed(() => ({
  'aria-expanded': collapsible.open.value,
  'aria-controls': collapsible.open.value ? collapsible.panelId.value : undefined
}))
</script>

<template>
  <component :is="as" v-bind="mergeProps(button.attrs.value, stateAttrs, ownAttrs, $attrs)">
    <slot v-bind="collapsible.state.value" />
  </component>
</template>
